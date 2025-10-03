# API Testing Collections

This directory contains exported API collections for testing the Garbage Collection Manager API endpoints.

## 📁 Files Included

- **`Garbage-Collection-Manager-API.postman_collection.json`** - Complete Postman collection with all API endpoints
- **`Garbage-Collection-Manager.postman_environment.json`** - Environment variables for local and production testing

## 🚀 Quick Start

### **1. Import to Postman**

1. **Open Postman**
2. **Import Collection**: Click "Import" → Select `Garbage-Collection-Manager-API.postman_collection.json`
3. **Import Environment**: Click "Import" → Select `Garbage-Collection-Manager.postman_environment.json`
4. **Set Environment**: Select "Garbage Collection Manager Environment" from environment dropdown

### **2. Authentication Flow**

1. **Register User** (optional - create new account)
2. **Login User** - This automatically sets the `jwt_token` variable
3. **All other requests** will use the JWT token automatically

### **3. Testing Workflow**

```
🔐 Authentication → 🗂️ Bin Management → 📊 Sensor Data → 🚛 Route Planning → 🚚 Fleet Management
```

## 📊 Collection Structure

### **🔐 Authentication (4 requests)**
- Register User
- Login User (sets JWT token automatically)
- Get User Profile
- Update User Profile

### **🗂️ Bin Management (6 requests)**
- Get All Bins
- Get Bins with Filters
- Create New Bin (sets bin_id automatically)
- Get Bin by ID
- Update Bin
- Delete Bin

### **📊 IoT Sensor Readings (2 requests)**
- Submit Sensor Reading
- Get Bin Sensor History

### **🚛 Route Planning (4 requests)**
- Create Route Plan (sets route_id automatically)
- Get All Routes
- Get Route Details
- Complete Route

### **🚚 Fleet Management (3 requests)**
- Get All Trucks
- Create New Truck (sets truck_id automatically)
- Update Truck

### **🔧 System Health (1 request)**
- Health Check (no authentication required)

## 🔧 Environment Variables

The collection uses these variables that are automatically managed:

| Variable | Description | Auto-populated |
|----------|-------------|----------------|
| `base_url` | API base URL | Manual |
| `jwt_token` | Authentication token | ✅ After login |
| `user_id` | Current user ID | ✅ After login |
| `bin_id` | Sample bin ID | ✅ After creating bin |
| `route_id` | Sample route ID | ✅ After creating route |
| `truck_id` | Sample truck ID | ✅ After creating truck |

## 🌐 Environment Setup

### **Local Development**
Set `base_url` to: `http://localhost:5001/api`

### **Production Testing**
Set `base_url` to: `http://3.107.185.222/api`

## 📝 Sample Data

### **Demo Login Credentials**
```json
{
  "email": "stealth959@hotmail.co",
  "password": "1234"
}
```

### **Sample Bin Data (GeoJSON)**
```json
{
  "name": "Times Square Bin",
  "type": "general",
  "capacityLitres": 120,
  "location": {
    "type": "Point",
    "coordinates": [-73.985130, 40.758896]
  },
  "address": "Times Square, New York, NY 10036"
}
```

### **Sample Sensor Reading**
```json
{
  "binId": "{{bin_id}}",
  "fillPct": 85,
  "batteryPct": 92
}
```

### **Sample Route Plan**
```json
{
  "name": "Morning Collection Route",
  "depot": {
    "type": "Point",
    "coordinates": [-73.994033, 40.746899]
  },
  "threshold": 75,
  "maxStops": 10,
  "scheduledDate": "2025-10-04T08:00:00Z"
}
```

## 🧪 Testing Features

### **Automated Variable Management**
- JWT tokens are automatically extracted and stored after login
- Resource IDs (bin, route, truck) are automatically captured after creation
- No manual copying of IDs required

### **Request Organization**
- Logical grouping by feature area
- Sequential workflow support
- Pre-request scripts for setup
- Post-request scripts for variable extraction

### **Error Handling**
- Proper HTTP status code validation
- Error response format validation
- Authentication failure handling

## 🔗 Alternative Testing Tools

### **cURL Examples**

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"stealth959@hotmail.co","password":"1234"}'
```

**Create Bin:**
```bash
curl -X POST http://localhost:5001/api/bins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Test Bin","type":"general","capacityLitres":120,"location":{"type":"Point","coordinates":[-73.985130,40.758896]}}'
```

### **Insomnia/Thunder Client**
The JSON collection can also be imported into other API testing tools like Insomnia or VS Code Thunder Client extensions.

## 📚 API Documentation

For detailed API documentation with schemas and examples, visit:
- **Local:** http://localhost:5001/api-docs
- **Production:** http://3.107.185.222/api-docs

## 🆘 Troubleshooting

### **Common Issues**

**401 Unauthorized:**
- Ensure you've run the "Login User" request first
- Check that JWT token is set in environment variables

**404 Not Found:**
- Verify the server is running on the correct port
- Check the base_url environment variable

**Invalid GeoJSON:**
- Coordinates must be in [longitude, latitude] format
- Longitude first, then latitude (opposite of lat/lng)