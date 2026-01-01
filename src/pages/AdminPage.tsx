import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText, AlertTriangle, Cloud, Calendar, Plus, Trash2, Edit, 
  Save, RefreshCw, BarChart3, Users, Eye, TrendingUp
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  is_breaking: boolean | null;
  author_name: string | null;
  published_at: string | null;
  view_count: number | null;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  severity: string;
  is_active: boolean | null;
}

interface WeatherData {
  id: string;
  location: string;
  temperature_f: number | null;
  condition: string | null;
  high_f: number | null;
  low_f: number | null;
  humidity: number | null;
  wind_mph: number | null;
}

interface BreakingNews {
  id: string;
  message: string;
  is_active: boolean | null;
  priority: number | null;
}

const AdminPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    alert_type: 'weather',
    severity: 'warning'
  });

  const [newBreakingNews, setNewBreakingNews] = useState({
    message: '',
    priority: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const [articlesRes, alertsRes, weatherRes, breakingRes] = await Promise.all([
      supabase.from('articles').select('*').order('published_at', { ascending: false }),
      supabase.from('alerts').select('*').order('created_at', { ascending: false }),
      supabase.from('weather').select('*').order('location'),
      supabase.from('breaking_news').select('*').order('priority', { ascending: false })
    ]);

    if (articlesRes.data) setArticles(articlesRes.data);
    if (alertsRes.data) setAlerts(alertsRes.data);
    if (weatherRes.data) setWeather(weatherRes.data);
    if (breakingRes.data) setBreakingNews(breakingRes.data);

    setLoading(false);
  };

  const toggleArticlePublished = async (id: string, currentStatus: boolean | null) => {
    const { error } = await supabase
      .from('articles')
      .update({ is_published: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update article');
    } else {
      toast.success('Article updated');
      fetchData();
    }
  };

  const toggleArticleFeatured = async (id: string, currentStatus: boolean | null) => {
    const { error } = await supabase
      .from('articles')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update article');
    } else {
      toast.success('Article updated');
      fetchData();
    }
  };

  const toggleAlertActive = async (id: string, currentStatus: boolean | null) => {
    const { error } = await supabase
      .from('alerts')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update alert');
    } else {
      toast.success('Alert updated');
      fetchData();
    }
  };

  const toggleBreakingNewsActive = async (id: string, currentStatus: boolean | null) => {
    const { error } = await supabase
      .from('breaking_news')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update breaking news');
    } else {
      toast.success('Breaking news updated');
      fetchData();
    }
  };

  const stats = {
    totalArticles: articles.length,
    publishedArticles: articles.filter(a => a.is_published).length,
    totalViews: articles.reduce((sum, a) => sum + (a.view_count || 0), 0),
    activeAlerts: alerts.filter(a => a.is_active).length,
    activeBreaking: breakingNews.filter(b => b.is_active).length
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your news content and alerts</p>
          </div>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalArticles}</div>
                  <div className="text-xs text-muted-foreground">Total Articles</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-secondary" />
                <div>
                  <div className="text-2xl font-bold">{stats.publishedArticles}</div>
                  <div className="text-xs text-muted-foreground">Published</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <div className="text-xs text-muted-foreground">Total Views</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                  <div className="text-xs text-muted-foreground">Active Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.activeBreaking}</div>
                  <div className="text-xs text-muted-foreground">Breaking News</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="breaking" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Breaking News
            </TabsTrigger>
            <TabsTrigger value="weather" className="gap-2">
              <Cloud className="h-4 w-4" />
              Weather
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Articles Management</CardTitle>
                <CardDescription>Manage published articles and featured content</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {articles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="max-w-[200px] truncate font-medium">
                              <Link to={`/article/${article.slug}`} className="hover:text-accent">
                                {article.title}
                              </Link>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {article.author_name || 'Staff'}
                            </TableCell>
                            <TableCell>{article.view_count || 0}</TableCell>
                            <TableCell>
                              <Switch
                                checked={article.is_published || false}
                                onCheckedChange={() => toggleArticlePublished(article.id, article.is_published)}
                              />
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={article.is_featured || false}
                                onCheckedChange={() => toggleArticleFeatured(article.id, article.is_featured)}
                              />
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {article.published_at ? new Date(article.published_at).toLocaleDateString() : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alert Management</CardTitle>
                <CardDescription>Manage weather and emergency alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">{alert.title}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{alert.message}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{alert.alert_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={alert.is_active || false}
                              onCheckedChange={() => toggleAlertActive(alert.id, alert.is_active)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Breaking News Tab */}
          <TabsContent value="breaking">
            <Card>
              <CardHeader>
                <CardTitle>Breaking News Ticker</CardTitle>
                <CardDescription>Manage breaking news displayed in the ticker</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Message</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {breakingNews.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-[400px]">{item.message}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={item.is_active || false}
                              onCheckedChange={() => toggleBreakingNewsActive(item.id, item.is_active)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather">
            <Card>
              <CardHeader>
                <CardTitle>Weather Data</CardTitle>
                <CardDescription>Current weather conditions across Alaska</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Temperature</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>High/Low</TableHead>
                        <TableHead>Humidity</TableHead>
                        <TableHead>Wind</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weather.map((data) => (
                        <TableRow key={data.id}>
                          <TableCell className="font-medium">{data.location}</TableCell>
                          <TableCell className="text-xl font-bold">{data.temperature_f}°F</TableCell>
                          <TableCell>{data.condition}</TableCell>
                          <TableCell>{data.high_f}° / {data.low_f}°</TableCell>
                          <TableCell>{data.humidity}%</TableCell>
                          <TableCell>{data.wind_mph} mph</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
