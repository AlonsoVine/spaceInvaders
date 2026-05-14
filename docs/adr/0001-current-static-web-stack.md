# ADR 0001: Mantener Stack Web Estatico Actual

- Estado: Aceptado
- Fecha: 2026-05-14

## Contexto

El proyecto funciona como una aplicacion web estatica desplegada en GitHub Pages. La entrada principal es `index.html`, la presentacion vive en `css/style.css` y la logica completa del juego esta concentrada en `js/game.js`.

El juego no requiere backend, bundler ni framework de runtime. Ya existe una version historica en `legacy/` basada en Python/Pygame, pero no participa en la ejecucion web actual.

## Decision

Mantener el runtime actual como HTML, CSS y JavaScript vanilla sin paso de build obligatorio.

Se permite introducir Node.js solo para herramientas de desarrollo:

- tests unitarios;
- lint;
- formato;
- typecheck preparatorio;
- hooks de Git con Husky y lint-staged.

## Consecuencias

Positivas:

- El deploy en GitHub Pages sigue siendo simple.
- No se rompe el flujo actual de abrir o servir `index.html`.
- Las herramientas de calidad se pueden adoptar de forma incremental.

Negativas:

- `js/game.js` sigue siendo un monolito.
- La cobertura de tests inicial debe trabajar alrededor de un script no modular.
- La migracion a modulos o TypeScript requerira ADR posterior y tests previos.

## Reglas Derivadas

- No introducir dependencias de runtime sin un ADR nuevo.
- No convertir el proyecto a framework sin justificar coste, beneficios y plan de migracion.
- Priorizar extraccion gradual de logica pura cuando se amplie la cobertura de tests.
