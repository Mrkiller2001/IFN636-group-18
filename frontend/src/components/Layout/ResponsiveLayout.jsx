import { useState, useEffect } from 'react';
import StatusBar from './StatusBar';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import Sidebar from './Sidebar';

const ResponsiveLayout = ({ children, title, showNavigation = true }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    // Mobile Layout
    return (
      <div className="bg-white relative min-h-screen max-w-[393px] mx-auto overflow-hidden">
        <StatusBar />
        <Header title={title} />
        <div className={`${showNavigation ? 'pb-20' : ''} min-h-[calc(100vh-126px)]`}>
          {children}
        </div>
        {showNavigation && <BottomNavigation />}
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      {showNavigation && <Sidebar />}
      
      {/* Main Content Area */}
      <div className={`flex-1 ${showNavigation ? 'ml-64' : ''} transition-all duration-300`}>
        {/* Desktop Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-[#086214]">{title}</h1>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveLayout;