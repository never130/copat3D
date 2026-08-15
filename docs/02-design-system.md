# 02 — Sistema de Diseño

Derivado del concepto visual oficial: estética **Memphis 3D / Neo-vibrante** — fondo magenta saturado, figuras geométricas facetadas flotando, tipografía neo-grotesca muy pesada, elementos gráficos lineales blancos.

## Paleta

Los colores se toman directamente de las figuras del arte original.

### Marca

| Token | Hex | Uso |
|---|---|---|
| `--copat-magenta` | `#E6006E` | Color institucional primario |
| `--copat-magenta-bright` | `#FF2D8F` | Extremo claro del degradé del hero |
| `--copat-magenta-deep` | `#B00057` | Extremo oscuro del degradé, hovers |

### Acentos (figuras 3D)

| Token | Hex | Figura de origen |
|---|---|---|
| `--copat-yellow` | `#FFC629` | Zigzag y trípode dorado |
| `--copat-green` | `#7DC142` | Zigzag verde |
| `--copat-lilac` | `#B57BE8` | Cruces / signos "+" |
| `--copat-sky` | `#6FB9E4` | Pirámide celeste |
| `--copat-coral` | `#E8897F` | Icosaedro central |

Cada acento se usa **una sola vez por sección** como color de énfasis. No mezclar más de dos acentos en un mismo componente: la vibración cromática sobre magenta ya es alta y compite por atención.

### Modos

El **modo oscuro es el default** — la identidad es neón sobre fondo profundo, y es donde las figuras 3D brillan más.

| Rol | Token | Oscuro (default) | Claro |
|---|---|---|---|
| Fondo base | `--bg` | `#0B0410` violeta-negro | `#FAF7FB` off-white |
| Superficie (cards) | `--surface` | `#170A1E` | `#FFFFFF` |
| Superficie 2 | `--surface-2` | `#21102A` | `#F3EEF6` |
| Borde | `--border` | `rgba(255,255,255,.09)` | `rgba(10,4,16,.10)` |
| Texto primario | `--fg` | `#FFFFFF` | `#12060F` |
| Texto secundario | `--muted` | `#A899B0` | `#5C4E63` |
| Acento de texto | `--accent-text` | `#FFC629` | `#B00057` |
| Anillo de foco | `--focus` | `#FFC629` | `#B00057` |

El hero mantiene el **degradé magenta en ambos modos** — es la firma de la marca y no debe invertirse.

> **Por qué el acento de texto no es el magenta institucional en modo claro:**
> `#E6006E` sobre `#FAF7FB` da 4.6:1 — alcanza para texto grande pero **no** para los eyebrows en mayúscula de 12px. El token `--accent-text` usa el tono profundo `#B00057` (~7:1). El magenta puro se sigue usando para fondos y superficies, no para texto chico.

### Estados del navbar

El navbar vive sobre **dos fondos distintos** y necesita dos tratamientos. Ignorar esto fue un bug real: en modo claro quedaba blanco sobre blanco al salir del hero.

| Estado | Cuándo | Tratamiento |
|---|---|---|
| `overlay` | Portada, sobre el magenta del hero | Texto, bordes y CTA en blanco; fondo transparente |
| `solid` | Scrolleado más allá del 82% del hero, **o** cualquier página interior | `--surface` al 85% con `backdrop-blur`; texto `--fg`; CTA magenta con texto blanco |

Se resuelve con un listener de scroll (no con CSS scroll-driven): el navbar es UI crítica y una degradación fallida lo dejaría ilegible en Safari y Firefox, que todavía no soportan `animation-timeline`.

## Tipografía

| Rol | Fuente | Peso |
|---|---|---|
| Display / Títulos | Helvetica Now Display | Bold / 700–900 |
| Cuerpo / UI | Inter | 400 / 500 / 600 |

