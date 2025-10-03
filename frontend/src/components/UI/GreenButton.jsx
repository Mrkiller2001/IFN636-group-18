const GreenButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '' 
}) => {
  const baseClasses = "font-['Karla'] font-medium leading-[1.5] text-white rounded-[12px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-200 flex items-center justify-center";
  
  const variants = {
    primary: 'bg-[#55ac62] hover:bg-[#4e9b59] active:bg-[#459550]',
    secondary: 'bg-[#3e974b] hover:bg-[#358a42] active:bg-[#2d7a39]',
    accent: 'bg-[#086214] hover:bg-[#075612] active:bg-[#064a10]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm h-[32px] text-[14px]',
    md: 'px-[18px] py-[14px] text-[18px] h-[39px]',
    lg: 'px-6 py-4 text-xl h-[48px] text-[20px]'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default GreenButton;