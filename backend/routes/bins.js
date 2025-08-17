const router = require('express').Router();
const { protect } = require('../middleware/authmiddleware');
const {
  getBins, addBin, getBin, updateBin, deleteBin, getBinsLatest
} = require('../controllers/binsController');

router.use(protect);                // ⬅️ use your real auth

router.get('/', getBins);
router.get('/latest', getBinsLatest);
router.get('/:id', getBin);
router.post('/', addBin);
router.put('/:id', updateBin);
router.delete('/:id', deleteBin);

module.exports = router;
