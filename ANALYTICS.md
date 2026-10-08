# Analítica y privacidad

## Eventos permitidos

- `click_whatsapp`
- `click_phone`
- `form_submit_success`
- `click_book_amazon`
- `click_prenatal_course`

`appointment_confirmed` queda excluido hasta que una agenda real confirme fecha y cupo.

## Parámetros

Solo se permiten ubicación del botón, tipo de componente y destino técnico. Nunca se enviarán nombre, teléfono, email, mensaje, diagnóstico, síntomas, contenido del formulario ni términos que revelen una condición de salud.

La abstracción inicial está en `src/lib/analytics.ts`. GA4 permanece desactivado hasta recibir ID, consentimiento y aprobación de privacidad. No se instalarán herramientas de grabación de sesiones sobre formularios o recorridos sensibles.
