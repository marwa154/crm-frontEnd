import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Quotes from './components/Quotes';
import Invoices from './components/Invoices';
import Notifications from './components/Notifications';
import Users from './components/Users';
import Logs from './components/Logs';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (email: string, password: string, role: 'admin' | 'employee') => {
    setIsAuthenticated(true);
    setUserRole(role);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('employee');
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentPage={location.pathname.slice(1)}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      userRole={userRole}
    >
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/users"
          element={userRole === 'admin' ? <Users /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/logs"
          element={userRole === 'admin' ? <Logs /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
