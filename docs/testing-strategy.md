# Estrategia De Tests

## Objetivo

Blindar la logica existente antes de evolucionar el monolito. La prioridad no es alcanzar cobertura artificial, sino proteger reglas que pueden romper progresion o experiencia de juego.

## Herramienta Recomendada

Usar Vitest por tres motivos:

- API familiar al ecosistema Jest.
- Buen soporte ESM y Node moderno.
- Facil migracion futura hacia tests de modulos cuando se extraiga logica de `js/game.js`.

## Capas De Test

### 1. Unitarios De Logica Pura

Prioridad alta:

- normalizadores de settings;
- formato de duraciones, dificultad y modos;
- progresion de campaña;
- dominacion de niveles;
- seleccion de bosses, eventos y waves;
- recompensas y estados de logros.

### 2. Integracion Ligera

Prioridad media:

- carga de `index.html` con DOM simulado;
- persistencia contra `localStorage` fake;
- inicio/cierre de partida en modo controlado.

### 3. Smoke Browser

Prioridad media despues de la base:

- abrir el juego en navegador real;
- verificar que canvas no queda en blanco;
- verificar dashboard inicial y controles principales.

## Regla Para Refactors

Antes de mover codigo desde `js/game.js`, crear tests que fallen si cambia el comportamiento observable. Despues extraer la funcion o modulo manteniendo el test verde.

## Cobertura Inicial Recomendada

Objetivo pragmatico:

- 20-30 tests sobre logica pura antes del primer refactor grande.
- 1 smoke test de carga antes de tocar DOM/overlay.
- Cobertura por dominio antes que cobertura global.
