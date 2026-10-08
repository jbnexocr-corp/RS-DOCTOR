# Despliegue

## Ambientes

- desarrollo local;
- staging protegido con autenticación y `noindex`;
- producción con dominio canónico confirmado.

## Variables

Copiar `.env.example` y completar valores reales. No usar valores ficticios. `PUBLIC_SITE_URL` bloquea canonical y hreflang absolutos hasta que exista dominio confirmado.

## Cabeceras de producción

Configurar en el proveedor: Content Security Policy, `X-Content-Type-Options: nosniff`, Referrer Policy estricta, Permissions Policy mínima y HSTS únicamente sobre HTTPS estable. Unificar HTTPS y host preferido en un salto.

## Build

```bash
npm ci
npm run build
```

Publicar `dist/`. La integración futura de Sanity debe reconstruir mediante webhook firmado. Staging no debe ser indexable ni accesible públicamente.
