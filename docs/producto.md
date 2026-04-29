# Producto

## Visión general

La versión web de `Space Invaders` ya no es un clon mínimo. El juego combina una base arcade clásica con progresión persistente, catálogo meta y varios modos de sesión. Todo corre en cliente, sin backend, usando `localStorage` para guardar progreso y ajustes.

## Modos de juego

### Clásico

- Es el modo base y el que articula la campaña principal.
- Permite elegir nivel inicial según progreso desbloqueado.
- Recorre cinco sectores, bosses y recompensas de campaña.

### Supervivencia

- El foco está en aguantar el mayor tiempo posible.
- No usa selector de nivel inicial ni campaña por sectores.
- Alimenta logros y recompensas específicas de resistencia.

### Contrarreloj

- Reemplaza la presión por oleadas infinitas con una ventana de tiempo fija.
- Tiene su propia escalera de logros y cosméticos.

### 2 Jugadores Cooperativo

- Dos pilotos comparten presión de partida y progresión propia de campaña coop.
- Las reentradas y el cierre con ambos jugadores en pie forman parte del progreso meta.

### 2 Jugadores Competitivo

- Dos pilotos compiten en la misma sesión por score y supervivencia relativa.
- Tiene logros propios y recompensa cosmética específica.

### Regla de disponibilidad 2P

- Los modos `coop` y `competitive` están pensados para teclado.
- En superficies táctiles o layouts móviles se deshabilitan para evitar una experiencia incompleta.

## Progresión y campaña

### Sectores

- La campaña clásica se divide en `5` sectores de `6` niveles.
- Cada sector tiene boss objetivo y recompensa asociada.
- Los sectores altos ya entregan también cosméticos, no solo insignias.

### Cierre de campaña

- El `sector 5` cubre los niveles `25-30`.
- El nivel `29` funciona como `gauntlet` y encadena `Striker`, `Pulse`, `Warden` y `Overlord` uno detrás de otro.
- El nivel `30` cierra la campaña con `NEMESIS`, un boss final que además invoca grupos periódicos de enemigos normales.

### Niveles dominados

- Un nivel puede quedar `superado` o `dominado`.
- La dominación exige cerrar con umbral mínimo de vidas y precisión.
- Ese estado se usa tanto para feedback en UI como para logros.

### Progreso cooperativo

- El modo `coop` guarda avance separado respecto a `classic`.
- Comparte la estructura de campaña, pero no la misma tabla de progreso.

## Meta y recompensas

### Logros

- El catálogo cubre `inicio`, `progresión`, `habilidad`, `modos`, `colección` y `meta`.
- Ya existe cobertura específica para `survival`, `timeattack`, `coop`, `competitive`, bestiario y campaña clásica.
- Las recompensas pueden ser `skins`, `shipSkin`, `starterLoadout` o `badges`.

### Cargas iniciales

- Algunas recompensas meta desbloquean cargas iniciales equipables desde `Visual`.
- La partida puede arrancar con `escudo`, `rapid`, `pierce` o `drones` ya equipados.
- Su comportamiento sigue siendo temporal o consumible, igual que cuando entran por `power-up`.
- Se aplican en `classic`, `coop` y `survival`.
- No se aplican en `timeattack` ni `competitive`.

### Desafío activo

- Hay un desafío rotatorio persistente.
- Sus completados alimentan progresión meta adicional.

### Colección

- La colección ya no se limita a skins y naves.
- El panel de equipación permite consultar:
  - `skins`
  - `naves`
  - `insignias`

### Bestiario

- Registra enemigos base, variantes UFO, élites y bosses.
- Guarda vistas y derrotas acumuladas por tipo.
- Sirve tanto como capa de lectura del juego como fuente de logros meta.

## UI y flujo de partida

### Dashboard inicial

- Se organiza por pestañas:
  - `Resumen`
  - `Partida`
  - `Visual`
  - `Objetivos`
  - `Colección`
  - `Opciones`

### Overlay de pausa y game over

- El overlay cambia de composición según estado.
- `pause` prioriza continuidad de sesión y ajustes.
- En `classic` y `coop`, si la partida está en un nivel seleccionable, también permite `reintentar nivel` desde pausa.
- `gameover` prioriza cierre de partida, resumen y progreso ganado.

### HUD y feedback

- El HUD muestra score, récord, vidas, nivel, modo y estado temporal.
- También hay chips para boss activo y power-ups.
- En móvil existe una variante más compacta y legible.

## Controles

### Teclado

- Movimiento principal: flechas o esquema del jugador correspondiente.
- Disparo: `Space` para P1 y `Enter` para P2 en modos `2P`.
- Pausa: `P`, `Esc` o `Enter` según contexto.
- Música y fullscreen: atajos rápidos visibles en escritorio.

### Táctil

- Hay controles dedicados para movimiento, disparo y pausa.
- Los hints de teclado se ocultan en `pointer: coarse`.

## Móvil

- El juego adapta overlay, HUD y controles para `portrait` y `landscape`.
- Se eliminó el bloqueo de zoom del viewport.
- La UI informa explícitamente de la limitación de `2P` en táctil.

## Persistencia

El juego guarda estado local sin servicios externos:

- récord e historial
- estadísticas acumuladas
- ajustes de partida y audio
- meta persistente
- campaña y colección

## Criterios para mantener esta documentación viva

- Documentar aquí comportamiento y reglas estables del producto.
- Evitar listas exhaustivas de cada cambio menor o pseudo-changelog.
- Si cambia un modo, una regla de progresión o una superficie UI, actualizar esta guía y no solo el README.
