import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import HomeDashboard from './pages/HomeDashboard';
import LiveMap from './pages/LiveMap';
import AIDetector from './pages/AIDetector';
import Milestones from './pages/Milestones';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const updateAuth = () => {
    window.location.reload();
  };

  const isAuthenticated = !!localStorage.getItem('userId');
  const isAdmin = !!localStorage.getItem('adminId');

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const ProtectedAdminRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <ErrorBoundary>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : isAdmin 
                ? <Navigate to="/admin/dashboard" replace /> 
                : <Login updateAuth={updateAuth} />
          } 
        />
        
        <Route 
          path="/admin/login" 
          element={
            isAdmin 
              ? <Navigate to="/admin/dashboard" replace /> 
              : <AdminLogin updateAuth={updateAuth} />
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard updateAuth={updateAuth} />
            </ProtectedAdminRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout updateAuth={updateAuth}>
                <HomeDashboard updateAuth={updateAuth} />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/map" 
          element={
            <ProtectedRoute>
              <Layout updateAuth={updateAuth}>
                <LiveMap updateAuth={updateAuth} />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/detect" 
          element={
            <ProtectedRoute>
              <Layout updateAuth={updateAuth}>
                <AIDetector updateAuth={updateAuth} />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/milestones" 
          element={
            <ProtectedRoute>
              <Layout updateAuth={updateAuth}>
                <Milestones updateAuth={updateAuth} />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
