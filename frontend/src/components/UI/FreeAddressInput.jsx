import { useState, useEffect } from 'react';
import { FreeGeocodingService } from '../../services/freeGeocodingService';

export default function FreeAddressInput({ 
  value = '', 
  onChange, 
  placeholder = 'Enter address...',
  className = '',
  onCoordinatesChange = null,
  icon = null
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchAddresses = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const results = await FreeGeocodingService.searchAddresses(value, 5);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Address search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchAddresses, 500); // Longer delay to be respectful to free service
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSuggestionClick = (suggestion) => {
    const address = suggestion.place_name;
    const coordinates = suggestion.center;
    
    onChange({ target: { value: address } });
    if (onCoordinatesChange) {
      onCoordinatesChange(coordinates);
    }
    
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    onChange(e);
    if (e.target.value.length < 3) {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await FreeGeocodingService.getCurrentLocation();
      const address = await FreeGeocodingService.reverseGeocode(
        location.lng, 
        location.lat
      );
      
      if (address) {
        onChange({ target: { value: address } });
        if (onCoordinatesChange) {
          onCoordinatesChange(location.coordinates);
        }
      }
    } catch (error) {
      console.error('Location error:', error);
      alert('Could not get your location. Please enter address manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <div className="absolute left-2 z-10">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
            ${icon ? 'pl-8' : 'pl-3'} pr-10
            font-['Kreon'] font-semibold text-[12px] text-gray-700
            ${className}
          `}
        />
        
        {/* Current Location Button */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="absolute right-2 z-10 p-1 text-gray-500 hover:text-[#55ac62] transition-colors"
          title="Use current location"
        >
          {loading ? (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3,11 22,2 13,21 11,13 3,11"></polygon>
            </svg>
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-['Kreon'] text-[12px] text-gray-900">
                {suggestion.place_name}
              </div>
              {suggestion.properties?.category && (
                <div className="font-['Kreon'] text-[10px] text-gray-500">
                  {suggestion.properties.category}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && suggestions.length === 0 && value.length >= 3 && (
        <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-md shadow-lg mt-1 p-3">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="font-['Kreon'] text-[12px] text-gray-500">Searching addresses...</span>
          </div>
        </div>
      )}

      {/* Powered by OpenStreetMap notice */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-10 bg-gray-50 border-t border-gray-200 px-3 py-1 text-center rounded-b-md">
          <span className="font-['Kreon'] text-[10px] text-gray-500">
            Powered by OpenStreetMap
          </span>
        </div>
      )}
    </div>
  );
}