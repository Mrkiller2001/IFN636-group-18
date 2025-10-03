# Smart Waste Collection Frontend

![React](https://img.shields.io/badge/react-18.x-blue)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.x-blue)
![Leaflet](https://img.shields.io/badge/leaflet-maps-green)
![Responsive](https://img.shields.io/badge/responsive-mobile%20%7C%20desktop-brightgreen)

Modern, responsive React frontend for the Smart Waste Collection system with interactive mapping, real-time updates, and mobile-optimized design.

**Tech Stack:** React 18 • Tailwind CSS • Leaflet Maps • Axios • Context API

---

## 🚀 Live Demo
**Production URL:** http://3.107.185.222

**Demo Account:**
- **Email:** `stealth959@hotmail.co`
- **Password:** `1234`

---

## ✨ Features

### 🗺️ **Interactive Mapping**
- **Real-time Maps**: Leaflet integration with OpenStreetMap tiles
- **Interactive Markers**: Click bins for details, live updates
- **Mobile Optimized**: Touch-friendly map controls
- **GeoJSON Support**: Precise location rendering

### 📱 **Responsive Design**
- **Desktop Layout**: Sidebar navigation with full-width content
- **Mobile Layout**: Bottom navigation bar with collapsible panels
- **Adaptive UI**: Components resize and reflow for all screen sizes
- **Touch Friendly**: Optimized for mobile interaction

### 🔐 **Authentication & Security**
- **JWT Integration**: Secure token-based authentication
- **Protected Routes**: Automatic login redirection
- **Session Management**: Persistent login with refresh capability
- **User Profile**: Account management and settings

### 🗂️ **Smart Bin Management**
- **CRUD Operations**: Create, view, edit, delete bins
- **Interactive Forms**: Address geocoding and validation
- **Status Tracking**: Real-time fill level and status updates
- **Filtering**: Type and status-based filtering

### 🚛 **Route Planning Interface**
- **Visual Route Planning**: Interactive map-based route creation
- **Progress Tracking**: Real-time route completion status
- **Stop Management**: Individual stop completion tracking
- **Fleet Integration**: Truck assignment and management

---

## 🏗️ Project Structure

```
frontend/
├─ public/
│  ├─ index.html (Main HTML template)
│  ├─ manifest.json (PWA configuration)
│  └─ favicon.ico
├─ src/
│  ├─ components/           # Reusable UI components
│  │  ├─ Layout/           # Layout components
│  │  │  ├─ ResponsiveLayout.jsx  # Desktop/mobile layouts
│  │  │  ├─ Sidebar.jsx           # Desktop navigation
│  │  │  └─ MobileBottomNav.jsx   # Mobile navigation
│  │  ├─ Map/              # Mapping components
│  │  │  ├─ MapComponent.jsx      # Main map component
│  │  │  ├─ BinMarker.jsx         # Bin location markers
│  │  │  └─ RouteLayer.jsx        # Route visualization
│  │  ├─ UI/               # Generic UI components
│  │  │  ├─ Button.jsx
│  │  │  ├─ Modal.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  └─ FillBadge.jsx         # Bin fill level indicator
│  │  ├─ BinForm.jsx       # Bin creation/editing
│  │  ├─ BinList.jsx       # Bin listing with filters
│  │  ├─ RoutePlanForm.jsx # Route creation form
│  │  ├─ RoutePlansList.jsx # Route listing
│  │  ├─ AddressInput.jsx  # Geocoding address input
│  │  └─ Navbar.jsx        # Main navigation
│  ├─ pages/               # Route-specific pages
│  │  ├─ Login.jsx         # Authentication
│  │  ├─ Dashboard.jsx     # Main dashboard
│  │  ├─ Bins.jsx          # Bin management
│  │  ├─ BinDetails.jsx    # Individual bin details
│  │  ├─ Routes.jsx        # Route planning
│  │  ├─ RouteDetails.jsx  # Route execution
│  │  ├─ Trucks.jsx        # Fleet management
│  │  └─ Map.jsx           # Full-screen map view
│  ├─ context/             # React Context providers
│  │  └─ AuthContext.js    # Authentication state
│  ├─ services/            # API integration
│  │  ├─ binService.js     # Bin-related API calls
│  │  ├─ routeService.js   # Route-related API calls
│  │  └─ authService.js    # Authentication API calls
│  ├─ hooks/               # Custom React hooks
│  │  ├─ useAuth.js        # Authentication hook
│  │  ├─ useMap.js         # Map integration hook
│  │  └─ useApi.js         # API calling hook
│  ├─ utils/               # Utility functions
│  │  ├─ formatters.js     # Data formatting
│  │  └─ validators.js     # Form validation
│  ├─ axiosConfig.jsx      # API client configuration
│  ├─ App.js              # Main app component
│  ├─ App.css             # Global styles
│  └─ index.js            # App entry point
├─ build/                  # Production build output
├─ package.json           # Dependencies and scripts
└─ tailwind.config.js     # Tailwind CSS configuration
```

---

## 🛠️ Development Setup

### **Prerequisites**
- Node.js ≥ 18.0.0
- npm or yarn package manager
- Running backend API (see main README)

### **Installation**

```bash
# Clone repository (if not already done)
git clone https://github.com/your-username/Garbage-Collection-Manager.git
cd Garbage-Collection-Manager/frontend

# Install dependencies
npm install
```

### **Environment Configuration**

Create `.env` file in the frontend directory:
```env
REACT_APP_API_BASE=http://localhost:5001
REACT_APP_MAP_TILES=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_GEOCODING_URL=https://nominatim.openstreetmap.org/search
REACT_APP_VERSION=1.0.0
```

### **Development Scripts**

```bash
# Start development server with hot reload
npm start                 # Runs on http://localhost:3000

# Build for production
npm run build            # Creates optimized build in ./build/

# Run tests (if configured)
npm test                 # Runs test suites

# Analyze build bundle
npm run build && npx serve -s build
```

---

## 🎨 Component Architecture

### **Layout System**
```jsx
<ResponsiveLayout>
  {/* Desktop: Sidebar + Main Content */}
  {/* Mobile: Bottom Navigation + Full Content */}
</ResponsiveLayout>
```

### **Map Integration**
```jsx
<MapComponent
  bins={bins}
  routes={routes}
  center={[lat, lng]}
  zoom={13}
  onBinClick={handleBinSelect}
  onRouteSelect={handleRouteSelect}
/>
```

### **Form Components**
```jsx
<BinForm
  onSubmit={handleBinSubmit}
  initialData={selectedBin}
  showMap={true}
/>

<AddressInput
  onSelect={handleAddressSelect}
  placeholder="Enter bin location"
/>
```

### **Data Flow**
```
AuthContext → API Services → Page Components → UI Components
     ↓              ↓              ↓              ↓
  User State → Data Fetching → Business Logic → Presentation
```

---

## 🗺️ Mapping Features

### **Leaflet Integration**
- **Base Maps**: OpenStreetMap tiles with custom styling
- **Markers**: Custom bin status indicators
- **Popups**: Interactive bin information panels
- **Controls**: Zoom, layers, location controls

### **GeoJSON Support**
```javascript
// Bin locations in GeoJSON format
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

### **Interactive Features**
- Click bins for details
- Route visualization with waypoints
- Real-time status updates
- Mobile touch gestures

---

## 📱 Responsive Design

### **Breakpoints**
```css
/* Mobile First Approach */
sm: '640px',   // Small screens
md: '768px',   // Medium screens (tablets)
lg: '1024px',  // Large screens (desktop)
xl: '1280px',  // Extra large screens
```

### **Layout Variations**

**Desktop (≥1024px):**
- Sidebar navigation
- Multi-column layouts
- Hover interactions
- Keyboard shortcuts

**Tablet (768px - 1023px):**
- Collapsible sidebar
- Touch-optimized controls
- Swipe gestures

**Mobile (<768px):**
- Bottom navigation bar
- Full-screen modals
- Touch-first interactions
- Simplified layouts

---

## 🔧 State Management

### **Authentication Context**
```jsx
const { user, login, logout, isAuthenticated } = useAuth();
```

### **API Integration**
```jsx
// Custom hooks for API calls
const { data, loading, error } = useApi('/api/bins');
const { submitForm } = useFormSubmission('/api/bins', onSuccess);
```

### **Local State Management**
- React useState for component state
- useEffect for side effects
- Custom hooks for reusable logic
- Context API for global state

---

## 🎨 Styling & Theming

### **Tailwind CSS Classes**
```jsx
// Responsive utility classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  
// Custom component styles
<button className="btn-primary hover:btn-primary-hover transition-colors">
  
// Mobile-first responsive design
<nav className="fixed bottom-0 w-full md:static md:w-64">
```

### **Custom CSS Variables**
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

---

## 🚀 Performance Optimization

### **Code Splitting**
```jsx
// Lazy loading for route components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BinDetails = React.lazy(() => import('./pages/BinDetails'));
```

### **Image Optimization**
- Optimized map tile loading
- Lazy loading for images
- WebP format support
- Responsive image sizes

### **Bundle Optimization**
- Tree shaking for unused code
- Code splitting by routes
- Minification and compression
- Caching strategies

---

## 🧪 Testing Strategy

### **Component Testing**
```jsx
// Example test structure
describe('BinForm Component', () => {
  it('should submit form with valid data', () => {
    // Test implementation
  });
  
  it('should show validation errors', () => {
    // Test implementation
  });
});
```

### **Integration Testing**
- API integration tests
- Route navigation tests
- Authentication flow tests
- Map interaction tests

---

## 📦 Deployment

### **Build Process**
```bash
# Create production build
npm run build

# Serve build locally for testing
npx serve -s build

# Build analysis
npm run build && npx webpack-bundle-analyzer build/static/js/*.js
```

### **Deployment Options**

**Static Hosting:**
- Netlify, Vercel, GitHub Pages
- Automatic deployments from git
- CDN distribution

**Traditional Hosting:**
- Apache, Nginx
- PM2 for process management
- Load balancing support

---

## 🔍 Troubleshooting

### **Common Issues**

**Map Not Loading:**
```bash
# Check API endpoint configuration
# Verify CORS settings on backend
# Check browser console for errors
```

**Build Failures:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be >= 18
```

**API Connection Issues:**
```bash
# Verify backend is running
curl http://localhost:5001/api/health

# Check REACT_APP_API_BASE in .env
echo $REACT_APP_API_BASE
```

---

## 🤝 Contributing

1. **Component Development**: Follow React best practices
2. **Styling**: Use Tailwind CSS utilities
3. **Testing**: Write tests for new components
4. **Documentation**: Update README for new features
5. **Responsive**: Test on multiple screen sizes

### **Code Standards**
- Functional components with hooks
- TypeScript-ready (JSX)
- ESLint configuration
- Prettier formatting
- Semantic commit messages

---

**🔗 Related Documentation:**
- [Main Project README](../README.md)
- [Backend API Documentation](../backend/README.md)
- [Design Patterns Report](../Task4_Design_Patterns_OOP_Report.md)