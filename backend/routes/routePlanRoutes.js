const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createRoutePlan, listRoutePlans, getRoutePlan, updateRoutePlan, deleteRoutePlan } = require('../controllers/routePlanController');

router.use(protect);
router.post('/', createRoutePlan);
router.get('/', listRoutePlans);
router.get('/:id', getRoutePlan);
router.put('/:id', updateRoutePlan);
router.delete('/:id', deleteRoutePlan);

module.exports = router;
