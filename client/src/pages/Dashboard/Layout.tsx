import React, { useState, useEffect, useRef } from 'react';
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
  User,
  Info,
  Search,
  Bell,
  HelpCircle
} from 'lucide-react';
import { Tooltip } from '../../components/common/Tooltip';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard',    path: '/dashboard',    Icon: LayoutDashboard, materialIcon: 'dashboard' },
  { label: 'Books Catalog',path: '/books',        Icon: BookOpen,        materialIcon: 'menu_book' },
  { label: 'Members',      path: '/members',      Icon: Users,           materialIcon: 'group' },
  { label: 'Transactions', path: '/transactions', Icon: ArrowLeftRight,  materialIcon: 'receipt_long' },
  { label: 'About LMS',    path: '/about',        Icon: Info,            materialIcon: 'info' },
];

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) setIsHelpOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <React.Fragment>
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-inverse-surface/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop & Tablet */}
      <aside 
        className={`fixed md:flex flex-col p-4 gap-2 h-full md:h-[calc(100vh-3rem)] left-0 top-0 md:top-6 bottom-6 md:ml-6 w-64 rounded-none md:rounded-xl bg-surface-container dark:bg-slate-900 border-r md:border border-outline/5 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:visible'}`}
      >
        <div className="flex items-center justify-between px-2 mb-8 pt-2 md:pt-0">
          <div>
            <h1 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tight font-headline">EduNexus</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-bold">Enterprise LMS</p>
          </div>
          <button className="md:hidden text-outline hover:text-on-surface" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 relative overflow-y-auto flex-1">
          {navItems
            .filter(({ label }) => user?.role === 'admin' || (label !== 'Members'))
            .map(({ label, path, materialIcon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative active:scale-95 ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#565e74] to-[#4a5268] text-white shadow-lg' 
                    : 'text-[#717c82] hover:bg-surface-container-highest dark:hover:bg-slate-800 hover:translate-x-1'
                }`}
              >
                {isActive && <div className="nav-active-indicator"></div>}
                <span className={`material-symbols-outlined ml-1`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {materialIcon}
                </span>
                <span className={`font-headline text-sm tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-2 pt-4">
          {user?.role === 'admin' && (
            <Link
              to="/settings"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative mb-4 active:scale-95 ${
                location.pathname === '/settings' 
                  ? 'bg-gradient-to-br from-[#565e74] to-[#4a5268] text-white shadow-lg' 
                  : 'text-[#717c82] hover:bg-surface-container-highest dark:hover:bg-slate-800 hover:translate-x-1'
              }`}
            >
              {location.pathname === '/settings' && <div className="nav-active-indicator"></div>}
              <span className="material-symbols-outlined ml-1" style={location.pathname === '/settings' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                settings
              </span>
              <span className={`font-headline text-sm tracking-wide ${location.pathname === '/settings' ? 'font-semibold' : 'font-medium'}`}>Settings</span>
            </Link>
          )}
          
          <div className="relative mt-2" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full p-3 bg-surface-container-lowest/50 dark:bg-slate-950/40 rounded-lg flex items-center justify-between border border-outline/10 hover:bg-surface-container-high transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full border border-outline/20 bg-primary-container text-primary flex items-center justify-center font-bold shadow-sm shrink-0">
                  {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                </div>
                <div className="overflow-hidden text-left">
                  <p className="text-xs font-bold text-on-surface dark:text-white truncate">{user?.name ?? 'Admin User'}</p>
                  <p className="text-[10px] text-outline font-medium truncate uppercase tracking-tighter">{user?.role ?? 'System Controller'}</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_less</span>
            </button>

            {/* Profile Dropdown */}
            <div className={`absolute bottom-full left-0 w-full mb-2 bg-surface-container-lowest dark:bg-slate-800 rounded-xl shadow-xl border border-outline-variant/20 z-50 overflow-hidden divide-y divide-outline-variant/10 transition-all duration-300 origin-bottom ${isProfileOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
              <div className="p-4 bg-gradient-to-br from-surface-container-low to-surface-container-lowest dark:from-slate-700 dark:to-slate-800">
                  <p className="text-sm font-bold text-on-surface dark:text-white">{user?.name ?? 'Admin User'}</p>
                  <p className="text-xs text-outline font-medium">{user?.email ?? 'admin@edunexus.edu'}</p>
              </div>
              <div className="p-2 space-y-1">
                  <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container dark:hover:bg-slate-700 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">person</span> My Profile
                  </Link>
                  <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container dark:hover:bg-slate-700 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">settings</span> Settings
                  </Link>
              </div>
              <div className="p-2">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out
                  </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 mr-4 md:mr-8 py-4 md:py-8 min-h-screen flex flex-col">
        
        {/* TopNavBar */}
        <header className="w-full sticky top-0 z-40 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-b md:border border-outline/10 dark:border-white/10 mb-8 md:rounded-xl flex justify-between items-center px-4 md:px-8 h-[72px] shadow-sm">
          <div className="flex items-center gap-4 md:gap-10 w-full md:w-auto">
            <button className="md:hidden text-[#565e74] dark:text-[#dae2fd] hover:text-on-surface" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-extrabold text-[#1A365D] dark:text-white font-headline tracking-tight hidden sm:block">
              EduNexus Archive
            </h2>
            
            <div className="relative w-full md:w-96 flex-1 md:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-sm">search</span>
              </div>
              <input 
                className="w-full bg-surface-container-high dark:bg-slate-800 border-none rounded-md py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body text-on-surface dark:text-white placeholder:text-outline/60 outline-none" 
                placeholder="Query ISBN, Title, or ID..." 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-2 md:ml-0 relative">
            {/* Notifications */}
            <div ref={notifRef} className="hidden sm:block relative">
              <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsHelpOpen(false); }} className={`p-2.5 rounded-lg text-[#565e74] dark:text-[#dae2fd] transition-all active:scale-90 ${isNotifOpen ? 'bg-primary/20 text-primary' : 'hover:bg-surface-container-highest dark:hover:bg-slate-700'}`}>
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white dark:border-slate-900 border-2"></span>
              </button>
              
              {/* Notif Dropdown */}
              <div className={`absolute right-0 top-full mt-3 w-80 bg-surface-container-lowest dark:bg-slate-800 rounded-xl shadow-xl border border-outline-variant/20 z-50 overflow-hidden transition-all duration-300 origin-top ${isNotifOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
                   <h4 className="font-bold font-headline text-on-surface dark:text-white">Notifications</h4>
                   <button className="text-xs text-primary font-bold hover:underline">Mark all read</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                   <div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                     <p className="text-sm font-bold text-on-surface dark:text-white">System Alert</p>
                     <p className="text-xs text-outline mt-1 line-clamp-2">The latest database sync completed successfully with 12 new volumes added.</p>
                     <span className="text-[10px] text-outline font-black uppercase mt-2 block">10 mins ago</span>
                   </div>
                   <div className="p-4 hover:bg-surface-container-low dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                     <p className="text-sm font-bold text-on-surface dark:text-white">Overdue Notice</p>
                     <p className="text-xs text-outline mt-1 line-clamp-2">5 items have been flagged as critically overdue. Please check the dashboard.</p>
                     <span className="text-[10px] text-outline font-black uppercase mt-2 block">2 hours ago</span>
                   </div>
                </div>
                <div className="p-3 bg-surface-container text-center border-t border-outline-variant/10">
                   <Link to="/transactions" onClick={() => setIsNotifOpen(false)} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">View All Activity</Link>
                </div>
              </div>
            </div>

            {/* Help */}
            <div ref={helpRef} className="hidden sm:block relative">
              <button onClick={() => { setIsHelpOpen(!isHelpOpen); setIsNotifOpen(false); }} className={`p-2.5 rounded-lg text-[#565e74] dark:text-[#dae2fd] transition-all active:scale-90 ${isHelpOpen ? 'bg-primary/20 text-primary' : 'hover:bg-surface-container-highest dark:hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[22px]">help_outline</span>
              </button>

              {/* Help Dropdown */}
              <div className={`absolute right-0 top-full mt-3 w-64 bg-surface-container-lowest dark:bg-slate-800 rounded-xl shadow-xl border border-outline-variant/20 z-50 overflow-hidden transition-all duration-300 origin-top ${isHelpOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                <div className="p-4 border-b border-outline-variant/10">
                   <h4 className="font-bold font-headline text-on-surface dark:text-white">Help & Support</h4>
                </div>
                <div className="p-2 space-y-1">
                  <Link to="/documentation" onClick={() => setIsHelpOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container dark:hover:bg-slate-700 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">menu_book</span> Documentation
                  </Link>
                  <Link to="/about" onClick={() => setIsHelpOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container dark:hover:bg-slate-700 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">info</span> About LMS
                  </Link>
                  <button onClick={() => {setIsReportModalOpen(true); setIsHelpOpen(false);}} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container dark:hover:bg-slate-700 hover:text-primary transition-colors text-left">
                      <span className="material-symbols-outlined text-[20px]">bug_report</span> Report an Issue
                  </button>
                </div>
              </div>
            </div>
            
            <Tooltip content="Navigate to your Profile & Security settings" delay={500} position="bottom">
              <Link to="/profile" className="flex items-center md:hidden ml-2">
                <div className="w-8 h-8 rounded-full border border-outline/20 bg-primary-container text-primary flex items-center justify-center font-bold shadow-sm shrink-0">
                  {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                </div>
              </Link>
            </Tooltip>
          </div>
        </header>

        {/* Dashboard Canvas (Page Content) */}
        <div className="flex-1 w-full relative z-0">
          <div className="animate-fade-in h-full">
            {children}
          </div>
        </div>
      </main>
      
      {/* BottomNavBar for Mobile (Visible only on very small screens, supplementing sidebar if needed) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-low/95 backdrop-blur-md border-t border-outline-variant/20 flex items-center justify-around px-4 z-50">
        <Link className={`flex flex-col items-center justify-center gap-1 relative ${location.pathname === '/dashboard' ? 'text-primary' : 'text-outline'}`} to="/dashboard">
          {location.pathname === '/dashboard' && <div className="absolute -top-1 w-8 h-0.5 bg-primary rounded-full"></div>}
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-black uppercase tracking-tighter">Dash</span>
        </Link>
        <Link className={`flex flex-col items-center justify-center gap-1 ${location.pathname === '/books' ? 'text-primary' : 'text-outline'}`} to="/books">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Catalog</span>
        </Link>
        <div className="relative -top-6">
          <Link to="/transactions" className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center border-4 border-surface ring-2 ring-primary/20 transition-transform active:scale-95">
            <span className="material-symbols-outlined text-2xl">compare_arrows</span>
          </Link>
        </div>
        {user?.role === 'admin' && (
          <React.Fragment>
            <Link className={`flex flex-col items-center justify-center gap-1 ${location.pathname === '/members' ? 'text-primary' : 'text-outline'}`} to="/members">
              <span className="material-symbols-outlined">group</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Users</span>
            </Link>
            <Link className={`flex flex-col items-center justify-center gap-1 ${location.pathname === '/settings' ? 'text-primary' : 'text-outline'}`} to="/settings">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Admin</span>
            </Link>
          </React.Fragment>
        )}
        {user?.role !== 'admin' && (
          <React.Fragment>
            <Link className={`flex flex-col items-center justify-center gap-1 ${location.pathname === '/profile' ? 'text-primary' : 'text-outline'}`} to="/profile">
              <span className="material-symbols-outlined">account_circle</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
            </Link>
          </React.Fragment>
        )}
      </nav>
      
    </div>

      {/* Report Issue Modal Overlay */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-inverse-surface/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsReportModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md bg-surface-container-lowest dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 overflow-hidden animate-slide-up border border-outline-variant/20 flex flex-col gap-5 items-center text-center">
            
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mb-2 border border-error/20 ring-4 ring-error/5">
               <span className="material-symbols-outlined text-3xl">bug_report</span>
            </div>
            
            <div>
              <h2 className="text-2xl font-black font-headline text-on-surface dark:text-white mb-2">Report an Issue</h2>
              <p className="text-sm font-medium text-outline">
                To streamline bug tracking and feature requests, we manage all system issues through version control.
              </p>
            </div>
            
            <div className="p-4 bg-surface-container dark:bg-slate-800 rounded-xl w-full border border-outline-variant/10">
               <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-gray-300 mb-1">Action Required</p>
               <p className="text-sm font-semibold text-primary dark:text-primary-fixed">Please Report it on GitHub!</p>
            </div>
            
            <div className="flex gap-3 w-full mt-2">
              <button onClick={() => setIsReportModalOpen(false)} className="flex-1 py-2.5 rounded-lg font-bold text-sm text-outline hover:bg-surface-container hover:text-on-surface transition-all active:scale-[0.98]">
                Dismiss
              </button>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex-1 py-2.5 bg-primary hover:bg-primary-dim text-white rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                Open GitHub <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      )}

      </React.Fragment>
  );
};
