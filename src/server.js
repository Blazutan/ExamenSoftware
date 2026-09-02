const app = require('./app');
const prisma = require('./config/prisma');
const { port } = require('./config/env');

const server = app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`\n${signal}: cerrando servidor...`);
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
