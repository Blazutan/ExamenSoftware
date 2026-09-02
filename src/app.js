const express = require('express');
const droneRoutes = require('./routes/drone.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/drones', droneRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
