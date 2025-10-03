const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTrucks,
  getTruck,
  addTruck,
  updateTruck,
  deleteTruck,
  getTrucksFiltered
} = require('../controllers/trucksController');

router.use(protect);

router.get('/filter', getTrucksFiltered);
router.get('/', getTrucks);
router.get('/:id', getTruck);
router.post('/', addTruck);
router.put('/:id', updateTruck);
router.delete('/:id', deleteTruck);

module.exports = router;