# Arquitectura

## Stack y ejecución

- Aplicación estática sin dependencias externas de runtime.
- Entrada principal: `index.html`
- Estilos: `css/style.css`
- Lógica: `js/game.js`

## Estructura del repositorio

- `index.html`: shell DOM, canvas, overlays, dashboard inicial y controles táctiles.
- `css/style.css`: layout, look arcade, responsive, HUD y paneles.
- `js/game.js`: estado, reglas, render, input, audio, persistencia y meta.
- `legacy/`: versión histórica en `Python/Pygame` y recursos de referencia.
- `.github/workflows/deploy.yml`: despliegue de GitHub Pages.

## Responsabilidades principales de `game.js`

### Estado de juego

- score, vidas, nivel, timers y flags de sesión
- estado del jugador y jugadores `2P`
- enemigos, bosses, UFOs, power-ups, cargas iniciales y proyectiles
- generadores de oleadas por modo, incluida progresión infinita descendente para `waves`

### Sistemas meta

- catálogo de logros
- bestiario
- campaña y sectores
- progresión de modos sin campaña, como `survival`, `timeattack` y `waves`
- colección de skins, naves, cargas iniciales e insignias
- desafío activo

### UI y overlay

- sincronización del dashboard inicial
- paneles de objetivos, colección, bestiario, historial y estadísticas
- estados `start`, `pause` y `gameover`

### Persistencia

Se apoya en `localStorage` para guardar:

- `si_hs`
- `si_history`
- `si_stats`
- `si_meta`
- `si_settings`
- `si_music_enabled`
- `si_music_volume`

Dentro de `si_settings` ya vive también la equipación persistente de `starterLoadout`.

## Flujo principal

1. `startGame()` prepara modo, dificultad, progreso aplicable y entidades iniciales.
2. Si la run lo permite, `startGame()` aplica la carga inicial equipada sin contarla como `pickup`.
3. Las runs sin campaña omiten selector de nivel y usan reglas propias de presión, temporizador o oleadas infinitas.
4. Los encuentros de campaña pueden encadenar varios bosses dentro del mismo nivel.
5. `loop()` coordina `update()` y `draw()` con `requestAnimationFrame`.
6. `update()` resuelve input, movimiento, colisiones, progresión, meta y cambios de estado.
7. `draw()` renderiza el estado completo sobre el `canvas`.
8. `setOverlayMode()` recompone la UI contextual para inicio, pausa o cierre.

## Render e input

### Render

- Todo el gameplay se dibuja en el `canvas`.
- La UI de producto vive en DOM.
- La colección usa previews dibujadas o bloques de UI según el tipo de recompensa.

### Input

- Teclado para escritorio y `2P`.
- Botones táctiles para móvil.
- Los modos `2P` se deshabilitan en táctil para no prometer un input que la UI no soporta bien.
- Desde pausa, `classic` y `coop` pueden reiniciar la run limpia en el nivel actual sin tocar score histórico ni meta persistida.

## Audio

- Efectos y música procedural por `WebAudio API`.
- Volúmenes de música y FX persistidos por separado.

## Deploy

- GitHub Pages publica el contenido estático del repositorio raíz.
- No hay backend ni paso de build.

## Limitaciones técnicas

- `game.js` es monolítico y concentra demasiadas responsabilidades.
- No hay test suite automática.
- No existe separación formal por módulos o dominios.

## Recomendaciones de mantenimiento

### Si el proyecto sigue creciendo

- Separar `game.js` por dominios: `input`, `meta`, `render`, `audio`, `persistencia`.
- Añadir al menos validación automatizada básica para sintaxis y smoke tests.
- Mantener `README.md` corto y estable; mover detalle mutable a `docs/`.

### Cuando se añadan nuevas features

- Si cambian reglas de progresión o modos, actualizar `docs/producto.md`.
- Si cambian estructuras internas, claves persistidas o responsabilidades técnicas, actualizar este documento.
- Si un modo nuevo reutiliza nombres de dominio como `wave`, documentar si se refiere a campaña, supervivencia o progresión infinita descendente.
