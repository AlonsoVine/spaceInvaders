![IMG](recreativas_invaders.png "Space Invaders Image")
# Space Invaders Game

Implementación del clásico **Space Invaders**. Actualmente en Python/Pygame, en proceso de migración a HTML5 + JavaScript para poder jugarlo directamente en el navegador sin instalar nada.

---

## 🗺️ Roadmap: Migración a HTML5 + JS

### Fase 1 — Conversión base
- [ ] Crear `index.html` con canvas 800x600
- [ ] Migrar lógica del jugador (movimiento, disparo) a JS
- [ ] Migrar lógica de enemigos (movimiento en grid, rebote) a JS
- [ ] Migrar sistema de colisiones
- [ ] Integrar imágenes y sonidos existentes vía assets
- [ ] Mostrar puntuación y pantalla de Game Over

### Fase 2 — GitHub Actions (despliegue automático)
- [ ] Crear workflow `.github/workflows/deploy.yml`
- [ ] Configurar GitHub Pages como destino
- [ ] Disparar deploy con cualquier commit a `main` con formato `deploy: <descripción>`

### Fase 3 — Mejoras
- [ ] Ver lista de mejoras propuestas más abajo

---

## 🚀 Deploy automático

El despliegue se activa con un commit en `main` con el formato:

```
deploy: descripción del cambio
```

El workflow publica automáticamente en GitHub Pages.

---

## ✨ 15 Mejoras propuestas

1. **Sistema de niveles** — enemigos más rápidos cada ronda
2. **Vidas del jugador** — 3 vidas con indicador visual
3. **Enemigos que disparan** — proyectiles descendentes aleatorios
4. **Power-ups** — escudos, disparo doble, velocidad
5. **Tabla de puntuaciones** — top 10 guardado en localStorage
6. **Pantalla de inicio** — menú con animación y botón Start
7. **Pantalla de Game Over** — con puntuación final y opción de reinicio
8. **Pausa** — tecla ESC para pausar/reanudar
9. **Animaciones de explosión** — sprite sheet al destruir enemigos
10. **Jefe final (boss)** — enemigo grande al completar cada nivel
11. **Diseño responsive** — adaptable a móvil con controles táctiles
12. **Modo 2 jugadores** — turnos alternos en el mismo teclado
13. **Efectos de partículas** — rastro de la nave y explosiones mejoradas
14. **Música y volumen ajustable** — slider de audio en la UI
15. **Compartir puntuación** — botón para compartir en redes sociales

---

## 📁 Estructura del Proyecto (versión Python original)

La versión Python original está preservada en la rama `backup/python-original`.

- **main.py**: Lógica principal del juego en Pygame
- **Imágenes**: `astronave.png`, `astronave_enemiga.png`, `bala.png`, `Fondo.jpg`
- **Sonidos**: `MusicaFondo.mp3`, `Golpe.mp3`, `disparo.mp3`
- **Fuentes**: `CREATED_ATTACHED_DEMO.ttf`, `FAST-TRACK.ttf`

## 🐍 Ejecutar versión Python (legacy)

```bash
git checkout backup/python-original
pip install pygame
python main.py
```
