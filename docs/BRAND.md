# Marca aplicada en el sitio

Fuente: `Dr_Ronald_Salazar_brandbook_actualizado.pdf` (octubre 2026).

## Logotipo

- `src/assets/brand/logo.svg` y `logo-light.svg`: firma + "Ginecología Integral" en gris #4d4d4d o blanco.
- `logo-firma.svg` y `logo-firma-light.svg`: variante de solo firma (brandbook 4.1), usada en pantallas de menos de 30rem.
- Extraídos como trazos vectoriales del brandbook, sin el marco residual de "Gestar".
- Fondos permitidos: blanco, negro, gris #4d4d4d, gris claro #e8e8e8 y amarillo. No se cambia el grosor ni se usa el logo en amarillo o con degradados.
- Área de reserva: espacio libre equivalente al alto de la "G" de "Ginecología".

## Color

| Uso | Color | Referencia |
|---|---|---|
| Primario | #e9c749 | Pantone 129 C |
| Primario | #4d4d4d | Pantone 7540 C |
| Complementario | #000000 | Pantone Black 2 2X |
| Complementario | #e8e8e8 | Cool Gray 1 C |

El amarillo no alcanza contraste como texto sobre blanco (1,6:1). Se usa como fondo de botones con texto negro, como acento (cuadro de las etiquetas, líneas) y como texto solo sobre gris oscuro o negro. Los textos usan #4d4d4d, #5e5e5e y negro.

## Tipografía

- Brandbook: Seravek (Bold en encabezados, Light/ExtraLight en cuerpos de texto).
- Sitio: `Seravek` primero; viene instalada en iPhone, iPad y Mac, sin descarga.
- Resto de equipos: Encode Sans variable al 87,5 % de ancho (`@fontsource-variable/encode-sans`), servida desde el propio sitio. Se eligió comparándola directamente con la muestra del brandbook.
- Pesos: 700 en títulos, 600 en subtítulos, 400 en texto y 300 en textos destacados.

## Favicon e imagen para redes

- `public/favicon.svg` y `public/apple-touch-icon.png`: monograma "RS" en gris, blanco y amarillo de marca. El brandbook no define favicon; requiere aprobación.
- `public/og/dr-ronald-salazar.jpg` (1200 × 630): logo oficial y fotografía del doctor, usada por defecto al compartir enlaces.
