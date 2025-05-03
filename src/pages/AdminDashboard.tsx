import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Calendar } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useActivities } from '@/contexts/ActivityContext';
import { Badge } from '@/components/ui/badge';

// Initial empty chart data
const emptyActivityData = [
  { name: 'Jan', count: 0 },
  { name: 'Feb', count: 0 },
  { name: 'Mar', count: 0 },
  { name: 'Apr', count: 0 },
  { name: 'May', count: 0 },
  { name: 'Jun', count: 0 },
  { name: 'Jul', count: 0 },
  { name: 'Aug', count: 0 },
  { name: 'Sep', count: 0 },
  { name: 'Oct', count: 0 },
  { name: 'Nov', count: 0 },
  { name: 'Dec', count: 0 },
];

const typeData = [
  { name: 'Hotels', value: 0 },
  { name: 'Restaurants', value: 0 },
  { name: 'Saloons', value: 0 },
  { name: 'Lodges', value: 0 },
  { name: 'Adventure', value: 0 },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { activities } = useActivities();
  const [activityData, setActivityData] = useState(emptyActivityData);

  // Sort activities by creation date (newest first)
  const recentActivities = [...activities].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }).slice(0, 5); // Get only the 5 most recent activities

  // Calculate activity data for chart
  useEffect(() => {
    if (activities.length === 0) {
      setActivityData(emptyActivityData);
      return;
    }

    // Create a copy of the empty data
    const monthlyData = [...emptyActivityData];

    // Count activities by month
    activities.forEach(activity => {
      const date = new Date(activity.created_at);
      const month = date.getMonth(); // 0-11
      monthlyData[month].count += 1;
    });

    setActivityData(monthlyData);
  }, [activities]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddActivity = () => {
    navigate('/admin/add-activity');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 w-full md:pl-64">
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back to your admin panel.</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <Button
                  onClick={handleAddActivity}
                  className="bg-primary hover:bg-primary/90 text-white h-8 sm:h-9 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200"
                >
                  <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Add New Activity
                </Button>
              </div>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
              <Card className="w-full overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">Activity Growth</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-800">
                  <div className="h-[180px] sm:h-[220px] md:h-[250px] w-full overflow-hidden">
                    <ResponsiveContainer width="99%" height="99%">
                      <BarChart data={activityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 8 }}
                          tickMargin={5}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 8 }}
                          width={15}
                        />
                        <Tooltip
                          contentStyle={{ fontSize: '12px', padding: '8px', borderRadius: '4px' }}
                          itemStyle={{ padding: '2px 0' }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex flex-row justify-between items-center">
                  <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Activities</CardTitle>
                  <Button
                    variant="ghost"
                    className="text-xs text-primary hover:bg-primary/10 h-7 sm:h-8 px-2"
                    onClick={() => navigate('/admin/activities')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-3 bg-white dark:bg-gray-800">
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => navigate('/admin/activities')}
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                            <img
                              src={activity.image}
                              alt={activity.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=200";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">{activity.name}</h4>
                              <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-1">{activity.location}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Added on {formatDate(activity.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Activities Yet</h3>
                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                          You haven't added any activities yet. Get started by adding your first activity.
                        </p>
                        <Button
                          onClick={() => navigate('/admin/add-activity')}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Add Your First Activity
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 md:mt-6">
              <Card className="border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">System Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-800">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {[
                      { label: "Total Activities", value: activities.length.toString(), color: "bg-primary/10 text-primary", path: "/admin/activities" },
                      { label: "Featured Activities", value: activities.filter(a => a.featured).length.toString(), color: "bg-secondary/10 text-secondary", path: "/admin/activities" },
                      { label: "Recent Additions", value: recentActivities.length.toString(), color: "bg-accent/10 text-accent", path: "/admin/activities" },
                      { label: "Uptime", value: "100%", color: "bg-green-500/10 text-green-600", path: "/admin/settings" }
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="p-2 sm:p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${index * 150}ms` }}
                        onClick={() => navigate(stat.path)}
                      >
                        <div className={`text-base sm:text-lg md:text-xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
