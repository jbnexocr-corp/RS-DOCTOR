# Sitio web del Dr. Ronald Salazar

Sitio médico bilingüe construido con Astro SSR. Incluye la página pública, artículos dinámicos, panel editorial, PostgreSQL y almacenamiento privado de imágenes compatible con S3. La configuración de producción está preparada para Railway.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

## Comandos

```bash
npm install
npm run dev
npm run build
npm start
npm run db:migrate
npm run preview
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

Copiar `.env.example` a `.env` para desarrollo. En Railway se deben inyectar `DATABASE_URL`, las credenciales del Bucket, `ADMIN_USERNAME` y `ADMIN_PASSWORD`. La URL pública debe configurarse en `PUBLIC_SITE_URL` antes de producción.

## Estado actual

- Home completa en `/es/` y `/en/`.
- Perfil profesional, servicios, seis pilares, recursos, artículos, contacto y páginas legales en ambos idiomas.
- Layout, header, navegación móvil, footer, selector de idioma, SEO, JSON-LD e imágenes responsivas.
- Diseño editorial propio, mobile-first y sin framework de componentes.
- Panel CRUD en `/admin/`, protegido en producción mediante credenciales.
- Artículos publicados desde PostgreSQL en `/es/articulos/{slug}/` y `/en/articles/{slug}/`.
- Imágenes guardadas en Railway Bucket; PostgreSQL conserva URLs y metadatos.
- Borradores interiores con `noindex` hasta recibir aprobación médica, legal y operativa.
- Canal principal de contacto por WhatsApp, sin almacenar información clínica en el CMS.

Consulta [DEPLOYMENT.md](DEPLOYMENT.md), [ADMIN.md](ADMIN.md), [docs/DATABASE.md](docs/DATABASE.md) y [docs/CONTENT-PENDING.md](docs/CONTENT-PENDING.md) antes de publicar.
