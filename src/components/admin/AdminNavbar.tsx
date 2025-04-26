
import React from 'react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminNavbarProps {
  toggleSidebar: () => void;
}

const AdminNavbar = ({ toggleSidebar }: AdminNavbarProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const { logout } = useAuth();

  return (
    <header className="h-16 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 text-primary hover:bg-primary/10"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        )}
        <h1 className="text-lg sm:text-xl font-display font-semibold text-gray-800 dark:text-white truncate">Tourism Admin</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
            <DropdownMenuLabel className="font-semibold dark:text-gray-100">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
            <div className="max-h-[50vh] sm:max-h-80 overflow-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">New Activity Submitted</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      A new activity has been submitted for review.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>



        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 hover:bg-primary/10">
              <Avatar className="border-2 border-primary/20 dark:border-primary/40">
                <AvatarImage
                  src={userProfile?.avatar_url || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100"}
                  alt="Profile"
                  onError={(e) => {
                    // Fallback if the image fails to load
                    e.currentTarget.src = "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100";
                  }}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {userProfile ?
                    `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}` :
                    'AD'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
            <DropdownMenuLabel className="font-semibold dark:text-gray-100">
              {userProfile ?
                `${userProfile.first_name || ''} ${userProfile.last_name || ''}` :
                'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
              onClick={() => navigate('/admin/profile')}
            >
              <User className="mr-2 h-4 w-4 text-primary" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="mr-2 h-4 w-4 text-primary" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-700" />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminNavbar;
