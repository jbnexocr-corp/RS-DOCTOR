import { ConflictError } from './content';
import { hasDatabase } from './db';
import { OriginError, ValidationError } from './validation';

/** Respuesta JSON coherente para el panel; los errores internos no exponen detalles de la base de datos. */
export function errorResponse(error: unknown, fallback: string) {
  if (error instanceof OriginError) return Response.json({ error: error.message }, { status: 403 });
  if (error instanceof ValidationError) return Response.json({ error: error.message }, { status: 400 });
  if (error instanceof ConflictError) return Response.json({ error: error.message }, { status: 409 });
  if (error instanceof SyntaxError) return Response.json({ error: 'La solicitud no contiene JSON válido.' }, { status: 400 });
  console.error(`[admin] ${fallback}:`, error);
  return Response.json({ error: fallback }, { status: 500 });
}

export function databaseUnavailable() {
  return hasDatabase() ? undefined : Response.json({ error: 'La base de datos no está configurada.' }, { status: 503 });
}
