const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const verifyToken = require('../middleware/auth');

router.post('/:username/:authToken', verifyToken, carController.addCar);
router.post('/:username/:token', carController.addCar);
router.get('/:username/:token', carController.getCars);
router.put('/:username/:token/:id', carController.updateCar);
router.delete('/:username/:token/:id', carController.deleteCar);

module.exports = router;
