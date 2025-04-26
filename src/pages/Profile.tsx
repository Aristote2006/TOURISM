
import React, { useState } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminProfile from '@/components/admin/AdminProfile';

const Profile = () => {
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
            <h1 className="text-3xl font-semibold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account information.</p>
          </div>

          <AdminProfile />
        </main>
      </div>
    </div>
  );
};

export default Profile;
