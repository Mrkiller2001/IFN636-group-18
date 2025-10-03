const FormInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3 relative">
        {icon && (
          <div className="w-[15px] h-[15px] mr-3 flex-shrink-0">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent font-['Kreon'] font-semibold text-[12px] text-[#c9c9c9] placeholder:text-[#c9c9c9] outline-none"
        />
      </div>
    </div>
  );
};

export default FormInput;