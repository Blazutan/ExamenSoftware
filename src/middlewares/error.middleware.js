function notFound(_req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

function errorHandler(error, _req, res, _next) {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'El serial ya existe' });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Drone no encontrado' });
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Error interno del servidor' : error.message;
  return res.status(statusCode).json({ error: message });
}

module.exports = { notFound, errorHandler };
