# Roadmap

## Fase 0 - Base AI-ready

- [x] Documentar contexto maestro para agentes.
- [x] Registrar ADR inicial del stack.
- [x] Definir CONTRIBUTING, branching y Conventional Commits.
- [x] Crear plantillas de PR e issues.
- [x] Preparar toolchain de calidad con Husky, lint-staged, ESLint, Prettier, TypeScript y Vitest.
- [x] Añadir primeros tests unitarios sin tocar runtime.

## Fase 1 - Blindaje De Logica Actual

- [ ] Ampliar tests de progresion de campaña.
- [ ] Cubrir reglas de logros y recompensas.
- [ ] Cubrir seleccion de waves, bosses y eventos.
- [ ] Cubrir escalado infinito del modo `waves` y persistencia de mejores marcas.
- [ ] Añadir smoke test browser para carga de `index.html`.
- [ ] Medir cobertura minima inicial.

## Fase 2 - Modularizacion Gradual

- [ ] Extraer utilidades puras de `js/game.js` a modulos testables.
- [ ] Separar dominios: `campaign`, `achievements`, `bestiary`, `waves`, `persistence`, `input`, `audio`, `render`.
- [ ] Mantener compatibilidad del entrypoint actual.
- [ ] Crear ADR para la estrategia de modulos.

## Fase 3 - Calidad Continua

- [ ] Añadir workflow de CI para `npm ci` y `npm run quality`.
- [ ] Publicar reporte de cobertura en PR.
- [ ] Añadir auditoria periodica de dependencias.
- [ ] Documentar release checklist.

## Fase 4 - Evolucion Funcional

- [ ] Balancear dificultad por modo con datos de partidas.
- [ ] Ajustar progresion de `waves`: basicos, acorazados/tanks, shooters, minijefes y bosses descendentes.
- [ ] Consolidar guia visual de canvas: siluetas, proyectiles, power-ups, telemetria de oleadas y accesibilidad.
- [ ] Mejorar accesibilidad de overlays y controles.
- [ ] Evaluar guardado/exportacion de perfil.
- [ ] Revisar experiencia tactil para modos no 2P.
