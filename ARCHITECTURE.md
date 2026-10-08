# Arquitectura del sitio

## Decisión principal

Astro es apropiado porque el contenido médico se beneficia de HTML generado en build, JavaScript mínimo, optimización nativa de imágenes y páginas físicas por idioma. La arquitectura evita una SPA y permite añadir SSR solo al endpoint del formulario cuando exista infraestructura de recepción y protección de datos aprobada.

## Estructura

```text
src/
  assets/images/       Fotografías originales renombradas
  components/
    content/           Composición editorial de páginas
    footer/            Pie global
    media/             Imágenes responsivas
    navigation/        Header y selector de idioma
    seo/               Metadata y datos estructurados
  data/                Contenido tipado provisional
  layouts/             Documento HTML global
  lib/                 i18n, sitio, analytics y redirects
  pages/es/            Rutas físicas en español
  pages/en/            Rutas físicas en inglés
  styles/              Sistema visual global
docs/                  Decisiones, QA y pendientes
```

## Idiomas

Se usan documentos separados por idioma y una relación explícita de alternas. Esta decisión facilita revisión médica independiente, slugs naturales, metadata localizada, historial editorial y `hreflang`. El idioma no se traduce en el cliente.

## Renderizado

- Páginas informativas: generación estática.
- Contenido de Sanity: consultado durante build, con webhooks de reconstrucción en producción.
- Formulario futuro: endpoint de servidor aislado, validación compartida, honeypot y rate limiting.

## Imágenes

Los originales viven en `src/assets/images`. `ResponsiveImage.astro` genera AVIF y WebP con fallback JPEG, `srcset`, tamaños declarados y carga diferida. La imagen hero usa prioridad alta; las demás son lazy.
