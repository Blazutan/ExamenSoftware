const { z } = require('zod');

const droneSchema = z.object({
  serial: z.string().trim().min(1, 'serial es obligatorio'),
  modelo: z.string().trim().min(1, 'modelo es obligatorio'),
  fabricante: z.string().trim().min(1, 'fabricante es obligatorio'),
  peso: z.number().positive('peso debe ser mayor que cero'),
}).strict();

module.exports = { droneSchema };
