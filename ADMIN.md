# Panel administrativo

El panel está disponible en `/admin/`. En producción usa PostgreSQL y Railway Bucket; sin `DATABASE_URL`, conserva un modo local de desarrollo mediante `localStorage`.

## Funciones

- CRUD de páginas, servicios, artículos, equipo, ubicaciones, recursos y medios;
- estados `draft`, `pending-medical-review`, `approved`, `published` y `archived`;
- contenido bilingüe;
- cuerpo del artículo, autor, revisor médico, fecha de revisión y fuentes;
- carga de JPEG, PNG, WebP y AVIF de hasta 8 MB en Railway Bucket;
- filtros, búsqueda, duplicación, archivo y eliminación;
- configuración, auditoría y exportación/importación JSON;
- persistencia compartida entre computadoras cuando PostgreSQL está conectado.

## Acceso

El middleware protege `/admin/` y `/api/admin/` con `ADMIN_USERNAME` y `ADMIN_PASSWORD`. En producción, si falta la contraseña, el panel responde `503` en vez de quedar expuesto.

## API

- `GET/PUT /api/admin/state`: respaldo o restauración completa y configuración.
- `GET/POST /api/admin/content`: listar y crear contenido.
- `GET/PATCH/DELETE /api/admin/content/{id}`: CRUD individual.
- `POST /api/admin/media`: carga autenticada de imágenes.
- `GET /api/media/{key}`: entrega pública y cacheada del archivo privado.
- `GET /api/health/`: estado del servidor, PostgreSQL y Bucket.

El panel no debe utilizarse para información de pacientes, solicitudes, expedientes ni datos clínicos sensibles.
