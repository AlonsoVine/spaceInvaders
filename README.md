# Space Invaders

Implementación web del clásico `Space Invaders` con `HTML + CSS + JavaScript` sin dependencias ni build step. El repositorio también conserva una versión histórica en `Python/Pygame` dentro de `legacy/`.

## Estado actual

- Juego 2D sobre `canvas` con cinco modos: `classic`, `survival`, `timeattack`, `coop` y `competitive`.
- Campaña clásica de `30` niveles en `5` sectores, progreso cooperativo separado y dominación de niveles.
- Meta persistente con logros, desafíos rotatorios, skins, naves, cargas iniciales equipables, insignias y bestiario.
- Dashboard inicial por pestañas, overlays de pausa/game over y soporte táctil para móvil.
- Despliegue estático a GitHub Pages desde `main`.

## Documentación

- Producto y experiencia de juego: [docs/producto.md](docs/producto.md)
- Arquitectura y mantenimiento técnico: [docs/arquitectura.md](docs/arquitectura.md)

## Estructura rápida

```text
spaceInvaders/
├─ index.html
├─ README.md
├─ css/
│  └─ style.css
├─ js/
│  └─ game.js
├─ docs/
│  ├─ producto.md
│  └─ arquitectura.md
├─ legacy/
│  ├─ main.py
│  ├─ proyecto_9.py
│  └─ assets de la versión Pygame
└─ .github/
   └─ workflows/
      └─ deploy.yml
```

## Ejecutar

Acceder a la url desplegada a través de github actions:

[https://alonsovine.github.io/spaceInvaders/](https://alonsovine.github.io/spaceInvaders/)

No requiere instalación de dependencias. Basta con abrir `index.html` en el navegador o servir el directorio como estático.

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Deploy

El workflow de `.github/workflows/deploy.yml` publica el repositorio raíz en GitHub Pages en cada `push` a `main`, excluyendo `.github`, `legacy` e `.idea`.

## Limitaciones conocidas

- `js/game.js` sigue siendo el centro monolítico del juego.
- No hay tests automáticos ni pipeline de build.
- El multijugador `2P` está pensado para teclado; en superficies táctiles se oculta para evitar una experiencia incoherente.
