import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `mr-2 px-3 py-2 rounded transition text-sm
       ${isActive ? 'bg-white text-blue-600' : 'hover:bg-blue-500/80'}`
    }
  >
    {children}
  </NavLink>
);

const Avatar = ({ name }) => {
  const initials = (name || 'U').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold">
      {initials}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-500 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={user ? '/bins' : '/'} className="text-lg font-bold tracking-tight">
            <span className="inline-block mr-2 w-8 h-8 rounded-md bg-white/20 text-white flex items-center justify-center">G</span>
            Garbage Manager
          </Link>
          {user && (
            <div className="hidden sm:flex items-center">
              <NavItem to="/bins">Bins</NavItem>
              <NavItem to="/routes">Routes</NavItem>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:flex items-center gap-2">
                <Avatar name={user.name || user.email} />
                <span className="hidden md:inline text-sm">{user.name || user.email}</span>
              </Link>
              <button onClick={handleLogout} className="ml-2 bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600">Logout</button>
            </>
          ) : (
            <div className="flex items-center">
              <NavItem to="/login">Login</NavItem>
              <Link to="/register" className="ml-2 bg-white text-primary-500 px-3 py-1 rounded text-sm hover:opacity-90">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
