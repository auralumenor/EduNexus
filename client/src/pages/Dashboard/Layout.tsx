import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { Tooltip } from '../../components/common/Tooltip';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard',    path: '/dashboard',    Icon: LayoutDashboard },
  { label: 'Books Catalog',path: '/books',         Icon: BookOpen },
  { label: 'Members',      path: '/members',       Icon: Users },
  { label: 'Transactions', path: '/transactions',  Icon: ArrowLeftRight },
];

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col py-6 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg rotate-45 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
            <h2 className="text-lg font-semibold tracking-tight">Digital Curator</h2>
          </div>
          <button className="md:hidden text-text-secondary-light dark:text-text-secondary-dark" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ label, path, Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary-light dark:hover:text-text-primary-dark'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pt-4 mt-2 border-t border-border-light dark:border-border-dark flex flex-col gap-1">
          <Link
            to="/settings"
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              location.pathname === '/settings' 
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary-light dark:hover:text-text-primary-dark'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button  
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all duration-200 w-full text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:block text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Search library...
            </div>
          </div>
          
          <Tooltip content="Navigate to your Profile & Security settings" delay={4000} position="bottom">
            <Link to="/profile" className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 py-1 px-2 rounded-lg transition-colors cursor-pointer">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{user?.name ?? 'Admin'}</span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark capitalize">{user?.role ?? 'librarian'}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
            </Link>
          </Tooltip>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
