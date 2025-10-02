
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');


dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/sensor-readings', require('./routes/sensorRoutes'));
app.use('/api/routes', require('./routes/routePlanRoutes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in env');
  process.exit(1);
}


module.exports = app
