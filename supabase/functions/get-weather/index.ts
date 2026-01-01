import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Alaska cities with their coordinates
const alaskaCities = [
  { name: 'Anchorage', lat: 61.2181, lng: -149.9003 },
  { name: 'Fairbanks', lat: 64.8378, lng: -147.7164 },
  { name: 'Juneau', lat: 58.3019, lng: -134.4197 },
  { name: 'Barrow (Utqiaġvik)', lat: 71.2906, lng: -156.7886 },
  { name: 'Kodiak', lat: 57.7900, lng: -152.4072 },
  { name: 'Bethel', lat: 60.7922, lng: -161.7558 },
  { name: 'Nome', lat: 64.5011, lng: -165.4064 },
  { name: 'Ketchikan', lat: 55.3422, lng: -131.6461 },
  { name: 'Sitka', lat: 57.0531, lng: -135.3300 },
  { name: 'Valdez', lat: 61.1309, lng: -146.3483 },
]

// Generate realistic weather based on location and season
function generateRealisticWeather(city: { name: string; lat: number; lng: number }) {
  const now = new Date()
  const month = now.getMonth()
  const hour = now.getHours()

  // Base temperature varies by latitude (further north = colder)
  const latitudeEffect = (city.lat - 55) * -2
  
  // Seasonal variation
  const isWinter = month >= 10 || month <= 2
  const isSummer = month >= 5 && month <= 8
  const seasonalBase = isWinter ? -10 : isSummer ? 55 : 35
  
  // Time of day variation
  const hourEffect = hour >= 10 && hour <= 16 ? 5 : -3
  
  // Random daily variation
  const randomVariation = Math.floor(Math.random() * 15) - 7
  
  const temperature = Math.round(seasonalBase + latitudeEffect + hourEffect + randomVariation)
  
  // Determine condition based on temperature and randomness
  const conditions = temperature < 20 
    ? ['Snow', 'Snow', 'Cloudy', 'Partly Cloudy']
    : temperature < 40 
      ? ['Cloudy', 'Partly Cloudy', 'Rain', 'Clear']
      : ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain']
  
  const condition = conditions[Math.floor(Math.random() * conditions.length)]
  
  // Calculate other weather metrics
  const high = temperature + Math.floor(Math.random() * 8) + 3
  const low = temperature - Math.floor(Math.random() * 10) - 5
  const humidity = Math.floor(Math.random() * 40) + 40
  const windMph = Math.floor(Math.random() * 20) + 5
  const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)]
  
  return {
    location: city.name,
    temperature_f: temperature,
    condition,
    high_f: high,
    low_f: low,
    humidity,
    wind_mph: windMph,
    wind_direction: windDirection,
    lat: city.lat,
    lng: city.lng,
    updated_at: new Date().toISOString()
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const city = url.searchParams.get('city')
    const updateDb = url.searchParams.get('update') === 'true'

    console.log(`Fetching weather data${city ? ` for ${city}` : ' for all cities'}`)

    // Generate weather data for requested city or all cities
    let weatherData
    
    if (city) {
      const foundCity = alaskaCities.find(c => 
        c.name.toLowerCase() === city.toLowerCase()
      )
      if (foundCity) {
        weatherData = [generateRealisticWeather(foundCity)]
      } else {
        return new Response(
          JSON.stringify({ error: 'City not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
    } else {
      weatherData = alaskaCities.map(generateRealisticWeather)
    }

    // Optionally update the database
    if (updateDb) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      for (const data of weatherData) {
        const { error } = await supabase
          .from('weather')
          .upsert(
            {
              location: data.location,
              temperature_f: data.temperature_f,
              condition: data.condition,
              high_f: data.high_f,
              low_f: data.low_f,
              humidity: data.humidity,
              wind_mph: data.wind_mph,
              wind_direction: data.wind_direction,
              updated_at: data.updated_at
            },
            { onConflict: 'location' }
          )

        if (error) {
          console.error(`Error updating weather for ${data.location}:`, error)
        }
      }

      console.log(`Updated weather data for ${weatherData.length} cities in database`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: weatherData,
        updated_at: new Date().toISOString(),
        count: weatherData.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching weather:', errorMessage)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch weather data', details: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
