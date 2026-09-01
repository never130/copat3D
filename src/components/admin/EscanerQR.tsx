"use client";

import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Se llama cada vez que se detecta un código NUEVO, o el mismo código
   *  después de que pasó el enfriamiento (ver `ENFRIAMIENTO_MS`). */
  onDetectado: (codigo: string) => void;
  onCerrar: () => void;
};

/** Cuánto tiempo se ignora un código repetido antes de volver a dispararlo.
 *  Sin esto, mientras la cámara sigue apuntando al mismo QR (varios cuadros
 *  por segundo) se llamaría a `onDetectado` decenas de veces por persona. Un
 *  código DISTINTO —la próxima persona en la fila— siempre dispara al
 *  toque, sin esperar este enfriamiento. */
const ENFRIAMIENTO_MS = 2500;

/** Ancho al que se reduce el cuadro antes de decodificar. La cámara trasera
 *  de un celular entrega frames de varios megapíxeles; decodificar cada uno
 *  entero es lento y calienta el teléfono para nada — el QR del mail (360px,
 *  margen 2) se lee perfecto a esta resolución. El `<video>` que ve la
 *  persona sigue mostrándose a resolución completa; achicado va solo el
 *  canvas oculto que usa jsQR. */
const ANCHO_DECODIFICACION = 480;

type Estado = "iniciando" | "escaneando" | "error";

function mensajeError(error: unknown): string {
  const nombre = error instanceof DOMException ? error.name : "";
  switch (nombre) {
    case "NotAllowedError":
      return "No se pudo acceder a la cámara: el navegador bloqueó el permiso. Revisá los permisos del sitio y volvé a intentar.";
    case "NotFoundError":
      return "No se encontró ninguna cámara en este dispositivo.";
    case "NotReadableError":
      return "La cámara está siendo usada por otra aplicación.";
    default:
      return "No se pudo iniciar la cámara. Podés seguir usando el buscador manual de abajo.";
  }
}

/**
 * Lector de QR por cámara, para marcar asistencia sin escribir el código a
 * mano.
 *
 * Antes de esto, el QR del mail no cerraba ningún circuito: alguien lo leía
 * con la cámara nativa del celular (que solo lo decodifica a texto en OTRA
 * app), volvía a `/admin`, y tenía que tipearlo o pegarlo en el buscador.
 * Acá la cámara vive DENTRO del panel: apuntar al QR ya dispara el marcado.
 *
 * No usa ninguna librería de escaneo con UI propia (tipo html5-qrcode):
 * `jsQR` es solo la función de decodificación —recibe los píxeles de un
 * frame y devuelve el texto o `null`—, así que la cámara, el bucle y la
 * interfaz quedan acá, consistentes con el resto del panel en vez de traer
 * el estilo de una librería externa.
 */
