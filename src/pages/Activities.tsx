
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ActivityTable from '@/components/admin/ActivityTable';
import { Card } from '@/components/ui/card';

const Activities = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialFilterType, setInitialFilterType] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract filter type from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');

    if (typeParam) {
      setInitialFilterType(typeParam);
      // Clear the URL parameter after reading it
      navigate('/admin/activities', { replace: true });
    }
  }, [location.search, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 w-full md:pl-64">
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 overflow-auto bg-gray-50">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold">Activity Management</h1>
            <p className="text-muted-foreground">Manage all activities and listings.</p>
          </div>

          <Card className="p-6">
            <ActivityTable initialFilterType={initialFilterType} />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Activities;
