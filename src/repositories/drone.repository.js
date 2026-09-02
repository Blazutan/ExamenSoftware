const prisma = require('../config/prisma');

function findAll() {
  return prisma.drone.findMany({ orderBy: { serial: 'asc' } });
}

function findById(id) {
  return prisma.drone.findUnique({ where: { id } });
}

function create(data) {
  return prisma.drone.create({ data });
}

function update(id, data) {
  return prisma.drone.update({ where: { id }, data });
}

function remove(id) {
  return prisma.drone.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
