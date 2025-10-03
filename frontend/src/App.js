import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Bins from './pages/Bins';
import BinDetail from './pages/BinDetail';
import BinForm from './pages/BinForm';
import Trucks from './pages/Trucks';
import TruckDetail from './pages/TruckDetail';
import TruckForm from './pages/TruckForm';
import Map from './pages/Map';
import BinHistoryPage from './pages/BinHistory';
import RoutesPage from './pages/Routes';
import RouteDetail from './pages/RouteDetail';
import RouteForm from './pages/RouteForm';
import RoutePlanDetail from './pages/RoutePlanDetail';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/welcome" replace />;
};

// Public Route wrapper (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Root redirect */}
        <Route path="/" element={
          <div className="min-h-screen bg-white max-w-[393px] mx-auto">
            {/* Determine where to redirect based on auth */}
            <WelcomeOrDashboard />
          </div>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Bins Routes */}
        <Route path="/bins" element={<ProtectedRoute><Bins /></ProtectedRoute>} />
        <Route path="/bins/add" element={<ProtectedRoute><BinForm /></ProtectedRoute>} />
        <Route path="/bins/:id" element={<ProtectedRoute><BinDetail /></ProtectedRoute>} />
        <Route path="/bins/:id/edit" element={<ProtectedRoute><BinForm /></ProtectedRoute>} />
        <Route path="/bins/:id/history" element={<ProtectedRoute><BinHistoryPage /></ProtectedRoute>} />
        
        {/* Trucks Routes */}
        <Route path="/trucks" element={<ProtectedRoute><Trucks /></ProtectedRoute>} />
        <Route path="/trucks/add" element={<ProtectedRoute><TruckForm /></ProtectedRoute>} />
        <Route path="/trucks/:id" element={<ProtectedRoute><TruckDetail /></ProtectedRoute>} />
        <Route path="/trucks/:id/edit" element={<ProtectedRoute><TruckForm /></ProtectedRoute>} />
        
        {/* Routes Routes */}
        <Route path="/routes" element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />
        <Route path="/routes/add" element={<ProtectedRoute><RouteForm /></ProtectedRoute>} />
        <Route path="/routes/:id" element={<ProtectedRoute><RouteDetail /></ProtectedRoute>} />
        <Route path="/routes/:id/edit" element={<ProtectedRoute><RouteForm /></ProtectedRoute>} />
        <Route path="/route-plans/:id" element={<ProtectedRoute><RoutePlanDetail /></ProtectedRoute>} />
        
        {/* Other Routes */}
        <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
        
        {/* Catch all - redirect based on auth status */}
        <Route path="*" element={<WelcomeOrDashboard />} />
      </Routes>
    </Router>
  );
}

// Component to decide where to redirect
const WelcomeOrDashboard = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/welcome" replace />;
};

export default App;
