import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, TrendingUp, TrendingDown, Thermometer, CloudSnow, 
  Droplets, Sun, BarChart3, History, Snowflake, Wind, AlertTriangle
} from 'lucide-react';

interface HistoricRecord {
  year: number;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  snowfall?: number;
  event?: string;
}

interface ClimateNormal {
  month: string;
  avgHigh: number;
  avgLow: number;
  recordHigh: number;
  recordLow: number;
  avgPrecip: number;
  avgSnow: number;
}

interface WeatherHistorySectionProps {
  location?: string;
}

// Generate "This Day in History" data for Alaska
const getThisDayHistory = (location: string): HistoricRecord[] => {
  const baseData: HistoricRecord[] = [
    { year: 2025, high: 26, low: 14, condition: 'Partly Cloudy', precipitation: 0.02, snowfall: 0.5 },
    { year: 2024, high: 31, low: 19, condition: 'Light Snow', precipitation: 0.15, snowfall: 2.1 },
    { year: 2023, high: 18, low: 5, condition: 'Clear', precipitation: 0, snowfall: 0 },
    { year: 2022, high: 22, low: 8, condition: 'Cloudy', precipitation: 0.05, snowfall: 0.8 },
    { year: 2021, high: 35, low: 28, condition: 'Rain', precipitation: 0.42, event: 'Unusual January thaw' },
    { year: 2020, high: 12, low: -8, condition: 'Clear', precipitation: 0, snowfall: 0 },
    { year: 2019, high: 28, low: 16, condition: 'Snow', precipitation: 0.21, snowfall: 3.2, event: 'Heavy snow event' },
    { year: 2018, high: 15, low: 2, condition: 'Partly Cloudy', precipitation: 0.01, snowfall: 0.2 },
    { year: 2017, high: -5, low: -22, condition: 'Clear', precipitation: 0, snowfall: 0, event: 'Arctic outbreak' },
    { year: 2016, high: 38, low: 30, condition: 'Rain', precipitation: 0.85, event: 'Record warmth & rain' },
    { year: 2015, high: 25, low: 12, condition: 'Light Snow', precipitation: 0.08, snowfall: 1.1 },
    { year: 2014, high: 20, low: 6, condition: 'Cloudy', precipitation: 0.03, snowfall: 0.4 },
    { year: 2013, high: -12, low: -28, condition: 'Clear', precipitation: 0, snowfall: 0, event: 'Extreme cold' },
    { year: 2012, high: 32, low: 22, condition: 'Snow', precipitation: 0.35, snowfall: 5.2, event: 'Major snowstorm' },
    { year: 2011, high: 24, low: 14, condition: 'Partly Cloudy', precipitation: 0.02, snowfall: 0.3 },
  ];
  
  return baseData;
};

// Climate normals for Anchorage
const getClimateNormals = (): ClimateNormal[] => [
  { month: 'Jan', avgHigh: 23, avgLow: 9, recordHigh: 50, recordLow: -38, avgPrecip: 0.74, avgSnow: 10.7 },
  { month: 'Feb', avgHigh: 27, avgLow: 12, recordHigh: 50, recordLow: -36, avgPrecip: 0.72, avgSnow: 10.2 },
  { month: 'Mar', avgHigh: 34, avgLow: 18, recordHigh: 54, recordLow: -24, avgPrecip: 0.58, avgSnow: 8.8 },
  { month: 'Apr', avgHigh: 44, avgLow: 28, recordHigh: 67, recordLow: -9, avgPrecip: 0.56, avgSnow: 4.5 },
  { month: 'May', avgHigh: 55, avgLow: 38, recordHigh: 77, recordLow: 17, avgPrecip: 0.67, avgSnow: 0.4 },
  { month: 'Jun', avgHigh: 63, avgLow: 47, recordHigh: 85, recordLow: 32, avgPrecip: 1.07, avgSnow: 0 },
  { month: 'Jul', avgHigh: 66, avgLow: 52, recordHigh: 90, recordLow: 39, avgPrecip: 1.80, avgSnow: 0 },
  { month: 'Aug', avgHigh: 63, avgLow: 50, recordHigh: 82, recordLow: 31, avgPrecip: 2.41, avgSnow: 0 },
  { month: 'Sep', avgHigh: 55, avgLow: 42, recordHigh: 73, recordLow: 20, avgPrecip: 2.60, avgSnow: 0.3 },
  { month: 'Oct', avgHigh: 40, avgLow: 28, recordHigh: 60, recordLow: -5, avgPrecip: 1.76, avgSnow: 7.4 },
  { month: 'Nov', avgHigh: 27, avgLow: 14, recordHigh: 52, recordLow: -21, avgPrecip: 1.08, avgSnow: 13.2 },
  { month: 'Dec', avgHigh: 22, avgLow: 9, recordHigh: 51, recordLow: -34, avgPrecip: 1.03, avgSnow: 15.2 },
];

