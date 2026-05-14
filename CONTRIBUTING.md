# Contribucion

## Flujo De Branches

La rama estable es `main`. Todo cambio debe entrar por Pull Request desde una rama corta:

```bash
feature/<descripcion-corta>
fix/<descripcion-corta>
chore/<descripcion-corta>
docs/<descripcion-corta>
test/<descripcion-corta>
refactor/<descripcion-corta>
```

Ejemplos:

```bash
feature/boss-gauntlet-balance
fix/mobile-overlay-scroll
docs/adr-testing-strategy
test/campaign-progression
```

## Conventional Commits

Usar commits pequeños y semanticos:

```text
feat: add survival challenge reward
fix: correct coop level unlock calculation
docs: add architecture decision record
test: cover campaign domination rules
chore: configure husky pre-commit checks
refactor: extract wave event helpers
```

Tipos permitidos:

- `feat`: funcionalidad nueva.
- `fix`: correccion de bug.
- `docs`: documentacion.
- `test`: tests.
- `chore`: tooling, configuracion o tareas sin cambio funcional.
- `refactor`: cambio interno sin modificar comportamiento esperado.
- `style`: formato sin cambio de comportamiento.
- `perf`: mejora de rendimiento.

## Antes De Abrir PR

Ejecutar:

```bash
npm run quality
```

Si no hay dependencias instaladas:

```bash
npm install
npm run quality
```

## Politica De Tests

- Todo cambio en reglas de juego, campaña, logros, bestiario, persistencia o calculo de score debe incluir tests.
- Antes de refactorizar `js/game.js`, añadir tests que describan el comportamiento actual.
- Si una zona no puede testearse por acoplamiento al DOM o canvas, documentar la limitacion en la PR y cubrir al menos un smoke test o una utilidad pura relacionada.

## Pull Requests

Una PR debe explicar:

- problema o objetivo;
- archivos tocados;
- pruebas ejecutadas;
- riesgos o areas no cubiertas.

No mezclar refactors grandes con cambios de comportamiento. Primero blindar, despues evolucionar.

## Trabajo Con Agentes De IA

Antes de pedir cambios a un agente:

1. Referenciar el issue o objetivo concreto.
2. Indicar archivos que se pueden tocar.
3. Pedir validacion con `npm run quality`.
4. Exigir actualizacion de `CLAUDE.md`, `docs/arquitectura.md`, `docs/producto.md` o ADR si cambia una decision estable.
