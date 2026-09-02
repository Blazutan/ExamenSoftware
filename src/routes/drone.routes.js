const express = require('express');
const droneController = require('../controllers/drone.controller');
const validate = require('../middlewares/validation.middleware');
const { droneSchema } = require('../validators/drone.validator');

const router = express.Router();

router.get('/', droneController.getAll);
router.get('/:id', droneController.getById);
router.post('/', validate(droneSchema), droneController.create);
router.put('/:id', validate(droneSchema), droneController.update);
router.delete('/:id', droneController.remove);

module.exports = router;