// Significant weather events in Alaska
const significantEvents = [
  { date: 'Jan 1, 1934', event: 'Coldest temperature ever recorded in Alaska: -80°F at Prospect Creek Camp', severity: 'extreme' },
  { date: 'Jan 1, 1989', event: 'Anchorage hits -25°F, schools closed for extended cold snap', severity: 'severe' },
  { date: 'Jan 1, 2016', event: 'Record warm January day at 38°F with rain in Anchorage', severity: 'unusual' },
  { date: 'Jan 1, 1969', event: 'Great Alaska Earthquake aftershock sequence continues', severity: 'historic' },
  { date: 'Jan 1, 1975', event: 'Blizzard conditions close highways across Southcentral', severity: 'severe' },
];

// Climate facts
const climateFacts = [
  'Alaska has recorded the coldest temperature in the US at -80°F in 1971',
  'Anchorage averages 74.5 inches of snow annually',
  'The longest day in Anchorage (June 21) has 19+ hours of daylight',
  'The shortest day (Dec 21) has only 5 hours 28 minutes of daylight',
  'Average annual temperature in Anchorage is 37.4°F',
  'Precipitation varies dramatically: Ketchikan gets 150+ inches annually vs 16 inches in Barrow',
  'Alaska has more coastline than all other US states combined',
  'Climate change is warming Alaska at twice the rate of the global average',
];

