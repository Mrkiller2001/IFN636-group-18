// Sample data seeder with real NYC addresses
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Sample bins with real NYC addresses
const sampleBins = [
  {
    name: "Times Square Bin",
    location: {
      type: 'Point',
      coordinates: [-73.985130, 40.758896] // [lng, lat]
    },
    address: "Times Square, New York, NY 10036",
    capacityLitres: 100,
    status: "normal",
    type: "general",
    latestFillPct: 50
  },
  {
    name: "Central Park Bin",
    location: {
      type: 'Point',
      coordinates: [-73.965355, 40.782865] // [lng, lat]
    },
    address: "Central Park South, New York, NY 10019",
    capacityLitres: 150,
    status: "needs_pickup",
    type: "recycle",
    latestFillPct: 75
  },
  {
    name: "Brooklyn Bridge Bin",
    location: {
      type: 'Point',
      coordinates: [-73.996315, 40.706086] // [lng, lat]
    },
    address: "Brooklyn Bridge, New York, NY 11201",
    capacityLitres: 80,
    status: "needs_pickup",
    type: "general",
    latestFillPct: 100
  },
  {
    name: "Battery Park Bin",
    location: {
      type: 'Point',
      coordinates: [-74.044502, 40.689247] // [lng, lat]
    },
    address: "Battery Park, New York, NY 10004",
    capacityLitres: 120,
    status: "normal",
    type: "organic",
    latestFillPct: 25
  },
  {
    name: "Empire State Bin",
    location: {
      type: 'Point',
      coordinates: [-73.985664, 40.748817] // [lng, lat]
    },
    address: "Empire State Building, New York, NY 10118",
    capacityLitres: 90,
    status: "normal",
    type: "general",
    latestFillPct: 0
  },
  {
    name: "World Trade Center Bin",
    location: {
      type: 'Point',
      coordinates: [-74.013703, 40.712742] // [lng, lat]
    },
    address: "One World Trade Center, New York, NY 10007",
    capacityLitres: 200,
    status: "needs_pickup",
    type: "general",
    latestFillPct: 100
  },
  {
    name: "High Line Bin",
    location: {
      type: 'Point',
      coordinates: [-74.004764, 40.748058] // [lng, lat]
    },
    address: "High Line, New York, NY 10011",
    capacityLitres: 75,
    status: "normal",
    type: "recycle",
    latestFillPct: 50
  },
  {
    name: "Coney Island Bin",
    location: {
      type: 'Point',
      coordinates: [-73.977621, 40.574518] // [lng, lat]
    },
    address: "Coney Island Boardwalk, Brooklyn, NY 11224",
    capacityLitres: 110,
    status: "needs_pickup",
    type: "general",
    latestFillPct: 75
  }
];

// Sample trucks with NYC locations
const sampleTrucks = [
  {
    licensePlate: "NYC-001",
    capacity: 1500,
    status: "Available",
    fuelLevel: 85,
    driverId: "DRV001",
    currentLocation: {
      address: "Manhattan Depot, New York, NY 10001",
      coordinates: [-73.994033, 40.746899]
    },
    lastMaintenanceDate: new Date('2024-09-15')
  },
  {
    licensePlate: "NYC-002", 
    capacity: 1200,
    status: "On Route",
    fuelLevel: 65,
    driverId: "DRV002",
    currentLocation: {
      address: "Brooklyn Depot, Brooklyn, NY 11201",
      coordinates: [-73.987176, 40.693446]
    },
    lastMaintenanceDate: new Date('2024-08-20')
  },
  {
    licensePlate: "NYC-003",
    capacity: 1800,
    status: "Maintenance",
    fuelLevel: 45,
    driverId: "DRV003",
    currentLocation: {
      address: "Queens Depot, Queens, NY 11101",
      coordinates: [-73.951668, 40.750580]
    },
    lastMaintenanceDate: new Date('2024-10-01')
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // First, login to get token
    console.log('Logging in to get token...');
    let userResponse;
    try {
      userResponse = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@wastemanager.com',
        password: 'password123'
      });
    } catch (error) {
      // If login fails, try to register
      console.log('User not found, creating new user...');
      userResponse = await axios.post(`${API_URL}/auth/register`, {
        email: 'admin@wastemanager.com',
        password: 'password123',
        name: 'Admin User'
      });
    }

    const token = userResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('✅ Authentication successful');

    // Seed bins
    console.log('Seeding bins...');
    for (const bin of sampleBins) {
      try {
        await axios.post(`${API_URL}/bins`, bin, { headers });
        console.log(`✅ Created bin at ${bin.address}`);
      } catch (error) {
        console.log(`❌ Failed to create bin at ${bin.address}: ${error.message}`);
      }
    }

    // Seed trucks
    console.log('Seeding trucks...');
    for (const truck of sampleTrucks) {
      try {
        await axios.post(`${API_URL}/trucks`, truck, { headers });
        console.log(`✅ Created truck ${truck.licensePlate}`);
      } catch (error) {
        console.log(`❌ Failed to create truck ${truck.licensePlate}: ${error.message}`);
      }
    }

    // Create sample routes
    console.log('Creating sample routes...');
    try {
      // Get created bins to use in routes
      const binsResponse = await axios.get(`${API_URL}/bins`, { headers });
      const bins = binsResponse.data;

      if (bins.length >= 3) {
        const route1 = {
          name: "Manhattan Route A",
          depot: {
            type: 'Point',
            coordinates: [-73.994033, 40.746899], // Manhattan Depot
            address: "Manhattan Depot, New York, NY 10001"
          },
          threshold: 75,
          maxStops: 5,
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
        };

        const route2 = {
          name: "Brooklyn Route B",
          depot: {
            type: 'Point', 
            coordinates: [-73.987176, 40.693446], // Brooklyn Depot
            address: "Brooklyn Depot, Brooklyn, NY 11201"
          },
          threshold: 80,
          maxStops: 4,
          scheduledDate: new Date()
        };

        await axios.post(`${API_URL}/routes`, route1, { headers });
        await axios.post(`${API_URL}/routes`, route2, { headers });
        
        console.log('✅ Created sample routes');
      }
    } catch (error) {
      console.log(`❌ Failed to create routes: ${error.message}`);
    }

    console.log('🎉 Data seeding completed!');
    console.log('📧 Test user: admin@wastemanager.com');
    console.log('🔐 Password: password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the seeder
if (require.main === module) {
  seedData();
}

module.exports = { seedData, sampleBins, sampleTrucks };