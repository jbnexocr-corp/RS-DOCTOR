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

El middleware protege `/admin/` y `/api/admin/` mediante un formulario propio. La contraseña se verifica contra `ADMIN_PASSWORD_HASH` usando scrypt y nunca se guarda en texto plano. La sesión utiliza una cookie firmada, `HttpOnly`, `SameSite=Strict`, segura sobre HTTPS y con duración máxima de ocho horas.

Variables requeridas: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` y `ADMIN_SESSION_SECRET`. Para rotar la contraseña, ejecutar `npm run admin:hash-password` y reemplazar únicamente el hash en Railway. El login limita los intentos fallidos y el panel incluye cierre de sesión.

## Cómo guarda el panel

Cada acción (crear, editar, duplicar, eliminar, configuración) envía solo ese cambio y después recarga el estado del servidor. Si el guardado falla, la pantalla no cambia y el editor queda abierto con el mensaje del error. Si al abrir el panel no se puede leer PostgreSQL, el panel queda bloqueado para cambios hasta recargar, de modo que un fallo temporal nunca sobrescribe la base. El registro de actividad lo escribe el servidor y conserva los últimos 500 eventos.

## API

Todas las rutas terminan en `/` (el sitio usa `trailingSlash: always`; sin la barra final, un POST redirigido se convertiría en GET).

- `GET /api/admin/state/`: contenido, configuración y registro de actividad.
- `PUT /api/admin/state/`: reemplazo completo, solo para `{ mode: "import" }` (restaurar respaldo) o `{ mode: "reset" }` (contenido inicial).
- `POST /api/admin/seed/`: importa el contenido inicial una sola vez.
- `GET/POST /api/admin/content/`: listar y crear contenido.
- `GET/PATCH/DELETE /api/admin/content/{id}/`: CRUD individual. `PATCH` acepta `baseUpdatedAt` y responde 409 si otra sesión cambió el registro.
- `PUT /api/admin/settings/`: configuración de referencia.
- `POST /api/admin/media/`: carga autenticada de imágenes. `DELETE /api/admin/media/?key=` descarta una carga que no llegó a guardarse.
- `GET /api/media/{key}`: entrega pública y cacheada del archivo privado.
- `GET /api/health/`: estado del servidor, PostgreSQL y Bucket.

El panel no debe utilizarse para información de pacientes, solicitudes, expedientes ni datos clínicos sensibles.
