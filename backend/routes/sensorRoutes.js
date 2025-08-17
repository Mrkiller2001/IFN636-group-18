const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { addSensorReading, getReadingsForBin, deleteReading } = require('../controllers/sensorController');

router.use(protect);

router.post('/', addSensorReading);                 // ingest
router.get('/bin/:binId', getReadingsForBin);       // history for a bin
router.delete('/:id', deleteReading);               // delete single reading

module.exports = router;
