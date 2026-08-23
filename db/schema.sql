-- Esquema de inscripciones — COPAT 3D
-- Ver docs/03-arquitectura.md (modelo de datos) y docs/04-datos-y-legales.md
-- (por qué estos campos y no otros).
--
-- Se corre con `npm run db:migrate`. `IF NOT EXISTS` en todo: el script es
-- idempotente, así que correrlo dos veces no rompe nada — hace falta para
-- que funcione igual en Postgres local (docker compose) y en Neon.

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()

CREATE TABLE IF NOT EXISTS inscripciones (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Corto y legible en voz alta (tipo COPAT-7K2M), no un UUID: es lo que
  -- viaja en el mail y lo que alguien puede tener que dictar por teléfono
  -- o buscar en una lista el día del evento. Ver AGENTS.md, "Ya decidido".
  -- UNIQUE ya crea su propio índice btree: no hace falta uno aparte para
  -- buscar por código (acreditación en puerta, soporte por mail).
  codigo_reserva     TEXT NOT NULL UNIQUE,

  nombre_apellido    TEXT NOT NULL,

  -- UNIQUE evita que la misma persona se registre dos veces. Es DNI y no
  -- rango/opcional: decisión de gestión, ver docs/04 §3.
  dni                TEXT NOT NULL UNIQUE,

  -- Fecha completa, no rango etario: misma decisión que el DNI. Identifica
  -- individualmente a los menores de edad — ver la nota de D5 en docs/04.
  fecha_nacimiento   DATE NOT NULL,

  email              TEXT NOT NULL,
  ciudad             TEXT NOT NULL,
  provincia          TEXT NOT NULL,

  -- Eje temático de mayor interés. Nullable: es el único campo opcional del
  -- formulario. Sin modalidad: el congreso es presencial únicamente, no hay
  -- nada que elegir ahí (ver src/app/registro/page.tsx).
  interes            TEXT,

  -- Ley 25.326: hace falta poder demostrar CUÁNDO se prestó el
  -- consentimiento, no alcanza con un booleano suelto.
  consentimiento     BOOLEAN NOT NULL,
  consentimiento_at  TIMESTAMPTZ NOT NULL,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
