# Modelo de datos

Las migraciones idempotentes viven en `scripts/migrate.mjs` y se ejecutan al iniciar el servicio.

## Tablas

- `content_records`: contenido editorial y artículos bilingües.
- `site_settings`: configuración serializada como JSON.
- `audit_log`: actividad editorial reciente.
- `media_assets`: metadatos de archivos almacenados en Railway Bucket.

PostgreSQL es adecuado para artículos, slugs, estados, autores, revisiones y referencias. No es la ubicación recomendada para almacenar imágenes binarias: aumenta el tamaño de la base, complica copias y entrega de medios. Por eso el proyecto usa object storage y conserva en PostgreSQL solo la referencia al objeto.

## Supabase

Supabase también sería técnicamente válido porque incluye PostgreSQL, Auth y Storage. En esta implementación no se recomienda mezclar Railway y Supabase: Railway ya proporciona cómputo, PostgreSQL y Buckets S3 dentro del mismo proyecto. Mantener un solo proveedor reduce variables, facturación y puntos de fallo.

Si más adelante se requiere autenticación avanzada con múltiples usuarios, RLS o transformación de imágenes mediante CDN, se puede evaluar una migración completa a Supabase; no conviene usar ambos sin una necesidad concreta.
