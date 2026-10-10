# Despliegue en Railway

El proyecto está preparado para ejecutarse como una aplicación Astro SSR en Node.js, con PostgreSQL para contenido editorial y un Railway Bucket para imágenes. El `Dockerfile` instala, compila y ejecuta el servidor; `railway.json` configura el healthcheck en `/api/health/`.

## Arquitectura recomendada

- Servicio web: repositorio `jbnexocr-corp/RS-DOCTOR`, rama `main`.
- PostgreSQL: artículos, páginas, estados, configuraciones y registro editorial.
- Railway Bucket: imágenes y otros archivos. Los archivos no se guardan como binarios en PostgreSQL.
- Panel protegido: `/admin/` con login, contraseña scrypt y sesión firmada sobre HTTPS.

Los tres recursos deben crearse dentro del mismo proyecto y la misma región de Railway.

## Configuración paso a paso

1. En Railway, crear un proyecto y añadir un servicio desde el repositorio de GitHub `jbnexocr-corp/RS-DOCTOR`.
2. Añadir PostgreSQL desde `+ New` y usar la inyección automática para agregar `DATABASE_URL` al servicio web.
3. Añadir un Bucket llamado, por ejemplo, `media`, y auto-inyectar al servicio web las variables `BUCKET`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `ENDPOINT` y `REGION`.
4. Configurar en el servicio web:
   - `ADMIN_USERNAME=` el usuario administrativo entregado;
   - `ADMIN_PASSWORD_HASH=` el hash scrypt entregado, nunca la contraseña en texto plano;
   - `ADMIN_SESSION_SECRET=` una cadena aleatoria de al menos 32 bytes;
   - `PUBLIC_SITE_URL=https://dominio-final.com` cuando exista el dominio;
   - `PUBLIC_GA4_ID=` solo cuando se confirme Analytics.
5. Generar un dominio de Railway o conectar el dominio definitivo.
6. En **Networking**, mantener el dominio dirigido al puerto `8080`. El contenedor escucha en `0.0.0.0:8080` de forma predeterminada y respeta cualquier `PORT` que Railway inyecte.
7. Desplegar. Al arrancar, `npm start` ejecuta `npm run db:migrate` antes de iniciar el servidor.
8. Abrir `/api/health/`; debe mostrar `database: connected` y `objectStorage: configured`.
9. Abrir `/admin/`. En el primer acceso, el panel importa el contenido inicial a PostgreSQL.

## Publicación de artículos

Un artículo se muestra públicamente solo cuando:

- pertenece a la colección `articles`;
- tiene estado `published`;
- contiene título, slug y resumen;
- idealmente incluye cuerpo, autor, revisor médico, fecha de revisión y fuentes.

Las rutas públicas se generan dinámicamente en `/es/articulos/{slug}/` y `/en/articles/{slug}/`. El sitemap también incorpora artículos publicados.

## Imágenes

Las imágenes de hasta 8 MB se cargan desde el editor y se guardan en Railway Bucket. PostgreSQL conserva únicamente la URL, clave, texto alternativo y metadatos. Como los Buckets de Railway son privados, el sitio sirve cada archivo mediante `/api/media/{key}` con caché de larga duración.

## Seguridad y respaldos

- No guardar datos de pacientes ni expedientes clínicos en este CMS.
- Usar siempre HTTPS y una contraseña administrativa única. Para cambiarla, ejecutar `npm run admin:hash-password` y actualizar `ADMIN_PASSWORD_HASH`.
- Activar respaldos de PostgreSQL en Railway.
- Exportar periódicamente el JSON desde el panel.
- Railway Buckets no ofrecen versionado de objetos actualmente; mantener una copia externa de los medios importantes.

## Uso eficiente de recursos

La configuración predeterminada está pensada para una instancia pequeña de Railway:

- PostgreSQL usa un pool máximo de 4 conexiones, cierre rápido de conexiones inactivas y consultas limitadas a 8 segundos.
- Los artículos publicados se conservan 60 segundos en memoria y pueden servirse desde una copia reciente durante una interrupción breve de PostgreSQL.
- Solicitudes simultáneas de rutas dinámicas se limitan a 48; al superar el límite se responde `503` con `Retry-After` en vez de acumular solicitudes indefinidamente.
- El healthcheck reutiliza su resultado durante 10 segundos para no consultar PostgreSQL en cada sondeo.
- Las imágenes subidas se rotan, redimensionan a un máximo de 1920 px y convierten a WebP antes de guardarse.
- Los archivos del Bucket se transmiten por streaming y se sirven con caché inmutable, evitando cargar el archivo completo en memoria.
- Los recursos compilados tienen caché anual; el video y las páginas públicas utilizan caché con revalidación.

Los valores opcionales `DATABASE_POOL_SIZE=4` y `MAX_CONCURRENT_REQUESTS=48` pueden ajustarse más adelante si se aumenta el tamaño o número de réplicas. No deben aumentarse sin observar primero CPU, memoria, conexiones y latencia en Railway Metrics.

Documentación oficial: [PostgreSQL](https://docs.railway.com/databases/postgresql), [Storage Buckets](https://docs.railway.com/storage-buckets), [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/).
