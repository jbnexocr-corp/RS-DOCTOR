# Modelo de contenido

## Estrategia Sanity

Se recomiendan documentos separados por idioma, relacionados con `translationOf` y `alternateLanguageEntries`. Esto prioriza SEO, revisión médica, traducción controlada y publicación independiente. Los schemas limitarán la estructura: el CMS administra contenido, no layout arbitrario.

## Tipos principales

- `doctor`: nombre, biografía, formación, credenciales, asociaciones, foto y revisión.
- `professional`: nombre, rol, formación, alcance, modalidad y fotografía.
- `servicePillar`: título, resumen, orden, servicios relacionados y SEO.
- `service`: explicación, indicaciones, proceso, alternativas, riesgos, seguimiento, profesional y FAQs.
- `article`: campos editoriales completos y relaciones con servicios.
- `resource`: libro o curso con datos comerciales confirmados.
- `location`: tipo de sede, dirección, mapa, horarios, estacionamiento y contacto.
- `siteSettings`: navegación, contacto, identidad, SEO global y avisos.
- `legalPage`: texto aprobado, versión y fecha efectiva.

## Campos comunes

Cada documento publicable tendrá `language`, `slug`, `status`, `translationOf`, `seoTitle`, `seoDescription`, `canonical`, `robots`, `openGraphTitle`, `openGraphDescription`, `openGraphImage`, `schemaType`, `dateModified`, `reviewer`, `reviewedAt` y `medicalApprovalStatus`.

## Artículos

Los artículos soportarán `title`, `slug`, `excerpt`, `author`, `reviewer`, `publishedAt`, `updatedAt`, `reviewedAt`, `category`, `tags`, `references`, `featuredImage`, `featuredImageAlt`, `seoTitle`, `seoDescription`, `canonical`, `language` y `relatedServices`.
