import { Link, useLocation } from 'react-router-dom';

const NavigationItem = ({ to, icon, isActive }) => (
  <Link 
    to={to}
    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
      isActive ? 'bg-white/20' : 'hover:bg-white/10'
    }`}
  >
    {icon}
  </Link>
);

const BottomNavigation = () => {
  const location = useLocation();

  // Map view icon
  const MapIcon = () => (
    <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
      <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
    </svg>
  );

  // Truck icon
  const TruckIcon = () => (
    <svg width="33" height="33" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
      <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
    </svg>
  );

  // Home icon
  const HomeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
  );

  // Routes icon
  const RoutesIcon = () => (
    <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  );

  // Bins icon  
  const BinsIcon = () => (
    <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[rgba(85,172,98,0.63)] backdrop-blur-sm border-t border-white/10" data-name="Header">
      <div className="flex items-center justify-around px-4 py-4 max-w-[393px] mx-auto">
        <NavigationItem 
          to="/bins" 
          icon={<BinsIcon />}
          isActive={location.pathname === '/bins'}
        />
        <NavigationItem 
          to="/trucks" 
          icon={<TruckIcon />}
          isActive={location.pathname === '/trucks'}
        />
        <NavigationItem 
          to="/dashboard" 
          icon={<HomeIcon />}
          isActive={location.pathname === '/dashboard' || location.pathname === '/'}
        />
        <NavigationItem 
          to="/routes" 
          icon={<RoutesIcon />}
          isActive={location.pathname === '/routes'}
        />
        <NavigationItem 
          to="/map" 
          icon={<MapIcon />}
          isActive={location.pathname === '/map'}
        />
      </div>
    </div>
  );
};

export default BottomNavigation;