export function EscanerQR({ onDetectado, onCerrar }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [estado, setEstado] = useState<Estado>("iniciando");
  const [error, setError] = useState<string | null>(null);

  // `onDetectado` cambia de identidad en cada render del padre (cierra sobre
  // `busqueda` y demás estado suyo). El efecto de la cámara la monta UNA
  // sola vez ([] de dependencias) para no reiniciar el permiso en cada
  // tecla que alguien escribe en el buscador — así que lee siempre la
  // versión más reciente a través de esta ref, en vez de quedar atado a la
  // que existía en el momento del montaje.
  //
  // La actualización va en su propio efecto y no suelta en el cuerpo del
  // componente: escribir en una ref durante el render está prohibido (no es
  // un valor que haga falta para pintar), aunque acá el efecto de la cámara
  // nunca la LEE durante un render, así que en la práctica no cambia el
  // comportamiento — solo dónde vive la asignación.
  const onDetectadoRef = useRef(onDetectado);
  useEffect(() => {
    onDetectadoRef.current = onDetectado;
  }, [onDetectado]);

  useEffect(() => {
    // `activo` y no solo el cleanup de rAF: si el permiso de cámara tarda
    // (el usuario piensa el diálogo del navegador) y el componente se
    // desmonta mientras tanto, el stream que llega después hay que cerrarlo
    // apenas llega, no dejarlo prendido en segundo plano.
    let activo = true;
    let stream: MediaStream | null = null;
    let rafId = 0;
    let contadorFrames = 0;
    // Última detección: evita releer el mismo código en cuadros seguidos
    // (ver ENFRIAMIENTO_MS) sin frenar la detección de uno distinto.
    let ultimo: { codigo: string; ts: number } | null = null;

    function decodificar() {
      if (!activo) return;
      rafId = requestAnimationFrame(decodificar);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) {
        return;
      }

      // Cada 2 cuadros y no todos: a 60fps decodificar siempre es trabajo
      // de sobra para un QR estático que la persona sostiene quieto.
      contadorFrames++;
      if (contadorFrames % 2 !== 0) return;

      const escala = ANCHO_DECODIFICACION / video.videoWidth;
      const ancho = ANCHO_DECODIFICACION;
      const alto = Math.round(video.videoHeight * escala);
      if (canvas.width !== ancho || canvas.height !== alto) {
        canvas.width = ancho;
        canvas.height = alto;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, ancho, alto);

      const imagen = ctx.getImageData(0, 0, ancho, alto);
      const resultado = jsQR(imagen.data, ancho, alto, {
        inversionAttempts: "dontInvert",
      });
      if (!resultado?.data) return;

      const ahora = Date.now();
      const mismoCodigoReciente =
        ultimo?.codigo === resultado.data &&
        ahora - ultimo.ts < ENFRIAMIENTO_MS;
      if (mismoCodigoReciente) return;

      ultimo = { codigo: resultado.data, ts: ahora };
      onDetectadoRef.current(resultado.data);
    }

    async function iniciar() {
      try {
        // "environment" y no "user": en el celular de quien acredita, la
        // trasera es la que se apunta hacia afuera, a la pantalla de quien
        // se inscribió. `ideal` y no una constraint dura: en una notebook
        // sin cámara trasera, sigue abriendo la que haya en vez de fallar.
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (!activo) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        setEstado("escaneando");
        decodificar();
      } catch (err) {
        if (!activo) return;
        console.error("No se pudo abrir la cámara:", err);
        setError(mensajeError(err));
        setEstado("error");
      }
    }

    iniciar();

    return () => {
      activo = false;
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="border-border bg-surface mt-4 overflow-hidden rounded-2xl border">
      <div className="relative aspect-square w-full max-w-sm mx-auto bg-black sm:aspect-video sm:max-w-none">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          aria-label="Vista de la cámara para escanear el código QR"
        />
        {/* El canvas de decodificación queda oculto: es una herramienta de
            cálculo para jsQR, no algo que la persona necesite ver. */}
        <canvas ref={canvasRef} className="hidden" />

        {estado === "escaneando" && (
          <div
            className="pointer-events-none absolute inset-0 grid place-items-center"
            aria-hidden="true"
          >
            <div className="border-copat-yellow size-48 rounded-2xl border-4 sm:size-56" />
          </div>
        )}

        {estado === "iniciando" && (
          <p className="text-muted absolute inset-0 grid place-items-center bg-black/40 text-sm text-white">
            Iniciando cámara…
          </p>
        )}

        {estado === "error" && (
          <p className="absolute inset-0 grid place-items-center bg-black/70 px-6 text-center text-sm text-white">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <p className="text-muted text-sm">
          {estado === "escaneando"
            ? "Apuntá al código QR del mail de confirmación."
            : estado === "error"
              ? "Podés seguir usando el buscador de abajo."
              : ""}
        </p>
        <button
          type="button"
          onClick={onCerrar}
          className="border-border text-fg hover:border-magenta/40 shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors"
        >
          Cerrar cámara
        </button>
      </div>
    </div>
  );
}
