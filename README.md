# Space Invaders Game

![IMG](recreativas_invaders.png "Space Invaders Image")

Implementación web del clásico **Space Invaders** con una base muy ligera: `HTML + CSS + JavaScript` sin dependencias ni build step. El repositorio también conserva una versión histórica en `Python/Pygame` dentro de `legacy/`.

## Resumen

- Juego 2D sobre `canvas` de `800x600`.
- Interfaz retro responsive para escritorio y móvil.
- Lógica principal concentrada en `js/game.js`.
- Persistencia local de récord e historial mediante `localStorage`.
- Despliegue automático a GitHub Pages desde `main`.

## Funcionalidades implementadas

- Pantalla de inicio con overlay y botón de arranque.
- HUD con puntuación, récord, vidas y nivel.
- Movimiento del jugador por teclado y controles táctiles.
- Pausa con `P` o `Esc`.
- Disparo del jugador con una bala activa simultánea.
- Oleadas de enemigos en rejilla con desplazamiento lateral, descenso y animación simple.
- Disparo enemigo por columnas activas.
- Escudos destructibles.
- UFO especial con aparición aleatoria y puntuación extra.
- Sistema de combos con textos flotantes.
- Explosiones y feedback visual al impactar.
- Audio retro sintetizado con `WebAudio API`.
- Música de fondo procedural con control de activación y volumen.
- Soporte para pantalla completa.
- Panel inicial de ajustes con dificultad y vibración.
- Atajos visibles y accesos directos para música/fullscreen.
- Vibración en dispositivos compatibles al recibir daño.
- Transición entre niveles y dificultad progresiva.
- Estadísticas de partida y acumuladas.
- Guardado local de récord (`si_hs`), historial enriquecido (`si_history`) y estadísticas acumuladas (`si_stats`).

## Estructura del proyecto

```text
spaceInvaders/
├─ index.html
├─ README.md
├─ recreativas_invaders.png
├─ css/
│  └─ style.css
├─ js/
│  └─ game.js
├─ legacy/
│  ├─ main.py
│  ├─ proyecto_9.py
│  ├─ imágenes, sonidos y fuentes de la versión Pygame
└─ .github/
   └─ workflows/
      └─ deploy.yml
```

## Cómo está estructurada la aplicación

### 1. Capa de interfaz

- `index.html` define un layout mínimo con HUD, `canvas`, overlay de inicio/game over, controles táctiles y enlace externo.
- La web no usa componentes ni framework; toda la UI está montada directamente sobre el DOM y el `canvas`.

### 2. Capa visual y responsive

- `css/style.css` controla el look retro con paleta neón, layout vertical para móvil y ajustes específicos para `landscape`.
- Los controles táctiles solo aparecen en dispositivos con puntero grueso (`pointer: coarse`).
- El `canvas` escala de forma fluida manteniendo el aspecto jugable.

### 3. Capa de juego

`js/game.js` concentra toda la lógica. A nivel práctico funciona como un único módulo con estas responsabilidades:

- Estado global de partida: `score`, `lives`, `level`, `running`, `paused`, `combo`, `frameCount`.
- Persistencia: lectura y escritura en `localStorage` para récord, historial, ajustes y estadísticas.
- Audio: generación procedural de efectos con `AudioContext`.
- Entrada: teclado, botón de inicio y controles táctiles.
- Sistemas de juego: jugador, bala del jugador, balas enemigas, escudos, enemigos, UFO, explosiones, textos flotantes y tracking de métricas.
- Bucle principal: `update()` + `draw()` + `requestAnimationFrame(loop)`.

### 4. Flujo de una partida

1. `startGame()` reinicia estado, HUD, enemigos y escudos.
2. `loop()` ejecuta actualización y render mientras `running` sea `true`.
3. `update()` resuelve movimiento, disparos, colisiones, combos, avance de nivel y muerte.
4. `draw()` renderiza todos los elementos del juego sobre el `canvas`.
5. `gameOver()` guarda puntuación, muestra historial y reabre el overlay.

## Contexto técnico útil

### Fortalezas actuales

- La app es simple de desplegar y de entender.
- No depende de librerías externas.
- El juego ya cubre el núcleo jugable: progresión, scoring, feedback audiovisual y soporte móvil.

### Limitaciones estructurales

- `js/game.js` es monolítico; cualquier mejora grande va a tocar varias zonas del mismo archivo.
- No hay separación por módulos, clases ni sistemas desacoplados.
- No existen tests automáticos.
- No hay pipeline de build, lint ni empaquetado.
- El workflow de deploy solo publica archivos estáticos; no hay backend ni servicios externos.

### Qué implica esto para futuras mejoras

- Mejoras pequeñas como música, dificultad o fullscreen son directas.
- Funcionalidades como ranking online, logros, guardado de progreso o editor de niveles requerirán separar estado, persistencia y UI.
- Si el proyecto sigue creciendo, conviene dividir `game.js` por dominios: entrada, audio, entidades, render y persistencia.

## Ejecutar el proyecto

No requiere instalación de dependencias. Basta con abrir `index.html` en el navegador o servir el directorio como estático.

Ejemplo con un servidor simple:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Deploy automático

El deploy está definido en `.github/workflows/deploy.yml`.

- Se ejecuta en cualquier `push` a la rama `main`.
- Publica el repositorio raíz en GitHub Pages.
- Excluye `.github`, `legacy` e `.idea` del contenido publicado.

## Directorio legacy

La carpeta `legacy/` conserva material previo y de referencia:

- `legacy/main.py`: versión original del juego en `Python/Pygame`, con assets locales, música y lógica clásica.
- `legacy/proyecto_9.py`: script independiente de búsqueda de patrones; no forma parte del juego.
- Recursos binarios: imágenes, sonidos y tipografías usadas por la versión antigua.

Esta carpeta no interviene en la versión web actual, pero sí aporta contexto histórico sobre la evolución del proyecto.

## Roadmap de mejoras

### Mejoras de bajo coste

1. Tutorial interactivo de primera partida.

### Mejoras de impacto medio

1. Animaciones avanzadas.
2. Power-ups.
3. Efectos de partículas.
4. Personalización de controles.
5. Selección de skins o temas.
6. Jefe final por ciclo de niveles.
7. Modo contrarreloj.

### Mejoras que exigen más arquitectura

1. Guardado de progreso.
2. Sistema de logros o misiones.
3. Ranking online/global.
4. Modo multijugador.
5. Integración con servicios externos.
6. Editor de niveles.
7. Replay de partidas.
8. Recompensas diarias.
9. Opciones de accesibilidad completas.
10. Mejoras reales de CI/CD con validaciones y pruebas.

## Siguiente paso recomendado

Si el objetivo es seguir iterando esta base sin reescribirla, el mejor siguiente paso es extraer `js/game.js` en módulos pequeños antes de añadir features persistentes o conectadas a red.
