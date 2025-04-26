
import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/providers/ThemeProvider';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [activityUpdates, setActivityUpdates] = useState(true);
  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const { toast } = useToast();

  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 w-full md:pl-64">
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 overflow-auto bg-gray-50">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and account settings.</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                    <span>Email Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </span>
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-emails" className="flex flex-col gap-1">
                    <span>Marketing Emails</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails about new features and promotions
                    </span>
                  </Label>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="activity-updates" className="flex flex-col gap-1">
                    <span>Activity Updates</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified when activities are added or modified
                    </span>
                  </Label>
                  <Switch
                    id="activity-updates"
                    checked={activityUpdates}
                    onCheckedChange={setActivityUpdates}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                    <span>Dark Mode</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Switch between light and dark mode
                    </span>
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Update your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <input
                    type="password"
                    id="current-password"
                    className="w-full p-2 border rounded"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <input
                    type="password"
                    id="new-password"
                    className="w-full p-2 border rounded"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="w-full p-2 border rounded"
                    placeholder="••••••••"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast({
                  title: "Password updated",
                  description: "Your password has been changed successfully.",
                })}>
                  Update Password
                </Button>
              </CardFooter>
            </Card>

            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