> ⚠️ **Helvetica Now Display es una fuente paga de Monotype** y requiere licencia web (con tope de pageviews) para usarse en producción. No se puede servir desde un CDN público ni copiarse de otro sitio.
>
> **Implementación actual:** `Inter Tight` (Google Fonts, gratis, open source) en pesos 700–900 como sustituto de display. Es el neo-grotesco libre más cercano en anchura y altura de x.
>
> Si la AIF **tiene** la licencia: dejar caer los `.woff2` en `public/fonts/` y cambiar la definición de `--font-display`. El resto del sistema no se toca.

Reglas de composición:
- Títulos en **tracking negativo** (`-0.03em`) y `text-wrap: balance` — el neo-grotesco pesado necesita apretarse.
- El slogan siempre en mayúscula y sentence case, nunca en itálica.
- Cuerpo con `max-width: 65ch`.

## Sistema de figuras 3D

### Decisión técnica

Las figuras **no usan WebGL**. Se implementan como **SVG inline con degradés por cara** (facetado, igual que el arte original) animadas con CSS.

Por qué:
- El arte original ya es un render facetado plano — un SVG con tres degradés reproduce la misma lectura visual.
- Costo: ~2 KB por figura vs. ~600 KB de runtime WebGL.
- Funciona en cualquier dispositivo, sin fallback de mobile ni pérdida de batería.
- Animable con `prefers-reduced-motion` de forma trivial.

### Comportamiento por figura

Cada figura tiene un movimiento propio que sugiere gravedad cero, con periodos **primos entre sí** para que el conjunto nunca se sincronice ni se vea mecánico.

| Figura | Color | Movimiento | Periodo |
|---|---|---|---|
| Icosaedro | Coral | Rotación continua + flotación vertical | 19s / 7s |
| Zigzag A | Amarillo | Balanceo en Z (±18°) + deriva horizontal | 11s |
| Zigzag B | Verde | Balanceo en Z inverso (∓18°) | 13s |
| Cruz "+" | Lila | Rotación lenta + cabeceo | 17s |
| Pirámide | Celeste | Rotación diagonal lenta | 23s |
| Trípode "Y" | Amarillo | Giro constante tipo engranaje | 9s |

### Parallax

Las figuras se agrupan en **tres planos de profundidad** que se desplazan a distinta velocidad con el scroll:

| Plano | Escala | Opacidad | Velocidad |
|---|---|---|---|
| Fondo | 0.6 | 0.5 | 0.2× |
| Medio | 1.0 | 0.85 | 0.5× |
| Frente | 1.4 | 1.0 | 0.9× |

Implementado con **scroll-driven animations de CSS** (`animation-timeline: scroll()`), sin listeners de JS. En navegadores sin soporte las figuras quedan estáticas en su posición — degradación limpia.

### Elementos gráficos secundarios

Del arte original: grillas de puntos, ondas, llaves `{`, arcos, triángulos pequeños y cruces finas — todos en blanco puro, trazo `2px`, `stroke-linecap: round`. Se distribuyen en los márgenes como "ruido compositivo" y **nunca** deben quedar detrás de texto.

## Movimiento

| Regla | Valor |
|---|---|
| Curva estándar | `cubic-bezier(.22,1,.36,1)` (out-expo) |
| Duración UI | 180ms (micro) / 320ms (transición) |
| Duración ambiental | 9s–23s (figuras) |
| Entrada de sección | fade + `translateY(24px)`, escalonado 60ms |
| Transición de vista | 620ms (hoja) |

## Transición de hoja entre vistas

Cada ruta entra como **una hoja de papel que se apoya sobre la anterior**: sube desde abajo 46px, con una sombra proyectada bajo su canto superior que se disuelve a medida que se asienta, y una línea de luz (amarillo → magenta) que recorre el borde superior y se desvanece. Ese canto iluminado es el detalle que hace que se lea como papel y no como un fade genérico.

### Por qué no se usa la View Transitions API

Es la herramienta natural para esto, pero **no está disponible en este stack**:

