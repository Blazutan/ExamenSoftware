const droneRepository = require('../repositories/drone.repository');

async function getAllDrones() {
  return droneRepository.findAll();
}

async function getDroneById(id) {
  const drone = await droneRepository.findById(id);

  if (!drone) {
    const error = new Error('Drone no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return drone;
}

function createDrone(data) {
  return droneRepository.create(data);
}

async function updateDrone(id, data) {
  await getDroneById(id);
  return droneRepository.update(id, data);
}

async function deleteDrone(id) {
  await getDroneById(id);
  await droneRepository.remove(id);
}

module.exports = {
  getAllDrones,
  getDroneById,
  createDrone,
  updateDrone,
  deleteDrone,
};
