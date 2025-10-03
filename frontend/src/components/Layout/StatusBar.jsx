// Status bar component matching the Figma design
const StatusBar = () => {
  return (
    <div className="bg-gray-50 h-[44px] overflow-hidden relative w-full" data-name="Statusbar">
      <div className="absolute h-[30px] left-0 right-0 top-0" data-name="Notch" />
      <div className="absolute flex gap-1 items-center right-3.5 top-4" data-name="Status Icons">
        {/* Network Signal */}
        <div className="h-3.5 relative w-5" data-name="Network Signal">
          <div className="w-2 h-2 bg-gray-800 rounded-sm absolute right-0 bottom-1"></div>
          <div className="w-1.5 h-1.5 bg-gray-800 rounded-sm absolute right-2.5 bottom-1"></div>
          <div className="w-1 h-1 bg-gray-800 rounded-sm absolute right-4 bottom-1"></div>
        </div>
        {/* WiFi Signal */}
        <div className="h-3.5 relative w-4" data-name="WiFi Signal">
          <div className="w-3 h-3 border-2 border-gray-800 rounded-full absolute right-0 bottom-0"></div>
        </div>
        {/* Battery */}
        <div className="h-3.5 relative w-6" data-name="Battery">
          <div className="absolute h-3 left-0 top-0.5 w-5 border border-gray-800 rounded-sm">
            <div className="absolute bg-gray-950 h-2 left-0.5 rounded-sm top-0.5 w-4" />
          </div>
          <div className="absolute h-1 right-0 top-1.5 w-0.5 bg-gray-800 rounded-r-sm" />
        </div>
      </div>
      <div className="absolute h-5 left-5 overflow-hidden rounded-full top-3 w-14" data-name="Time">
        <div className="absolute font-semibold text-sm text-gray-900 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          9:41
        </div>
      </div>
    </div>
  );
};

export default StatusBar;