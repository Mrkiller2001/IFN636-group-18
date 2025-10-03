import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different types
const createCustomIcon = (color, iconType = 'bin') => {
  const svgIcon = iconType === 'bin' ? 
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="${color}" strokeWidth="2">
      <path d="M4 7h16"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>` :
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="${color}" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16,8 20,8 23,11 23,16 16,16"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>`;

  return L.divIcon({
    html: `<div style="background: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${svgIcon}</div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function FreeMapComponent({ 
  bins = [], 
  trucks = [], 
  routes = [],
  center = [40.7128, -74.006], // NYC coordinates [lat, lng]
  zoom = 12,
  height = '420px',
  onBinClick = null,
  onTruckClick = null,
  interactive = true
}) {
  
  // Convert bins to Leaflet format
  const binMarkers = bins.map(bin => {
    if (!bin.location?.lat || !bin.location?.lng) return null;
    
    const statusColors = {
      'normal': '#55ac62',
      'needs_pickup': '#ef4444',
      'out_of_service': '#6b7280'
    };
    
    const fillColors = {
      0: '#22c55e',      // 0% - green
      25: '#84cc16',     // 25% - lime  
      50: '#eab308',     // 50% - yellow
      75: '#f97316',     // 75% - orange
      100: '#ef4444'     // 100% - red
    };
    
    const fillLevel = bin.latestFillPct || 0;
    const fillColor = fillColors[Math.round(fillLevel / 25) * 25] || '#22c55e';
    
    return {
      ...bin,
      position: [bin.location.lat, bin.location.lng],
      icon: createCustomIcon(fillColor, 'bin')
    };
  }).filter(Boolean);

  // Convert trucks to Leaflet format  
  const truckMarkers = trucks.map(truck => {
    if (!truck.currentLocation?.coordinates || truck.currentLocation.coordinates.length !== 2) return null;
    
    const statusColors = {
      'Available': '#3b82f6',
      'On Route': '#8b5cf6', 
      'Maintenance': '#f59e0b',
      'Out of Service': '#ef4444'
    };
    
    return {
      ...truck,
      position: [truck.currentLocation.coordinates[1], truck.currentLocation.coordinates[0]], // [lat, lng]
      icon: createCustomIcon(statusColors[truck.status] || '#3b82f6', 'truck')
    };
  }).filter(Boolean);

  // Convert routes to polylines
  const routeLines = routes.map(route => {
    if (!route.bins || route.bins.length < 2) return null;
    
    const positions = route.bins
      .filter(bin => bin.location?.lat && bin.location?.lng)
      .map(bin => [bin.location.lat, bin.location.lng]);
      
    if (positions.length < 2) return null;
    
    const statusColors = {
      'planned': '#55ac62',
      'active': '#3e974b', 
      'completed': '#8bc193',
      'cancelled': '#ef4444'
    };
    
    return {
      positions,
      color: statusColors[route.status] || '#55ac62',
      dashArray: route.status === 'planned' ? '10, 10' : undefined
    };
  }).filter(Boolean);

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        scrollWheelZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
      >
        {/* Free OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Alternative tile layers (uncomment to use) */}
        {/* CartoDB Positron (Light theme) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        /> */}
        
        {/* Bin markers */}
        {binMarkers.map((bin, index) => (
          <Marker 
            key={`bin-${bin._id || index}`}
            position={bin.position}
            icon={bin.icon}
            eventHandlers={{
              click: () => onBinClick && onBinClick(bin)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm text-gray-800">{bin.name}</h3>
                <p className="text-xs text-gray-600">{bin.address}</p>
                <p className="text-xs mt-1">
                  <span className="font-medium">Status:</span> 
                  <span className={`px-2 py-1 rounded text-xs ml-1 ${getStatusBadgeClass(bin.status)}`}>
                    {bin.status.replace('_', ' ')}
                  </span>
                </p>
                <p className="text-xs">
                  <span className="font-medium">Fill Level:</span> {bin.latestFillPct || 0}%
                </p>
                <p className="text-xs">
                  <span className="font-medium">Capacity:</span> {bin.capacityLitres}L
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Truck markers */}
        {truckMarkers.map((truck, index) => (
          <Marker 
            key={`truck-${truck._id || index}`}
            position={truck.position}
            icon={truck.icon}
            eventHandlers={{
              click: () => onTruckClick && onTruckClick(truck)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm text-gray-800">{truck.licensePlate}</h3>
                <p className="text-xs text-gray-600">{truck.currentLocation?.address}</p>
                <p className="text-xs mt-1">
                  <span className="font-medium">Status:</span> 
                  <span className={`px-2 py-1 rounded text-xs ml-1 ${getTruckStatusBadgeClass(truck.status)}`}>
                    {truck.status}
                  </span>
                </p>
                <p className="text-xs">
                  <span className="font-medium">Fuel:</span> {truck.fuelLevel}%
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Route lines */}
        {routeLines.map((route, index) => (
          <Polyline 
            key={`route-${index}`}
            positions={route.positions}
            color={route.color}
            weight={3}
            opacity={0.8}
            dashArray={route.dashArray}
          />
        ))}
      </MapContainer>
    </div>
  );
}

// Helper functions for styling
function getStatusBadgeClass(status) {
  const classes = {
    'normal': 'bg-green-100 text-green-800',
    'needs_pickup': 'bg-red-100 text-red-800',
    'out_of_service': 'bg-gray-100 text-gray-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function getTruckStatusBadgeClass(status) {
  const classes = {
    'Available': 'bg-green-100 text-green-800',
    'On Route': 'bg-blue-100 text-blue-800',
    'Maintenance': 'bg-yellow-100 text-yellow-800',
    'Out of Service': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}