const droneService = require('../services/drone.service');

async function getAll(_req, res) {
  const drones = await droneService.getAllDrones();
  res.status(200).json(drones);
}

async function getById(req, res) {
  const drone = await droneService.getDroneById(req.params.id);
  res.status(200).json(drone);
}

async function create(req, res) {
  const drone = await droneService.createDrone(req.body);
  res.status(201).json(drone);
}

async function update(req, res) {
  const drone = await droneService.updateDrone(req.params.id, req.body);
  res.status(200).json(drone);
}

async function remove(req, res) {
  await droneService.deleteDrone(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
