import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userRole: string;
}

export default function Layout({ children, currentPage, onNavigate, onLogout, userRole }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'quotes', label: 'Devis', icon: '📄' },
    { id: 'invoices', label: 'Factures', icon: '🧾' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    ...(userRole === 'admin' ? [
      { id: 'users', label: 'Utilisateurs', icon: '👤' },
      { id: 'logs', label: 'Journalisation', icon: '📋' },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 ml-2 md:ml-0">Mini CRM</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-slate-600 hover:text-slate-900 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-900 hidden sm:block">
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] p-4 transition-transform duration-200 z-10 top-16 md:top-auto`}>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={`/${item.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 w-full">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
