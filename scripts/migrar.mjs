#!/usr/bin/env node
/**
 * Aplica db/schema.sql contra DATABASE_URL.
 *
 * Uso: npm run db:migrate
 *
 * No es un sistema de migraciones con versionado (no hace falta con una
 * sola tabla, ver AGENTS.md "Sin ORM"): el propio schema.sql usa
 * `IF NOT EXISTS` en todo, así que correr este script de nuevo no rompe
 * nada. Si el modelo cambia, se edita schema.sql y se vuelve a correr acá
 * y en Neon.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Client } from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "Falta DATABASE_URL. Cargala en .env.local o exportala antes de correr este script.",
  );
  process.exit(1);
}

const sql = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8");

const client = new Client({ connectionString });

try {
  await client.connect();
  console.log("Conectado. Aplicando db/schema.sql…");
  await client.query(sql);
  console.log("Listo: la tabla `inscripciones` existe y está al día.");
} catch (error) {
  console.error("Falló la migración:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
