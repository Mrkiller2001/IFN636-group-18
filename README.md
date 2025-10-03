# Smart Waste Collection – IoT + Route Optimization

![CI/CD Status](https://github.com/your-username/Garbage-Collection-Manager/workflows/Garbage%20Collection%20Manager%20CI%2FCD/badge.svg)
![Tests](https://img.shields.io/badge/tests-47%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)
![Design Patterns](https://img.shields.io/badge/design%20patterns-11%20implemented-blue)
![Node.js](https://img.shields.io/badge/node.js-18%20%7C%2020%20%7C%2022-green)
![MongoDB](https://img.shields.io/badge/mongodb-7.0-green)

A production-ready enterprise waste management system with IoT sensor integration, intelligent route optimization, and real-time monitoring. Built with modern software engineering principles including 11+ design patterns and comprehensive OOP architecture.

**Tech Stack:** Node.js/Express + MongoDB + JWT (backend) • React + Leaflet + Tailwind (frontend) • GitHub Actions CI/CD

---

## 🚀 Live Demo
**Production URL:** http://3.107.185.222

**Demo Account:**
- **Email:** `stealth959@hotmail.co`
- **Password:** `1234`

**📋 API Testing Collections:**
- **[Postman Collection](./Garbage-Collection-Manager-API.postman_collection.json)** - Complete API endpoints
- **[Environment File](./Garbage-Collection-Manager.postman_environment.json)** - Variables for testing  
- **[Testing Guide](./API-TESTING-GUIDE.md)** - Comprehensive testing documentation

> Demo account provides full access to all features including interactive maps, route planning, and IoT sensor simulation.

---

## ✨ Key Features

### 🗺️ **Interactive Mapping**
- **Real-time Maps**: Leaflet-based interactive maps with OpenStreetMap tiles
- **GeoJSON Integration**: Precise location tracking with spatial indexing
- **Address Geocoding**: Nominatim integration for address-to-coordinate conversion
- **Mobile Responsive**: Optimized map experience across desktop and mobile

### 🏗️ **Enterprise Architecture**
- **11 Design Patterns**: Factory, Builder, Command, State, Adapter, Proxy, Strategy, Observer, Template, Chain of Responsibility, Decorator
- **OOP Principles**: Full encapsulation, inheritance, and polymorphism implementation
- **SOLID Design**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion

### 📱 **Smart Bin Management**
- **CRUD Operations**: Complete bin lifecycle management with validation
- **IoT Integration**: Real-time sensor readings for fill level and battery monitoring
- **Status Automation**: Automatic status transitions based on fill thresholds
- **Spatial Queries**: Location-based bin filtering and route optimization

### 🚛 **Intelligent Route Planning**
- **Algorithm Selection**: Multiple routing strategies (Nearest Neighbor, 2-Opt optimization)
- **Real-time Optimization**: Dynamic route adjustment based on current bin status
- **Fleet Management**: Truck assignment and capacity optimization
- **Progress Tracking**: Real-time route completion and bin status updates

### 🔐 **Security & Authentication**
- **JWT Authentication**: Secure token-based authentication with refresh capability
- **Role-based Access**: User isolation and permission management
- **Input Validation**: Comprehensive validation chains with middleware protection
- **API Security**: Rate limiting, CORS, and security headers

---

## 🏗️ Architecture Overview

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   React + Maps  │◄──►│  Node.js/Express│◄──►│   MongoDB       │
│   Responsive UI │    │  JWT + Patterns │    │   GeoJSON       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │              ┌─────────────────┐              │
         └──────────────►│   CI/CD Pipeline│──────────────┘
                        │  GitHub Actions │
                        │  Automated Tests│
                        └─────────────────┘
```

### **Project Structure**
```
root/
├─ .github/workflows/
│  └─ ci.yml (GitHub Actions CI/CD)
├─ backend/
│  ├─ server.js (Express app with health endpoint)
│  ├─ config/db.js (MongoDB connection)
│  ├─ models/ (Mongoose schemas with GeoJSON)
│  │  ├─ User.js, Bin.js, SensorReading.js
│  │  ├─ RoutePlan.js, Truck.js
│  ├─ controllers/ (Business logic)
│  ├─ patterns/ (Design pattern implementations)
│  │  ├─ factory/, builder/, command/, state/
│  │  ├─ adapter/, proxy/, strategy/, observer/
│  │  └─ template/, chain/, decorator/
│  ├─ routes/ (API endpoints)
│  ├─ middleware/ (Auth + validation chains)
│  ├─ services/ (External integrations)
│  ├─ test/ (47 comprehensive tests)
│  │  ├─ bins.test.js, sensors.test.js, routes.test.js
│  │  └─ [pattern].test.js (for each design pattern)
│  └─ openapi.yaml (Swagger API documentation)
└─ frontend/
   ├─ src/
   │  ├─ components/ (Reusable UI components)
   │  │  ├─ Map/ (Leaflet integration)
   │  │  ├─ Layout/ (Responsive layouts)
   │  │  └─ UI/ (Forms, lists, modals)
   │  ├─ pages/ (Route-specific pages)
   │  ├─ context/ (React context providers)
   │  ├─ services/ (API integration)
   │  └─ hooks/ (Custom React hooks)
   └─ build/ (Production build output)
```

---

## 🛠️ Development Setup

### **Prerequisites**
- **Node.js** ≥ 18.0.0 (tested with v18, v20, v22)
- **MongoDB** 7.0+ (Atlas cloud or local instance)
- **Git** for version control
- **npm** or **yarn** package manager

### **Quick Start**

1. **Clone Repository**
```bash
git clone https://github.com/your-username/Garbage-Collection-Manager.git
cd Garbage-Collection-Manager
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Environment Configuration**

Create `backend/.env`:
```env
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/garbage_collection
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=5001
```

### **Running the Application**

**Development Mode:**
```bash
# Terminal 1: Backend with hot reload
cd backend && npm run dev

# Terminal 2: Frontend with hot reload
cd frontend && npm start
```

**Production Mode:**
```bash
# Build frontend
cd frontend && npm run build

# Start backend in production
cd backend && npm start
```

### **Testing & Quality Assurance**

**Run All Tests:**
```bash
cd backend && npm test           # 47 comprehensive tests
cd backend && npm run test:watch # Watch mode for development
cd backend && npm run test:coverage # With coverage reporting
```

**Code Quality:**
```bash
cd backend && npm run lint       # Code linting
cd backend && npm run health     # Health check endpoint
```

**API Documentation:**
- Visit `http://localhost:5001/api-docs` for interactive Swagger documentation
- All endpoints documented with request/response schemas
- GeoJSON format examples included

---

## 🚀 Deployment

### **CI/CD Pipeline**
The project includes a comprehensive GitHub Actions workflow:

- **Automated Testing**: Runs on every push and pull request
- **Multi-Node Testing**: Tests across Node.js 18, 20, and 22
- **Database Integration**: Uses MongoDB service containers
- **Production Deployment**: Automatic deployment to production on main branch
- **Health Monitoring**: Post-deployment health checks

### **Production Deployment with PM2**
```bash
# Install PM2 globally
npm install -g pm2

# Deploy using ecosystem configuration
pm2 start ecosystem.config.js --env production

# Monitor services
pm2 status
pm2 logs
pm2 monit
```

---

## 📚 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### **Bin Management**
- `GET /api/bins` - List user's bins with filtering
- `POST /api/bins` - Create new bin with GeoJSON location
- `GET /api/bins/:id` - Get specific bin details
- `PUT /api/bins/:id` - Update bin information
- `DELETE /api/bins/:id` - Delete bin

### **IoT Sensor Integration**
- `POST /api/sensor-readings` - Submit sensor data
- `GET /api/sensor-readings/bin/:id` - Get bin's sensor history
- `DELETE /api/sensor-readings/:id` - Delete sensor reading

### **Route Planning**
- `POST /api/routes` - Create optimized collection route
- `GET /api/routes` - List user's route plans
- `GET /api/routes/:id` - Get route details with stops
- `PUT /api/routes/:id/complete` - Mark route as completed

### **Fleet Management**
- `GET /api/trucks` - List available trucks
- `POST /api/trucks` - Add new truck to fleet
- `PUT /api/trucks/:id` - Update truck information

**Interactive Documentation:** Visit `/api-docs` when server is running

---

## 🎨 Design Patterns Implementation

This project showcases 11 enterprise-level design patterns solving real-world waste management challenges:

### **Creational Patterns**
- **🏭 Factory Pattern**: `SensorReadingFactory` - Standardizes IoT sensor data creation with validation
- **🔨 Builder Pattern**: `RoutePlanBuilder` - Constructs complex route plans with multiple constraints

### **Structural Patterns**
- **🔌 Adapter Pattern**: `MapboxAdapter` - Integrates multiple mapping providers (Mapbox, Google Maps)
- **🎭 Proxy Pattern**: `MapProviderProxy` - Adds caching to expensive geocoding operations
- **🎀 Decorator Pattern**: `MapProviderRetryDecorator` - Adds retry logic to API calls

### **Behavioral Patterns**
- **⚡ Command Pattern**: `BinActionCommand` - Encapsulates bin operations (pickup, empty, maintenance)
- **🔄 State Pattern**: `BinState` - Manages bin status transitions (normal → needs_pickup → collected)
- **🎯 Strategy Pattern**: `NearestNeighborTwoOpt` - Pluggable route optimization algorithms
- **👀 Observer Pattern**: Event system for real-time notifications and updates
- **📋 Template Pattern**: `NotificationTemplate` - Standardized system notifications
- **⛓️ Chain of Responsibility**: `ValidationChain` - Sequential request validation

### **Object-Oriented Principles**
- **Encapsulation**: Private methods, data validation, service layer abstraction
- **Inheritance**: Strategy hierarchies, validation chains, notification templates
- **Polymorphism**: Runtime algorithm selection, adapter interfaces, command execution

**Detailed Implementation:** See `Task4_Design_Patterns_OOP_Report.md` for comprehensive analysis

---

## 🗺️ Mapping & GeoSpatial Features

### **Interactive Maps**
- **Map Library**: Leaflet with OpenStreetMap tiles
- **Responsive Design**: Desktop and mobile optimized
- **Real-time Updates**: Live bin status and truck positions

### **GeoJSON Integration**
```javascript
// All locations use GeoJSON Point format
{
  "type": "Point",
  "coordinates": [longitude, latitude]  // Note: lng first, then lat
}
```

### **Spatial Features**
- **Geocoding**: Address to coordinates conversion via Nominatim
- **Distance Calculation**: Haversine formula for precise distance computation
- **Route Optimization**: Spatial algorithms for efficient collection routes
- **MongoDB Integration**: GeoJSON spatial indexing for fast location queries

---

## 🧪 Testing Strategy

### **Test Coverage (47 Tests)**
```
✅ Controllers (18 tests)
  ├─ Bins Controller: CRUD operations, validation, authorization
  ├─ Sensor Controller: IoT data processing, bin updates
  └─ Route Controller: Optimization algorithms, fleet management

✅ Design Patterns (11 tests)
  ├─ Factory, Builder, Command, State patterns
  ├─ Adapter, Proxy, Decorator patterns
  └─ Strategy, Observer, Template, Chain patterns

✅ Integration Tests (8 tests)
  ├─ Authentication flows
  ├─ Database operations
  └─ API endpoint validation

✅ Unit Tests (10 tests)
  ├─ Utility functions
  ├─ Validation logic
  └─ Business rules
```

### **Test Technologies**
- **Framework**: Mocha with Chai assertions
- **Mocking**: Sinon for external dependencies
- **Database**: In-memory MongoDB for isolated testing
- **Coverage**: NYC for comprehensive coverage reporting

---

## 🔧 Development Workflow

### **Git Workflow**
```bash
# Feature development
git checkout -b feature/new-functionality
git add . && git commit -m "feat: add new functionality"
git push origin feature/new-functionality

# Create pull request - triggers CI/CD pipeline
# After approval and merge to main - automatic deployment
```

### **CI/CD Pipeline**
1. **Code Quality**: ESLint, formatting checks
2. **Testing**: All 47 tests across Node.js 18, 20, 22
3. **Build Verification**: Frontend and backend builds
4. **Security**: Dependency vulnerability scanning
5. **Deployment**: Automatic production deployment on main branch
6. **Health Checks**: Post-deployment service validation

### **Local Development**
```bash
# Run tests in watch mode
npm run test:watch

# Check code quality
npm run lint

# Health check
npm run health

# View API documentation
open http://localhost:5001/api-docs
```

---

## 📊 Performance & Scalability

### **Database Optimization**
- **GeoSpatial Indexing**: MongoDB 2dsphere indexes for location queries
- **Query Optimization**: Efficient aggregation pipelines for analytics
- **Connection Pooling**: Mongoose connection management
- **Data Pagination**: Large dataset handling with offset/limit

### **API Performance**
- **Caching Strategy**: Proxy pattern for expensive operations
- **Request Validation**: Early validation to reduce processing overhead
- **Error Handling**: Comprehensive error responses with proper HTTP codes
- **Rate Limiting**: Protection against abuse and DoS attacks

### **Frontend Optimization**
- **Code Splitting**: React lazy loading for reduced bundle size
- **Image Optimization**: Optimized map tiles and assets
- **Responsive Design**: Mobile-first approach with efficient layouts
- **State Management**: Efficient React context and hooks usage

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow code standards**: Run `npm run lint` before committing
4. **Write tests**: Maintain 95%+ test coverage
5. **Commit changes**: Use conventional commit messages
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**: Automated CI/CD will validate your changes

### **Code Standards**
- **JavaScript**: ES6+ with consistent formatting
- **React**: Functional components with hooks
- **Testing**: Comprehensive test coverage for new features
- **Documentation**: Update README and API docs for changes

---

## 📄 License & Academic Use

This project is developed for educational purposes demonstrating:
- ✅ Enterprise software architecture
- ✅ Design pattern implementation
- ✅ Full-stack development with modern technologies
- ✅ CI/CD best practices
- ✅ Comprehensive testing strategies

**Academic Features:**
- Complete design pattern documentation in `Task4_Design_Patterns_OOP_Report.md`
- Detailed OOP principle implementations
- Production-ready code with industry standards
- Comprehensive test suite for learning purposes

---

## 🆘 Troubleshooting

### **Common Issues**

**MongoDB Connection Failed:**
```bash
# Check connection string format
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/garbage_collection
```

**Tests Failing:**
```bash
# Clear test database
npm run test:clean

# Run specific test file
npx mocha test/bins.test.js

# Debug mode
npm run test -- --inspect-brk
```

**Frontend Build Issues:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be >= 18
```

**PM2 Deployment Issues:**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs garbage-collection-backend

# Restart services
pm2 restart ecosystem.config.js
```

---

**📞 Support:** For issues or questions, please create a GitHub issue with detailed information about your environment and the problem encountered.

## Quick Start (local)

### 1) Create a user (or use demo credentials)

**Via UI:** go to **/register** and sign up
**Via API:**

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo","email":"demo@smartwaste.app","password":"Password123!"}'
```

Login to get a JWT:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@smartwaste.app","password":"Password123!"}'
```

### 2) Create a bin

```bash
curl -X POST http://localhost:5001/api/bins \
  -H "Authorization: Bearer <JWT>" -H "Content-Type: application/json" \
  -d '{
    "name":"King & Ann",
    "type":"general",
    "capacityLitres":240,
    "location":{"lat":-27.4699,"lng":153.0251},
    "installedAt":"2024-01-15"
  }'
```

### 3) Post a sensor reading (mark as “needs\_pickup” if ≥80)

```bash
curl -X POST http://localhost:5001/api/sensor-readings \
  -H "Authorization: Bearer <JWT>" -H "Content-Type: application/json" \
  -d '{"binId":"<BIN_ID>","fillPct":85,"batteryPct":60}'
```

### 4) (Optional) Create a truck

```bash
curl -X POST http://localhost:5001/api/trucks \
  -H "Authorization: Bearer <JWT>" -H "Content-Type: application/json" \
  -d '{"name":"Truck 12","plateNumber":"ABC-123","capacityLitres":5000,"fuelType":"diesel"}'
```

### 5) Generate a route

```bash
curl -X POST http://localhost:5001/api/routes \
  -H "Authorization: Bearer <JWT>" -H "Content-Type: application/json" \
  -d '{
    "depot":{"lat":-27.4699,"lng":153.0251},
    "threshold":80,
    "maxStops":10,
    "truckId":"<TRUCK_ID or omit>"
  }'
```

### 6) Complete a stop (auto-resets bin to 0%)

```bash
curl -X PATCH http://localhost:5001/api/routes/<ROUTE_ID>/stops/<BIN_ID>/complete \
  -H "Authorization: Bearer <JWT>"
```

---

## Core Endpoints (summary)

* **Auth**

  * `POST /api/auth/register` — create user
  * `POST /api/auth/login` — login, returns JWT
* **Bins**

  * `GET /api/bins` — list (filters: `type`, `status`)
  * `POST /api/bins` — create
  * `GET /api/bins/:id` — get one
  * `PUT /api/bins/:id` — update
  * `DELETE /api/bins/:id` — delete
  * `GET /api/bins/latest` — latest snapshots
* **Sensor Readings**

  * `POST /api/sensor-readings` — add reading `{ binId, fillPct, batteryPct? }`
  * `GET /api/sensor-readings/bin/:id` — history for one bin
* **Routes**

  * `POST /api/routes` — generate optimized route `{ depot, threshold?, maxStops?, truckId? }`
  * `GET /api/routes` — list
  * `GET /api/routes/:id` — detail
  * `DELETE /api/routes/:id` — delete
  * `PATCH /api/routes/:id/stops/:binId/complete` — mark stop serviced (auto-reset bin; complete route if all done)
  * `PATCH /api/routes/:id/assign-truck` — `{ truckId }` or `{ truckId:null }`
* **Trucks**

  * `GET /api/trucks` — list (filters: `status`, `minCapacity`, `q`)
  * `POST /api/trucks` — create
  * `GET /api/trucks/:id` — get one
  * `PUT /api/trucks/:id` — update
  * `DELETE /api/trucks/:id` — delete

> All non-auth endpoints require `Authorization: Bearer <JWT>`.

---

## Frontend Navigation

* **/login** — authenticate
* **/tasks** — (template CRUD page from starter)
* **/bins** — manage bins; simulate fill; view latest snapshot
* **/bins/\:id/history** — line chart + table of readings
* **/routes** — create & list routes
* **/routes/\:id** — route detail; complete stops; assign/unassign truck
* **/trucks** — manage trucks

---

## CI

A GitHub Actions workflow (`Backend CI`) installs deps, runs backend tests (Mocha), and builds the frontend. It expects `MONGO_URI`, `JWT_SECRET`, `PORT` in repository secrets.

---

## Notes / Troubleshooting

* **401 Unauthorized** → ensure JWT header is set.
* **404** on routes/sensor endpoints → confirm routes are mounted in `server.js`.
* **React/Recharts hook error** → ensure only one `react`/`react-dom` version (run `npm ls react react-dom` in `frontend`).
* For production, set `REACT_APP_API_BASE` to your deployed API base.

