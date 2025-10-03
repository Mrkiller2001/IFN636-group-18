import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ to, icon, label, isActive }) => (
  <Link 
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-[#55ac62] text-white shadow-lg' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <div className={`${isActive ? 'text-white' : 'text-gray-500'}`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Icons for navigation
  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
  );

  const BinsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
  );

  const TruckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
    </svg>
  );

  const RoutesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  );

  const MapIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
      <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16,17 21,12 16,7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-30">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#55ac62] to-[#3e974b] rounded-lg flex items-center justify-center">
            <BinsIcon />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#086214]">Waste Manager</h2>
            <p className="text-sm text-gray-500">Smart Collection</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-6">
        <div className="space-y-2">
          <SidebarItem 
            to="/dashboard" 
            icon={<HomeIcon />}
            label="Dashboard"
            isActive={location.pathname === '/dashboard' || location.pathname === '/'}
          />
          <SidebarItem 
            to="/bins" 
            icon={<BinsIcon />}
            label="Bins"
            isActive={location.pathname.startsWith('/bins')}
          />
          <SidebarItem 
            to="/trucks" 
            icon={<TruckIcon />}
            label="Trucks"
            isActive={location.pathname.startsWith('/trucks')}
          />
          <SidebarItem 
            to="/routes" 
            icon={<RoutesIcon />}
            label="Routes"
            isActive={location.pathname.startsWith('/routes')}
          />
          <SidebarItem 
            to="/map" 
            icon={<MapIcon />}
            label="Map View"
            isActive={location.pathname === '/map'}
          />
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#55ac62] to-[#3e974b] rounded-full flex items-center justify-center text-white">
            <UserIcon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.email || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;