- `<ViewTransition>` de React existe solo en canary, no en React 19.2 estable.
- Next 16.3 no expone el flag `experimental.viewTransition`.
- La versión CSS pura (`@view-transition { navigation: auto }`) solo se dispara en navegaciones de documento completo, y Next navega del lado del cliente.

**Solución adoptada:** `app/template.tsx`. A diferencia de `layout.tsx`, Next lo remonta en cada navegación, así que la animación de entrada se dispara sola. Funciona en todos los navegadores hoy, sin APIs experimentales.

Limitación aceptada: solo se anima la vista **entrante**, porque la saliente se desmonta de inmediato. La metáfora de una hoja que se apoya encima funciona igual — no necesita animación de salida.

### La misma metáfora al scrollear

La transición de hoja no vive solo en el cambio de ruta: **cada sección se comporta como una hoja** mientras scrolleás.

| Fase | Rango | Qué hace |
|---|---|---|
| Entrada | `entry 0%` → `entry 42%` | Sube 52px y escala de 0.97 a 1, apareciendo |
| Salida | `exit 20%` → `exit 100%` | Sube 40px, escala a 0.94 y baja a 30% de opacidad |

El efecto combinado es que la sección siguiente parece **taparte** la anterior, como pasar páginas. Se implementa con `animation-timeline: view()` sobre la clase `.sheet`, sin JavaScript.

Detalle de implementación que importa: la entrada usa `both` y la salida solo `forwards`. En CSS, **la última animación declarada gana**, así que si `sheet-cover` rellenara también hacia atrás, pisaría a `sheet-settle` durante toda la entrada y la sección aparecería ya encogida.

Reemplaza a la vieja clase `.reveal`, que animaba elementos sueltos: animar la sección completa como una unidad lee mucho más como una hoja que animar sus cajas por separado.

### Restricción de layout que impone

El contenedor de la hoja anima `transform`, y **cualquier ancestro con transform convierte a sus descendientes `position: fixed` en `absolute`**. Por eso el navbar y el footer viven en `layout.tsx`, **fuera** del template. Además el fotograma final usa `transform: none` (no `scale(1)`) para que el elemento deje de ser bloque contenedor cuando termina.

Si en el futuro se agrega otro elemento fijo o sticky, va en el layout, nunca dentro de la hoja.

**`prefers-reduced-motion: reduce` desactiva toda animación ambiental y parallax**, dejando solo fades de 120ms. Es requisito de accesibilidad, no un extra.

## Tecnologías visuales aplicadas

Elegidas por ser modernas *y* baratas en performance — todas degradan sin romper:

| Técnica | Uso en el sitio |
|---|---|
| `@property` + `@keyframes` | Degradé del hero que rota su ángulo animadamente |
| `animation-timeline: scroll()/view()` | Parallax y entradas de sección sin JS |
| `color-mix()` | Derivar hovers y bordes de un solo token |
| `backdrop-filter` | Navbar y cards de agenda (glassmorphism) |
| `@starting-style` | Animación de entrada de elementos nuevos |
| `text-wrap: balance` | Títulos que nunca quedan con una palabra huérfana |
| `mask-image` | Desvanecido de bordes en el carrousel de sponsors |
| Filtro SVG de grano | Textura sutil sobre el magenta, evita el "plano digital" |
| Container queries | Cards que se adaptan a su contenedor, no al viewport |

## Accesibilidad

- Contraste **AA mínimo** en todo texto. Ojo: blanco sobre `--copat-magenta` da 4.6:1 — válido para texto grande y bold, **no** para cuerpo chico. El texto pequeño sobre magenta va en `#FFFFFF` con peso 600+ o sobre superficie oscura.
- Foco visible siempre: anillo de 2px en `--copat-yellow` (alto contraste sobre magenta y sobre oscuro).
- Las figuras son decorativas → `aria-hidden="true"`.
- Formularios con `<label>` real, nunca solo placeholder.
