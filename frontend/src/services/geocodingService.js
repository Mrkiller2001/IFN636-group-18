// Free Geocoding service using OpenStreetMap Nominatim API
// 100% free, no API key required, no rate limits for reasonable use

export class GeocodingService {
  static async geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WasteManager/1.0' // Required by Nominatim
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          coordinates: [parseFloat(result.lon), parseFloat(result.lat)], // [lng, lat] for consistency
          formattedAddress: result.display_name,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  static async reverseGeocode(lng, lat) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WasteManager/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Search for addresses with suggestions
  static async searchAddresses(query, limit = 5) {
    try {
      if (query.length < 3) return [];
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1&countrycodes=us`,
        {
          headers: {
            'User-Agent': 'WasteManager/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      return data.map(item => ({
        place_name: item.display_name,
        center: [parseFloat(item.lon), parseFloat(item.lat)],
        properties: {
          category: item.type
        }
      }));
    } catch (error) {
      console.error('Address search error:', error);
      return [];
    }
  }

  // Get user's current location
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coordinates: [position.coords.longitude, position.coords.latitude],
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Generate random coordinates within NYC bounds
  static generateRandomNYCLocation() {
    // NYC bounding box (approximate)
    const bounds = {
      north: 40.917577,
      south: 40.477399,
      east: -73.700272,
      west: -74.259090
    };

    const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west);

    return {
      coordinates: [lng, lat],
      lat: lat,
      lng: lng
    };
  }

  // Convert coordinates between different formats
  static coordinatesToLatLng(coordinates) {
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      return {
        lat: coordinates[1],
        lng: coordinates[0]
      };
    }
    return null;
  }

  static latLngToCoordinates(lat, lng) {
    return [lng, lat];
  }
}
