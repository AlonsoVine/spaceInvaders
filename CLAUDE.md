# Contexto Maestro Para Agentes

Este archivo es la guia operativa del repositorio. Todo agente debe leerlo antes de modificar codigo, abrir issues o proponer refactors.

## Resumen Ejecutivo

`spaceInvaders` es una aplicacion web estatica del juego Space Invaders. No tiene backend ni build de runtime. La experiencia principal vive en `index.html`, los estilos en `css/style.css` y la logica de juego en `js/game.js`.

El objetivo de mantenimiento es evolucionar el juego sin romper la version desplegable en GitHub Pages.

## Stack Tecnico

- Runtime: navegador moderno.
- UI: HTML, CSS y JavaScript vanilla.
- Render: `canvas` 2D.
- Audio: WebAudio API.
- Persistencia: `localStorage`.
- Deploy: GitHub Pages mediante `.github/workflows/deploy.yml`.
- Calidad propuesta: Node.js solo para herramientas de desarrollo, no para runtime.
- Tests propuestos: Vitest sobre logica pura extraida o cargada desde `js/game.js`.

## Arquitectura Actual

- `index.html`: estructura DOM, canvas, dashboard inicial, overlays y controles tactiles.
- `css/style.css`: layout arcade, responsive, HUD, dashboard y estados visuales.
- `js/game.js`: monolito con estado, reglas, input, render, audio, persistencia y meta-progresion.
- `docs/`: documentacion funcional y tecnica.
- `docs/adr/`: decisiones de arquitectura.
- `legacy/`: version historica en Python/Pygame y assets de referencia.

## Reglas De Trabajo Para Agentes

1. Leer `README.md`, `docs/arquitectura.md`, `docs/producto.md` y este archivo antes de tocar gameplay.
2. No refactorizar `js/game.js` sin tests previos sobre el comportamiento afectado.
3. No cambiar runtime ni introducir frameworks sin ADR aprobado.
4. Mantener GitHub Pages como destino de deploy estatico.
5. Si se modifica progresion, logros, campaña, bestiario o persistencia, actualizar documentacion y tests.
6. No borrar ni reescribir `legacy/`; es referencia historica.

## Comandos Frecuentes

```bash
python -m http.server 8000
npm install
npm run build
npm run lint
npm run test:run
npm run typecheck
npm run quality
```

Notas:

- `npm install` instala herramientas de desarrollo y activa Husky mediante `prepare`.
- `npm run build` no genera artefactos porque el runtime es estatico; valida sintaxis JavaScript.
- Si solo se quiere probar el juego, basta con abrir `index.html` o servir el repo como estatico.

## Convenciones De Codigo

- Mantener JavaScript vanilla en `js/game.js` hasta que exista ADR para modularizacion.
- Preferir funciones puras para nueva logica de reglas, progresion y calculos.
- Evitar acoplar nuevas reglas al DOM si pueden probarse por separado.
- Usar nombres descriptivos y consistentes con el dominio actual: `campaign`, `bestiary`, `achievement`, `starterLoadout`, `boss`, `wave`, `waves`.
- Mantener textos de producto en español.
- No introducir dependencias de runtime sin justificar impacto en ADR.

## Calidad Minima

Antes de una PR:

```bash
npm run quality
```

La puerta de calidad cubre:

- sintaxis JS con `node --check`;
- lint con ESLint;
- typecheck estricto preparado en `tsconfig.json`;
- tests unitarios con Vitest;
- formato con Prettier.

## Memory Bank

### 2026-05-14 - Estado base AI-ready

- Decision: mantener el stack web estatico sin build de runtime.
- Decision: introducir Node.js solo como toolchain de desarrollo.
- Decision: Vitest sera la ruta recomendada para tests unitarios.
- Decision: el primer blindaje cubre logica pura cargando `js/game.js` en sandbox, sin modificar gameplay.
- Decision: `tsconfig.json` se configura con `strict: true`, `allowJs: true` y `checkJs: false` para preparar TypeScript sin forzar migracion inmediata del monolito.
- Decision: el modo `waves` / `oleadas` se documenta como experiencia infinita sin campaña ni selector de nivel, con enemigos descendentes y mejores marcas persistidas.
- Riesgo conocido: `js/game.js` concentra demasiadas responsabilidades y requiere refactor gradual por dominios.
- Restriccion: cualquier refactor de `game.js` debe llegar despues de tests que describan el comportamiento actual.
