# Panel administrativo

El panel está disponible en `/admin/` y funciona sin hosting ni base de datos. Guarda el contenido únicamente en `localStorage` del navegador actual y permite crear, leer, actualizar, duplicar, filtrar, archivar y eliminar registros de páginas, servicios, artículos, equipo, ubicaciones y recursos.

## Funciones actuales

- estados `draft`, `pending-medical-review`, `approved`, `published` y `archived`;
- filtros por colección y estado;
- biblioteca local de medios con texto alternativo, vista previa y respaldo;
- búsqueda por título y slug;
- configuración de dominio, contacto, analítica y aprobaciones;
- indicador de preparación para publicación;
- registro de actividad;
- exportación e importación JSON;
- datos separados por idioma;
- `noindex`, `nofollow` y `noarchive` en la ruta administrativa.

## Límite del modo local

Este modo no sincroniza cambios con las páginas públicas ni comparte información entre computadoras. No debe almacenar información de pacientes, solicitudes, expedientes ni datos clínicos. El navegador no constituye una base de datos ni una autenticación segura.

## Conexión futura

`src/lib/admin/repository.ts` define el contrato `ContentRepository`. Cuando se elijan hosting y base de datos, se implementará un repositorio HTTP autenticado conservando las mismas operaciones CRUD. La integración de producción deberá añadir:

1. autenticación real y recuperación de acceso;
2. roles para administración, edición, revisión médica y publicación;
3. API con validación del servidor;
4. base de datos y almacenamiento de imágenes;
5. historial inmutable, copias y restauración;
6. protección CSRF, rate limiting y registros seguros;
7. publicación mediante webhook/build o contenido dinámico;
8. separación de staging y producción.

El panel local sirve como interfaz funcional y especificación del futuro backend; no pretende simular seguridad inexistente.