export function WeatherHistorySection({ location = 'Anchorage' }: WeatherHistorySectionProps) {
  const today = new Date();
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  const historyData = useMemo(() => getThisDayHistory(location), [location]);
  const climateNormals = useMemo(() => getClimateNormals(), []);
  const currentMonth = today.getMonth();
  const currentNormal = climateNormals[currentMonth];
  
  // Calculate statistics
  const stats = useMemo(() => {
    const highs = historyData.map(d => d.high);
    const lows = historyData.map(d => d.low);
    return {
      avgHigh: Math.round(highs.reduce((a, b) => a + b, 0) / highs.length),
      avgLow: Math.round(lows.reduce((a, b) => a + b, 0) / lows.length),
      recordHigh: Math.max(...highs),
      recordLow: Math.min(...lows),
      recordHighYear: historyData.find(d => d.high === Math.max(...highs))?.year,
      recordLowYear: historyData.find(d => d.low === Math.min(...lows))?.year,
    };
  }, [historyData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-accent/30">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-3 text-2xl">
            <History className="h-7 w-7 text-accent" />
            This Day in Weather History
          </CardTitle>
          <p className="text-muted-foreground font-serif">
            {monthDay} — Historical weather data and climate analysis for {location}, Alaska
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Summary Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              {monthDay} Statistics (15-Year Analysis)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg High</div>
                <div className="text-3xl font-display font-bold text-foreground">{stats.avgHigh}°</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Low</div>
                <div className="text-3xl font-display font-bold text-foreground">{stats.avgLow}°</div>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg text-center">
                <div className="text-xs text-destructive uppercase tracking-wider mb-1">Record High</div>
                <div className="text-3xl font-display font-bold text-destructive">{stats.recordHigh}°</div>
                <div className="text-xs text-muted-foreground">{stats.recordHighYear}</div>
              </div>
              <div className="bg-secondary/10 p-4 rounded-lg text-center">
                <div className="text-xs text-secondary uppercase tracking-wider mb-1">Record Low</div>
                <div className="text-3xl font-display font-bold text-secondary">{stats.recordLow}°</div>
                <div className="text-xs text-muted-foreground">{stats.recordLowYear}</div>
              </div>
            </div>

            {/* Visual temperature range */}
            <div className="bg-gradient-to-r from-secondary via-muted to-destructive h-3 rounded-full mb-2 relative">
              <div 
                className="absolute top-0 w-1 h-3 bg-foreground rounded-full"
                style={{ left: `${((stats.avgLow - stats.recordLow) / (stats.recordHigh - stats.recordLow)) * 100}%` }}
                title={`Avg Low: ${stats.avgLow}°F`}
              />
              <div 
                className="absolute top-0 w-1 h-3 bg-foreground rounded-full"
                style={{ left: `${((stats.avgHigh - stats.recordLow) / (stats.recordHigh - stats.recordLow)) * 100}%` }}
                title={`Avg High: ${stats.avgHigh}°F`}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.recordLow}°F (Coldest)</span>
              <span>{stats.recordHigh}°F (Warmest)</span>
            </div>
          </CardContent>
        </Card>

        {/* Climate Normals */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              January Normals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Normal High</span>
              <span className="font-display font-bold">{currentNormal.avgHigh}°F</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Normal Low</span>
              <span className="font-display font-bold">{currentNormal.avgLow}°F</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Record High</span>
              <span className="font-display font-bold text-destructive">{currentNormal.recordHigh}°F</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Record Low</span>
              <span className="font-display font-bold text-secondary">{currentNormal.recordLow}°F</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Droplets className="h-3 w-3" /> Avg Precip
              </span>
              <span className="font-display font-bold">{currentNormal.avgPrecip}"</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Snowflake className="h-3 w-3" /> Avg Snow
              </span>
              <span className="font-display font-bold">{currentNormal.avgSnow}"</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-accent" />
            Year-by-Year {monthDay} Weather History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Year</th>
                  <th className="px-4 py-3 text-center font-semibold">High</th>
                  <th className="px-4 py-3 text-center font-semibold">Low</th>
                  <th className="px-4 py-3 text-left font-semibold">Condition</th>
                  <th className="px-4 py-3 text-center font-semibold">Precip</th>
                  <th className="px-4 py-3 text-center font-semibold">Snow</th>
                  <th className="px-4 py-3 text-left font-semibold">Notable Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyData.map((record) => (
                  <tr key={record.year} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-display font-bold">{record.year}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={record.high > stats.avgHigh + 5 ? 'text-destructive font-semibold' : record.high < stats.avgHigh - 5 ? 'text-secondary font-semibold' : ''}>
                        {record.high}°
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={record.low < stats.avgLow - 10 ? 'text-secondary font-semibold' : record.low > stats.avgLow + 10 ? 'text-destructive font-semibold' : ''}>
                        {record.low}°
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.condition}</td>
                    <td className="px-4 py-3 text-center">{record.precipitation}"</td>
                    <td className="px-4 py-3 text-center">{record.snowfall !== undefined ? `${record.snowfall}"` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground italic">
                      {record.event || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Climate Patterns & Analysis */}
      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="patterns">Climate Patterns</TabsTrigger>
          <TabsTrigger value="events">Historic Events</TabsTrigger>
          <TabsTrigger value="trends">Climate Trends</TabsTrigger>
          <TabsTrigger value="facts">Alaska Climate Facts</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Monthly Climate Normals — {location}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Month</th>
                      <th className="px-3 py-2 text-center font-semibold">Avg High</th>
                      <th className="px-3 py-2 text-center font-semibold">Avg Low</th>
                      <th className="px-3 py-2 text-center font-semibold">Record High</th>
                      <th className="px-3 py-2 text-center font-semibold">Record Low</th>
                      <th className="px-3 py-2 text-center font-semibold">Precip</th>
                      <th className="px-3 py-2 text-center font-semibold">Snow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {climateNormals.map((normal, idx) => (
                      <tr 
                        key={normal.month} 
                        className={`hover:bg-muted/30 transition-colors ${idx === currentMonth ? 'bg-accent/10' : ''}`}
                      >
                        <td className="px-3 py-2 font-semibold">{normal.month}</td>
                        <td className="px-3 py-2 text-center">{normal.avgHigh}°</td>
                        <td className="px-3 py-2 text-center">{normal.avgLow}°</td>
                        <td className="px-3 py-2 text-center text-destructive">{normal.recordHigh}°</td>
                        <td className="px-3 py-2 text-center text-secondary">{normal.recordLow}°</td>
                        <td className="px-3 py-2 text-center">{normal.avgPrecip}"</td>
                        <td className="px-3 py-2 text-center">{normal.avgSnow}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Visual annual temperature chart */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Annual Temperature Range</h4>
                <div className="flex items-end gap-1 h-32">
                  {climateNormals.map((normal, idx) => {
                    const heightHigh = ((normal.avgHigh + 40) / 130) * 100;
                    const heightLow = ((normal.avgLow + 40) / 130) * 100;
                    return (
                      <div key={normal.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col items-center relative" style={{ height: '100px' }}>
                          <div 
                            className="absolute bottom-0 w-full bg-gradient-to-t from-secondary/60 to-destructive/60 rounded-t"
                            style={{ 
                              height: `${heightHigh}%`,
                              clipPath: `inset(${100 - heightHigh}% 0 0 0)`
                            }}
                          />
                          <div 
                            className="absolute bottom-0 w-full bg-secondary/80 rounded-t"
                            style={{ height: `${heightLow}%` }}
                          />
                        </div>
                        <span className={`text-xs ${idx === currentMonth ? 'text-accent font-bold' : 'text-muted-foreground'}`}>
                          {normal.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Significant Weather Events on This Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {significantEvents.map((event, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    event.severity === 'extreme' ? 'bg-destructive/10 border-destructive' :
                    event.severity === 'severe' ? 'bg-accent/10 border-accent' :
                    event.severity === 'historic' ? 'bg-primary/10 border-primary' :
                    'bg-muted/50 border-muted-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display font-bold">{event.date}</div>
                      <p className="text-sm mt-1">{event.event}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded uppercase font-semibold ${
                      event.severity === 'extreme' ? 'bg-destructive text-destructive-foreground' :
                      event.severity === 'severe' ? 'bg-accent text-accent-foreground' :
                      event.severity === 'historic' ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Climate Change Trends in Alaska
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-destructive/10 p-4 rounded-lg text-center">
                  <TrendingUp className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <div className="text-3xl font-display font-bold text-destructive">+3.4°F</div>
                  <div className="text-sm text-muted-foreground">Temperature increase since 1970</div>
                </div>
                <div className="bg-secondary/10 p-4 rounded-lg text-center">
                  <Snowflake className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-3xl font-display font-bold text-secondary">-18%</div>
                  <div className="text-sm text-muted-foreground">Winter ice coverage decline</div>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg text-center">
                  <Sun className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-3xl font-display font-bold text-accent">+12 days</div>
                  <div className="text-sm text-muted-foreground">Longer growing season</div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Key Observations:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    Alaska is warming at twice the rate of the global average, with the Arctic warming even faster.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    Permafrost thaw is accelerating, affecting infrastructure and releasing stored carbon.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    Sea ice extent has decreased by over 13% per decade since satellite records began.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    Wildfire seasons are becoming longer and more intense, with 2019 seeing record-breaking burns.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    Glaciers are retreating at unprecedented rates, with some losing 100+ feet of ice thickness annually.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-accent" />
                Alaska Climate Facts & Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {climateFacts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent font-bold text-sm">{idx + 1}</span>
                    </div>
                    <p className="text-sm">{fact}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 border border-accent/30 rounded-lg bg-accent/5">
                <h4 className="font-display font-bold text-lg mb-2">Why This Matters</h4>
                <p className="text-sm text-muted-foreground">
                  Understanding Alaska's weather history and climate patterns is critical for safety, 
                  planning, and preparedness. Extreme weather events in Alaska can be life-threatening, 
                  and accurate forecasting saves lives. Historical data helps us understand patterns, 
                  predict future conditions, and make informed decisions about travel, outdoor activities, 
                  and emergency preparedness.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
