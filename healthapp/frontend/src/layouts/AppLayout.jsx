import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  UserCircle, 
  ClipboardList, 
  History, 
  LogOut, 
  Menu, 
  X, 
  Stethoscope, 
  Users, 
  BarChart3,
  CalendarCheck
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = {
    patient: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Screening', path: '/patient/screening', icon: ClipboardList },
      { name: 'History', path: '/patient/history', icon: History },
      { name: 'Appointments', path: '/patient/appointments', icon: CalendarCheck },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'Patients', path: '/doctor/patients', icon: Users },
      { name: 'Schedule', path: '/doctor/appointments', icon: CalendarCheck },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    ]
  };

  const navItems = menuItems[user?.role] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron-deep shadow-lg ring-2 ring-white/20 flex-shrink-0"></div>
            <span className="font-display font-bold text-lg tracking-tight uppercase text-[13px] text-white">Metascale Health</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path ? 'bg-saffron text-white shadow-lg shadow-saffron/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block text-slate-500 font-medium capitalize">
            {location.pathname.split('/').pop()?.replace('-', ' ')}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-900">{user?.full_name}</div>
              <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
            </div>
            <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold ring-4 ring-primary-50">
              {user?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
