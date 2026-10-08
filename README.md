# Sitio web del Dr. Ronald Salazar

Implementación en Astro para una experiencia médica bilingüe, estática y de alto rendimiento. Incluye la Home, páginas interiores principales y plantillas editoriales en español e inglés. No integra datos clínicos o de contacto sin confirmar.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

La URL pública debe configurarse en `PUBLIC_SITE_URL` antes de producción. Sin ella, el componente SEO omite deliberadamente canonical y hreflang absolutos para no publicar un dominio inventado.

## Estado actual

- Home completa en `/es/` y `/en/`.
- Perfil profesional, servicios, seis pilares, recursos, artículos, contacto y páginas legales en ambos idiomas.
- Layout, header, navegación móvil, footer, selector de idioma, SEO, JSON-LD e imágenes responsivas.
- Diseño editorial propio, mobile-first y sin framework de componentes.
- Borradores interiores con `noindex` hasta recibir aprobación médica, legal y operativa.
- Formulario accesible preparado visualmente, con envío bloqueado hasta contar con backend y privacidad aprobada.
- Sanity documentado, pero no conectado hasta recibir proyecto, dataset y responsables editoriales.

Consulta [docs/CONTENT-PENDING.md](docs/CONTENT-PENDING.md) antes de cualquier publicación.
