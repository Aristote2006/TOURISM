
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map,
  Plus,
  User,
  Settings,
  LogOut,
  MapPin,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  action?: React.ReactNode;
}

const SidebarLink = ({ to, icon, label, isActive, onClick, action }: SidebarLinkProps) => (
  <div className="flex items-center">
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 flex-1",
        "text-base sm:text-sm",
        isActive
          ? "bg-white/20 text-white font-medium shadow-sm"
          : "text-sidebar-foreground hover:bg-white/10 hover:text-white"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center",
        isActive ? "text-white" : "text-white/80"
      )}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
    {action && (
      <div className="ml-1">
        {action}
      </div>
    )}
  </div>
);

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [filterOpen, setFilterOpen] = useState(false);

  const sidebarClass = cn(
    "fixed top-0 left-0 h-full bg-sidebar shadow-lg transform transition-transform z-30",
    "w-[240px] sm:w-64",
    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  // Activity filter types
  const activityTypes = ["All", "Hotel", "Restaurant", "Saloon", "Lodge", "Adventure"];

  // Filter dropdown for activities
  const filterAction = (
    <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            setFilterOpen(!filterOpen);
          }}
        >
          <Filter size={14} className="text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[180px] bg-sidebar border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {activityTypes.map(type => (
          <DropdownMenuItem
            key={type}
            className="text-sm text-white hover:bg-white/10"
            onClick={() => {
              navigate(`/admin/activities?type=${type}`);
              setFilterOpen(false);
            }}
          >
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const links = [
    { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    {
      to: "/admin/activities",
      icon: <Map size={20} />,
      label: "Activities",
      action: filterAction
    },
    { to: "/admin/add-activity", icon: <Plus size={20} />, label: "Add Activity" },
    { to: "/admin/profile", icon: <User size={20} />, label: "Profile" },
    { to: "/admin/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClass}>
        <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white rounded-full p-1.5">
              <MapPin size={20} className="text-sidebar-background" />
            </div>
            <h1 className="text-base sm:text-xl font-display text-white font-semibold truncate">Tourism Admin</h1>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 128px)' }}>
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={
                link.to === "/admin"
                ? currentPath === "/admin"
                : currentPath.startsWith(link.to)
              }
              onClick={handleLinkClick}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-sidebar-background/95 backdrop-blur-sm">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 text-base sm:text-sm"
          >
            <LogOut size={18} />
            <span>Exit to Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
