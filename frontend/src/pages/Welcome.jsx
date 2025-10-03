import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/Layout/StatusBar';
import GreenButton from '../components/UI/GreenButton';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white relative min-h-screen max-w-[393px] mx-auto" data-name="App Launch">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Decorative Image Background */}
      <div className="absolute h-[335px] left-[-62px] top-[91px] w-[503px] bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center overflow-hidden">
        <div className="text-9xl">🗂️</div>
      </div>
      
      {/* Background Circle */}
      <div className="absolute left-[-52px] w-[497px] h-[497px] top-[103px] bg-gradient-to-br from-green-100/40 to-green-200/30 rounded-full" />
      
      {/* App Title */}
      <div className="absolute left-[123px] top-[400px]">
        <h1 className="font-['Karla'] font-bold text-[48px] text-[#086214] leading-[1.5] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.24)]">
          Waste
        </h1>
      </div>
      <div className="absolute left-[94px] top-[452px]">
        <h1 className="font-['Karla'] font-bold text-[48px] text-[#086214] leading-[1.5] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.24)]">
          Manager
        </h1>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute left-1/2 transform -translate-x-1/2 space-y-4" style={{ top: 'calc(50% + 217.5px)' }}>
        <GreenButton 
          onClick={() => navigate('/login')}
          className="w-[252px]"
        >
          Login
        </GreenButton>
        
        <GreenButton 
          onClick={() => navigate('/register')}
          className="w-[252px]"
        >
          Create Account
        </GreenButton>
      </div>
      
      {/* Forgot Password Link */}
      <p className="absolute font-['Karla'] font-medium text-[11px] text-[rgba(0,0,0,0.26)] left-[71px] top-[664px]">
        <button 
          onClick={() => navigate('/forgot-password')} 
          className="hover:underline"
        >
          Forgot Password?
        </button>
      </p>
    </div>
  );
};

export default Welcome;