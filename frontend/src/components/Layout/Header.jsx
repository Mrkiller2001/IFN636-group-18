import { useAuth } from '../../context/AuthContext';

const Header = ({ title = "Waste Manager" }) => {
  const { user } = useAuth();

  // User Circle Icon
  const UserIcon = () => (
    <svg width="53" height="53" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  // Bell Notification Icon
  const BellIcon = () => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0 -12 0c0 7 -3 9 -3 9h18s-3 -2 -3 -9"></path>
      <path d="M13.73 21a2 2 0 0 1 -3.46 0"></path>
    </svg>
  );

  return (
    <div className="h-[82px] overflow-hidden relative bg-[rgba(85,172,98,0.63)] backdrop-blur-sm shadow-[0px_2px_48px_0px_rgba(0,0,0,0.13)]" data-name="Header">
      {/* User Avatar Circle */}
      <div className="absolute left-3 top-3.5 w-[53px] h-[53px] overflow-hidden">
        <div className="w-[81px] h-[81px] relative -left-3 -top-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
          <UserIcon />
        </div>
      </div>

      {/* Bell Notification */}
      <div className="absolute right-[15px] top-[22px] overflow-hidden">
        <BellIcon />
      </div>

      {/* Title */}
      <div className="absolute left-[73px] right-[75px] top-0 bottom-[12px] flex items-center justify-start">
        <h1 className="font-['Karla'] font-bold text-[#086214] text-[32px] leading-[1.5] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.24)]">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default Header;