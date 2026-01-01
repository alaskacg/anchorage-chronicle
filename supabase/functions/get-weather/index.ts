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
  { name: 'Kodiak', lat: 57.79, lng: -152.4072 },
  { name: 'Bethel', lat: 60.7922, lng: -161.7558 },
  { name: 'Nome', lat: 64.5011, lng: -165.4064 },
  { name: 'Ketchikan', lat: 55.3422, lng: -131.6461 },
  { name: 'Sitka', lat: 57.0531, lng: -135.33 },
  { name: 'Valdez', lat: 61.1309, lng: -146.3483 },
]

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

// Map Open-Meteo weather codes to readable conditions
function weatherCodeToCondition(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly Cloudy'
  if (code <= 49) return 'Cloudy'
  if (code <= 57) return 'Rain'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Rain'
  if (code <= 86) return 'Snow'
  if (code <= 99) return 'Thunderstorm'
  return 'Cloudy'
}

// Convert wind degrees to compass direction
function degreesToDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

// Celsius to Fahrenheit
function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32)
}

// km/h to mph
function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371)
}

// Fetch real weather from Open-Meteo (free, no API key required)
async function fetchRealWeather(city: { name: string; lat: number; lng: number }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&timezone=America/Anchorage&forecast_days=1`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`)
  }
  
  const data: OpenMeteoResponse = await response.json()
  
  return {
    location: city.name,
    temperature_f: cToF(data.current.temperature_2m),
    condition: weatherCodeToCondition(data.current.weather_code),
    high_f: cToF(data.daily.temperature_2m_max[0]),
    low_f: cToF(data.daily.temperature_2m_min[0]),
    humidity: Math.round(data.current.relative_humidity_2m),
    wind_mph: kmhToMph(data.current.wind_speed_10m),
    wind_direction: degreesToDirection(data.current.wind_direction_10m),
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

    console.log(`Fetching real weather data${city ? ` for ${city}` : ' for all cities'}`)

    // Fetch weather data for requested city or all cities
    let weatherData: Awaited<ReturnType<typeof fetchRealWeather>>[] = []
    
    if (city) {
      const foundCity = alaskaCities.find(c => 
        c.name.toLowerCase() === city.toLowerCase()
      )
      if (foundCity) {
        const data = await fetchRealWeather(foundCity)
        weatherData = [data]
      } else {
        return new Response(
          JSON.stringify({ error: 'City not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
    } else {
      // Fetch all cities in parallel
      const results = await Promise.allSettled(
        alaskaCities.map(c => fetchRealWeather(c))
      )
      weatherData = results
        .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchRealWeather>>> => r.status === 'fulfilled')
        .map(r => r.value)
    }

    // Optionally update the database
    if (updateDb && weatherData.length > 0) {
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
        source: 'Open-Meteo API (real-time)',
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
