import StatusBar from './StatusBar';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const MobileLayout = ({ children, title, showNavigation = true }) => {
  return (
    <div className="bg-white relative min-h-screen max-w-[393px] mx-auto overflow-hidden">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <Header title={title} />
      
      {/* Main Content */}
      <div className={`${showNavigation ? 'pb-20' : ''} min-h-[calc(100vh-126px)]`}>
        {children}
      </div>
      
      {/* Bottom Navigation */}
      {showNavigation && <BottomNavigation />}
    </div>
  );
};

export default MobileLayout;