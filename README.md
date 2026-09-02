# API de Drones

API REST desarrollada con Node.js, Express, Prisma y PostgreSQL para gestionar drones mediante una arquitectura por capas.

## Requisitos

- Node.js 18 o superior
- Docker y Docker Compose, o una instancia de PostgreSQL disponible

## Instalación

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npx prisma migrate dev --name init
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`. La vista A2UI se abre en `/` y el endpoint `GET /health` permite comprobar que el servidor está activo.

## Vista A2UI

El frontend está implementado en `public/` como una capa independiente, sin cambiar la arquitectura del backend. Incluye:

- Listado de drones con búsqueda por serial, modelo y fabricante.
- Resumen de unidades, fabricantes y peso medio.
- Alta y edición mediante formulario.
- Eliminación con confirmación.
- Mensajes de error y estado de conexión.

La vista consume exclusivamente la API existente en `/api/drones`.

## Arquitectura

```text
src/
├── config/          Configuración de entorno y cliente Prisma
├── controllers/     Traducción entre HTTP y casos de uso
├── middlewares/     Validación y manejo de errores
├── repositories/    Acceso a datos mediante Prisma
├── routes/          Definición de endpoints
├── services/        Reglas de negocio
└── validators/      Esquemas de entrada
```

## API de drones

| Método | Ruta | Acción |
|---|---|---|
| `POST` | `/api/drones` | Crear un drone |
| `GET` | `/api/drones` | Listar drones |
| `GET` | `/api/drones/:id` | Consultar un drone |
| `PUT` | `/api/drones/:id` | Actualizar un drone |
| `DELETE` | `/api/drones/:id` | Eliminar un drone |

Ejemplo de creación:

```bash
curl -X POST http://localhost:3000/api/drones \
	-H 'Content-Type: application/json' \
	-d '{"serial":"DRN-001","modelo":"Mavic 3","fabricante":"DJI","peso":0.895}'
```

El campo `serial` es único y `peso` debe ser mayor que cero. Los errores de validación responden con `400`, un serial duplicado con `409` y un drone inexistente con `404`.

## Comandos útiles

```bash
npm start                  # Ejecutar la API
npm run dev                # Ejecutar con recarga automática
npx prisma studio         # Abrir el explorador de datos
npx prisma migrate dev    # Crear/aplicar una migración
docker compose down       # Detener PostgreSQL
```