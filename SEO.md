# Estrategia SEO AEO y LLMO

## Principios

La entidad central es el Dr. Ronald Salazar. La Home establece quién es, qué áreas ofrece y cómo se solicitará atención sin convertir el contenido en una acumulación de palabras clave. Ninguna credencial, ubicación, horario, precio o resultado se publica sin validación.

## Implementación inicial

- títulos y descripciones localizados;
- rutas físicas `/es/` y `/en/`;
- canonical, `hreflang` y `x-default` únicamente cuando `PUBLIC_SITE_URL` esté configurado;
- Open Graph y Twitter metadata;
- JSON-LD conservador para `Person` y `WebSite`;
- 404 real en compilación estática;
- `robots.txt` y `llms.txt` sin información privada;
- soporte tipado para redirecciones permanentes.

## AEO y motores generativos

Las páginas interiores deberán responder una intención concreta, usar encabezados descriptivos, lenguaje comprensible, autor o revisor, fechas de revisión y referencias. FAQ se añadirá solo con preguntas reales y respuestas aprobadas; no se usará `FAQPage` hasta verificar elegibilidad y correspondencia visible.

## Migración

No se definirán redirecciones hasta recibir URL y exportes del sitio anterior, sitemap y Search Console. La matriz mínima será: URL anterior, estado, acción, URL nueva, código y observaciones. Nunca se redirigirá todo al inicio.

## Antes de publicar

Configurar dominio, imagen OG autorizada, sitemap absoluto, Search Console, datos locales consistentes y schema médico adecuado a datos visibles confirmados.
