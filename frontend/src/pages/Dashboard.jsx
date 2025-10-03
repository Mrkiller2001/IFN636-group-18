import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import GreenButton from '../components/UI/GreenButton';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const newsItems = [
    "The BCC Depot has successfully completed re..",
    "New contracts have been signed with the follo..",
    "Over 100 new trucks have been contracted to...",
    "The End-of-Year events for staff begin soon, t.."
  ];

  return (
    <ResponsiveLayout title="Dashboard">
      {/* Background Circles */}
      <div className="absolute left-[-49px] w-[497px] h-[497px] top-[155px] bg-gradient-to-br from-green-100/20 to-green-200/30 rounded-full -z-10" />
      <div className="absolute left-[-10px] w-[414px] h-[414px] top-[194px] bg-gradient-to-br from-green-50/40 to-green-100/20 rounded-full -z-10" />
      
      {/* Welcome Message */}
      <div className="px-4 pt-6">
        <h1 className="font-['Karla'] font-extrabold text-[32px] text-[#2d7637] leading-[1.5] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-center mb-8">
          Welcome, {user?.name || 'USER'}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="px-4 space-y-6">
        <GreenButton 
          onClick={() => navigate('/bins')}
          className="w-full max-w-[252px] mx-auto block"
        >
          BINS
        </GreenButton>
        
        <GreenButton 
          onClick={() => navigate('/trucks')}
          className="w-full max-w-[252px] mx-auto block"
        >
          TRUCKS
        </GreenButton>
        
        <GreenButton 
          onClick={() => navigate('/routes')}
          className="w-full max-w-[252px] mx-auto block"
        >
          ROUTES
        </GreenButton>
      </div>

      {/* Latest News Section */}
      <div className="px-4 mt-12">
        <GreenButton 
          className="w-full max-w-[252px] mx-auto block mb-4"
          variant="primary"
        >
          Latest News
        </GreenButton>
        
        <div className="space-y-2">
          {newsItems.map((item, index) => (
            <div 
              key={index}
              className="bg-neutral-100 h-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-2"
            >
              <p className="font-['Kreon'] font-semibold text-[12px] text-[rgba(0,0,0,0.7)] truncate">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Dashboard;