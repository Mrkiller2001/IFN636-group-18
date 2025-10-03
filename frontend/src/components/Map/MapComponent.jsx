import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers using CDN URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapComponent({
  center = [-74.006, 40.7128], // Default to NYC
  zoom = 12,
  bins = [],
  trucks = [],
  routes = [],
  height = '420px',
  interactive = true,
  onBinClick = null,
  onTruckClick = null,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const binMarkersRef = useRef([]);
  const truckMarkersRef = useRef([]);
  const routeMarkersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Wait a bit to ensure the container is properly rendered
    const initMap = () => {
      try {
        // Initialize map with error handling
        
        // Ensure container has proper dimensions
        if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
          setTimeout(initMap, 100);
          return;
        }
      
      mapInstance.current = L.map(mapRef.current, {
        center: [center[1], center[0]], // Leaflet uses [lat, lng]
        zoom: zoom,
        zoomControl: true, // Always show zoom controls
        dragging: interactive,
        touchZoom: interactive,
        doubleClickZoom: interactive,
        scrollWheelZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive,
        preferCanvas: true, // Better performance
      });

      // Add OpenStreetMap tiles with error handling
      // Try multiple tile servers as fallback
      let tileLayer;
      // Add OpenStreetMap tiles
      tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });

      tileLayer.addTo(mapInstance.current);

      // Force map to invalidate size after initialization
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 100);

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
    };

    // Start initialization immediately, but with checks
    initMap();

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        }
        mapInstance.current = null;
      }
    };
  }, [center, interactive, zoom]);

  // Update map center and zoom
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setView([center[1], center[0]], zoom);
    }
  }, [center, zoom]);

  // Clear specific marker types
  const clearBinMarkers = () => {
    if (mapInstance.current && binMarkersRef.current) {
      binMarkersRef.current.forEach(marker => {
        if (marker && mapInstance.current) {
          try {
            mapInstance.current.removeLayer(marker);
          } catch (error) {
            // Ignore errors
          }
        }
      });
      binMarkersRef.current = [];
    }
  };

  const clearTruckMarkers = () => {
    if (mapInstance.current && truckMarkersRef.current) {
      truckMarkersRef.current.forEach(marker => {
        if (marker && mapInstance.current) {
          try {
            mapInstance.current.removeLayer(marker);
          } catch (error) {
            // Ignore errors
          }
        }
      });
      truckMarkersRef.current = [];
    }
  };

  const clearRouteMarkers = () => {
    if (mapInstance.current && routeMarkersRef.current) {
      routeMarkersRef.current.forEach(marker => {
        if (marker && mapInstance.current) {
          try {
            mapInstance.current.removeLayer(marker);
          } catch (error) {
            // Ignore errors
          }
        }
      });
      routeMarkersRef.current = [];
    }
  };

  // Create custom icon for bins
  const createBinIcon = (fillLevel) => {
    const color = fillLevel >= 80 ? '#ef4444' : fillLevel >= 60 ? '#f59e0b' : '#10b981';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-bin-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  };

  // Create custom icon for trucks
  const createTruckIcon = (status) => {
    const color = status === 'active' ? '#3b82f6' : status === 'maintenance' ? '#f59e0b' : '#6b7280';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 4px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">🚛</div>`,
      className: 'custom-truck-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  // Add bin markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing bin markers first
    clearBinMarkers();

    // Add new bin markers
    if (bins && bins.length > 0) {
      bins.forEach((bin, index) => {
        try {
          if (bin.location && bin.location.coordinates && Array.isArray(bin.location.coordinates)) {
            const [lng, lat] = bin.location.coordinates;
            if (typeof lng === 'number' && typeof lat === 'number') {
              const icon = createBinIcon(bin.latestFillPct || 0);
              
              const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                  <div>
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${bin.address || bin.name || 'Unknown Address'}</h3>
                    <p style="margin: 4px 0;"><strong>Fill Level:</strong> ${bin.latestFillPct || 0}%</p>
                    <p style="margin: 4px 0;"><strong>Status:</strong> ${bin.status || 'Unknown'}</p>
                    <p style="margin: 4px 0;"><strong>Type:</strong> ${bin.type || 'Unknown'}</p>
                    ${bin.lastCollection ? `<p style="margin: 4px 0;"><strong>Last Collection:</strong> ${new Date(bin.lastCollection).toLocaleDateString()}</p>` : ''}
                  </div>
                `);

              if (mapInstance.current) {
                marker.addTo(mapInstance.current);
                
                if (onBinClick) {
                  marker.on('click', () => onBinClick(bin));
                }

                binMarkersRef.current.push(marker);
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to add marker for bin ${index}:`, error);
        }
      });
    }
  }, [bins, onBinClick]);

  // Add truck markers
  useEffect(() => {
    if (!mapInstance.current || !trucks || trucks.length === 0) return;

    clearTruckMarkers(); // Clear existing truck markers first

    trucks.forEach((truck, index) => {
      try {
        if (truck.currentLocation && truck.currentLocation.coordinates && Array.isArray(truck.currentLocation.coordinates)) {
          const [lng, lat] = truck.currentLocation.coordinates;
          if (typeof lng === 'number' && typeof lat === 'number') {
            const icon = createTruckIcon(truck.status);
            
            const marker = L.marker([lat, lng], { icon })
              .bindPopup(`
                <div>
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${truck.licensePlate || truck.driverId || 'Unknown Truck'}</h3>
                  <p style="margin: 4px 0;"><strong>Status:</strong> ${truck.status || 'Unknown'}</p>
                  <p style="margin: 4px 0;"><strong>Capacity:</strong> ${truck.capacity || 'Unknown'}</p>
                  <p style="margin: 4px 0;"><strong>Driver:</strong> ${truck.driverId || 'Unknown'}</p>
                </div>
              `);

            if (mapInstance.current) {
              marker.addTo(mapInstance.current);
              
              if (onTruckClick) {
                marker.on('click', () => onTruckClick(truck));
              }

              truckMarkersRef.current.push(marker);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to add marker for truck ${index}:`, error);
      }
    });
  }, [trucks, onTruckClick]);

  // Add route polylines
  useEffect(() => {
    if (!mapInstance.current || !routes || routes.length === 0) return;

    clearRouteMarkers(); // Clear existing route markers first

    routes.forEach((route, index) => {
      try {
        if (route.coordinates && Array.isArray(route.coordinates) && route.coordinates.length > 1) {
          const latLngs = route.coordinates.map(coord => [coord[1], coord[0]]); // Convert to [lat, lng]
          const color = route.status === 'active' ? '#3b82f6' : route.status === 'completed' ? '#10b981' : '#6b7280';
          
          const polyline = L.polyline(latLngs, {
            color: color,
            weight: 4,
            opacity: 0.8,
            dashArray: route.status === 'planned' ? '10, 10' : undefined
          });

          if (mapInstance.current) {
            polyline.addTo(mapInstance.current);
            routeMarkersRef.current.push(polyline);
          }
        }
      } catch (error) {
        console.warn(`Failed to add route ${index}:`, error);
      }
    });
  }, [routes]);



  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: height, 
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0,
        backgroundColor: '#e5e7eb' // Light gray fallback background
      }}
      className="shadow-md"
    />
  );
}
