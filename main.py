import pygame
import random
import math
from pygame import mixer

# Inicializamos Pygame
pygame.init()
# Creamos la pantalla
pantalla = pygame.display.set_mode((800, 600))

# Título, icono & fondo
pygame.display.set_caption("Invasión Espacial")
icono = pygame.image.load("astronave_icon.png")
pygame.display.set_icon(icono)
fondo = pygame.image.load("Fondo.jpg")

#Agregamos música
mixer.music.load("MusicaFondo.mp3")
mixer.music.set_volume(0.3)
mixer.music.play(-1)

# Creamos al personaje del jugador y sus variables
img_jugador = pygame.image.load("astronave64.png")
jugador_x = 368
jugador_y = 500
jugador_x_cambio = 0

# Variables del enemigo
img_enemigo = []
enemigo_x = []
enemigo_y = []
enemigo_x_cambio = []
enemigo_y_cambio = []
cantidad_enemigos = 8

# Loop para llenarme las listas de los enemigos
for e in range(cantidad_enemigos):
    img_enemigo.append(pygame.image.load("astronave_enemiga.png"))
    enemigo_x.append(random.randint(0, 736))
    enemigo_y.append(random.randint(50, 150))
    enemigo_x_cambio.append(2)
    enemigo_y_cambio.append(50)

# Variables de la bala
img_bala = pygame.image.load("bala.png")
bala_x = 0
bala_y = 500
bala_y_cambio = +0.5
bala_visible = False

# VARIABLES
puntuacion = 0
fuente = pygame.font.Font('FAST-TRACK.ttf', 32)
#fuente = pygame.font.Font('CREATED_ATTACHED_DEMO.ttf', 32)
texto_x = 10
texto_y = 10


# Función del jugador
def jugador(posicion_x, posicion_y):
    pantalla.blit(img_jugador, (posicion_x, posicion_y))


# Función de enemigos
def enemigo(posicion_x, posicion_y, ene):
    pantalla.blit(img_enemigo[ene], (posicion_x, posicion_y))


# Función de la bala
def disparar_bala(posicion_x, posicion_y):
    global bala_visible
    bala_visible = True
    pantalla.blit(img_bala, (posicion_x + 16, posicion_y + 10))


# Función para detectar colisiones
def detectar_colisiones(x_1, y_1, x_2, y_2):
    distancia = math.sqrt(math.pow(x_1 - x_2, 2) + math.pow(y_2 - y_1, 2))
    if distancia <= 27:
        return True
    else:
        return False


def mostrar_puntuacion(ubicacion_x, ubicaccion_y):
    texto = fuente.render(f"Puntuación: {puntuacion}", True, (255, 255, 255))
    pantalla.blit(texto, (ubicacion_x, ubicaccion_y))


#La fuente y el mensaje de fin de juego
fuente_final = pygame.font.Font('FAST-TRACK.ttf', 60)
def texto_final():
    mi_fuente_final = fuente_final.render("FIN DEL JUEGO", True, (255, 255, 255))
    pantalla.blit(mi_fuente_final, (80, 200))

# Loop del juego
se_ejecuta = True
while se_ejecuta:
    # Cambiamos el fondo (siempre lo primero, para que no nos tape lo demás) RGB
    # pantalla.fill((204, 144, 228)) para establecer un color
    pantalla.blit(fondo, (0, 0))

    # Iterar eventos
    for evento in pygame.event.get():
        # Evento para cerrar la ventana emergente
        if evento.type == pygame.QUIT:
            se_ejecuta = False

        # Evento de presionar teclas
        if evento.type == pygame.KEYDOWN:
            if evento.key == pygame.K_LEFT:
                jugador_x_cambio = -0.2
            if evento.key == pygame.K_RIGHT:
                jugador_x_cambio = 0.2
            # Evento para ver si se pulsa la barra espaciadora
            if evento.key == pygame.K_SPACE:
                sonido_bala = mixer.Sound("disparo.mp3")
                sonido_bala.set_volume(0.3)
                sonido_bala.play()
                if not bala_visible:
                    bala_x = jugador_x
                    disparar_bala(bala_x, bala_y)

        # Evento de soltar flechas
        if evento.type == pygame.KEYUP:
            if evento.key == pygame.K_LEFT or evento.key == pygame.K_RIGHT:
                jugador_x_cambio = 0

    # Mostramos la puntuación
    mostrar_puntuacion(texto_x, texto_y)

    # Modificar ubicación del jugador
    jugador_x += jugador_x_cambio

    # Mantener dentro de bordes al jugador
    if jugador_x <= 0:
        jugador_x = 0
    if jugador_x >= 736:
        jugador_x = 736

    # Modificar ubicación del enemigo
    for e in range(cantidad_enemigos):

        #FIN DEL JUEGO
        if enemigo_y[e] > 500:
            for k in range(cantidad_enemigos):
                enemigo_y[k] = 1000
            texto_final()
            break

        enemigo_x[e] += enemigo_x_cambio[e]

        # Mantener dentro de bordes al enemigo
        if enemigo_x[e] <= 0:
            enemigo_x_cambio[e] = 0.15
            enemigo_y[e] += enemigo_y_cambio[e]
        if enemigo_x[e] >= 736:
            enemigo_x_cambio[e] = -0.15
            enemigo_y[e] += enemigo_y_cambio[e]

        # Colision
        colision = detectar_colisiones(enemigo_x[e], enemigo_y[e], bala_x, bala_y)
        if colision:
            sonido_colision = mixer.Sound("Golpe.mp3")
            sonido_colision.set_volume(0.3)
            sonido_colision.play()
            bala_y = 500
            bala_visible = False
            puntuacion += 1
            enemigo_x[e] = random.randint(0, 736)
            enemigo_y[e] = random.randint(50, 200)

        # Ubicamos a los enemigos
        enemigo(enemigo_x[e], enemigo_y[e], e)

    # Movimiento bala
    if bala_y <= 0:
        bala_y = 500
        bala_visible = False
    if bala_visible:
        disparar_bala(bala_x, bala_y)
        bala_y -= bala_y_cambio

    # Ubicamos al jugador
    jugador(jugador_x, jugador_y)

    # Actualizamos la pantalla
    pygame.display.update()
