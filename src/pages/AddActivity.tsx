
import React, { useState } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AddActivityForm from '@/components/admin/AddActivityForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AddActivity = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <h1 className="text-3xl font-semibold">Add New Activity</h1>
            <p className="text-muted-foreground">Create a new listing or activity.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
              <CardDescription>
                Fill in the information below to add a new activity to the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddActivityForm />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AddActivity;
