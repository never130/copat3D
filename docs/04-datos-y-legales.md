# 04 — Datos Personales y Obligaciones Legales

> **Este documento es bloqueante.** El formulario de registro no puede publicarse sin resolver los puntos marcados como ⛔.

## Por qué importa acá más que en un sitio común

El formulario recolecta **DNI + fecha de nacimiento + email + ciudad**. Esa combinación identifica unívocamente a una persona física y constituye **dato personal** bajo la **Ley 25.326 de Protección de Datos Personales** de Argentina.

Además, el responsable del tratamiento es un **organismo público provincial** (AIF, `aif.gob.ar`). Los organismos públicos tienen obligaciones más estrictas que un privado: los datos solo pueden usarse para la finalidad declarada y en el marco de su competencia legal.

No es un trámite formal: la AAIP (Agencia de Acceso a la Información Pública) es la autoridad de aplicación y puede sancionar.

## Obligaciones concretas

### 1. ⛔ Consentimiento expreso e informado

El registro debe incluir un **checkbox no pre-tildado** con texto que declare, como mínimo:

- Quién es el responsable de la base (AIF, con domicilio).
- Con qué finalidad se recolectan los datos (inscripción y acreditación a COPAT 3D).
- Si se ceden a terceros y a quiénes (¿sponsors? ¿Eventbrite? — **esto hay que definirlo**).
- Que el titular puede ejercer sus derechos de acceso, rectificación y supresión.

> ✅ **Texto cargado en el formulario (23/8/2026), confirmado por gestión —
> Ever Loza.** Es el que está en producción hoy en
> [RegistroForm.tsx](../src/components/sections/RegistroForm.tsx), con el
> domicilio de la AIF completado (Av. Maipú 1255, Ushuaia). Sigue pendiente que
> el área legal de la AIF lo revise formalmente antes de considerar D3
> cerrada del todo — la confirmación de gestión alcanza para tener el
> formulario funcionando, no reemplaza esa revisión.

Texto de referencia sugerido, ya actualizado con las respuestas de D2 y D4:

> Presto mi consentimiento libre, expreso e informado para que la Agencia de Innovación Fueguina (AIF), con domicilio en Av. Maipú 1255, Ushuaia, Tierra del Fuego, trate mis datos personales con la finalidad exclusiva de gestionar mi inscripción y acreditación al congreso COPAT 3D. Los datos no serán cedidos a terceros. Podré ejercer mis derechos de acceso, rectificación y supresión conforme a la Ley 25.326 escribiendo a copat3d@aif.gob.ar.

La cláusula legal obligatoria que debe figurar visible:

> El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326.

### 2. ✅ Definir la finalidad y no excederla

Si los datos se recolectan "para inscripción al congreso", **no pueden después usarse** para enviar publicidad de sponsors ni cederse a empresas participantes. Si la AIF quiere hacer eso, tiene que estar declarado en el consentimiento desde el día uno.

> ✅ **Resuelto (23/8/2026, Ever Loza): no se ceden datos a sponsors ni a
> ninguna otra organización.** El texto de consentimiento (§1) y
> `/privacidad` ya lo reflejan.

### 3. Minimización — el punto técnico más importante

**Solo pedir lo que se usa.** Cada campo extra es riesgo legal sin contrapartida.

| Campo | ¿Se justifica? |
|---|---|
| Nombre y apellido | Sí — acreditación |
| DNI | Sí — **si y solo si** hay control de acceso en puerta. Si no lo hay, **sacarlo** |
| Email | Sí — confirmación e info del evento |
| Ciudad / provincia | Sí — métrica de alcance territorial, justificable |
| Fecha de nacimiento | ⚠️ **Cuestionable.** ¿Para qué se usa? Si es solo demografía, pedir franja etaria (rango) en vez de fecha exacta: cumple el objetivo estadístico con muchísimo menos riesgo |

> **Recomendación técnica:** reemplazar `fecha_nacimiento` (dato exacto) por `rango_etario` (`<18`, `18-25`, `26-40`, `41-60`, `60+`) salvo que exista una razón concreta para la fecha exacta. Si hay menores de edad entre los asistentes, la fecha exacta además dispara la necesidad de **consentimiento de padre/madre/tutor**, lo que complica el flujo considerablemente.

> ✅ **Decidido (gestión, no legales): se piden los dos.** El formulario va a
> pedir DNI siempre —no solo si hay control de acceso en puerta— y fecha de
> nacimiento completa, no rango. Es una decisión de negocio, distinta de la
> recomendación técnica de arriba, que queda documentada porque el
> razonamiento sigue siendo válido para entender el riesgo que se acepta.
>
> Consecuencia directa: con fecha completa, cualquier inscripto menor de 18
> queda identificado individualmente. Eso saca a **"Menores de edad" (§4) de
> ser un tema que se cierra solo** si el congreso no convoca secundarios —hay
> que resolverlo sí o sí antes de recibir el primer registro.

### 4. ✅ Menores de edad

Si el congreso admite estudiantes secundarios, hay inscriptos menores de 18. El consentimiento de un menor **no es válido por sí solo**. Opciones:

- **(a)** Restringir el registro individual a mayores de 18 y canalizar a los colegios por inscripción institucional (un docente responsable inscribe al grupo). ← *recomendada, mucho más simple*
- **(b)** Implementar consentimiento parental, con la complejidad de verificación que eso implica.

> ✅ **Resuelto (23/8/2026, Ever Loza): opción (a).** El congreso no apunta a
> menores de edad, así que no hace falta un flujo de consentimiento
> parental. Ya está implementado en
> [validation.ts](../src/lib/validation.ts) y
> [registro.ts](../src/actions/registro.ts): el sistema calcula la edad a
> partir de la fecha de nacimiento y **bloquea el guardado** de cualquier
> inscripto menor de 18, mostrando el mensaje de coordinar por mail la
> inscripción institucional. Ningún dato de un menor llega a guardarse.

### 5. Seguridad de los datos

Medidas ya contempladas en la arquitectura:

- Conexión TLS obligatoria (Vercel + Cloudflare Full Strict).
- Base de datos con credenciales en variables de entorno, nunca en el repositorio.
- Sin logging de datos personales: **jamás** un `console.log(formData)` en producción.
- Acceso a la base limitado a quienes lo necesiten en la AIF.
- Rate limiting en el formulario para evitar scraping y cargas masivas.

### 6. Registro de la base ante la AAIP

La Ley 25.326 exige inscribir las bases de datos personales en el **Registro Nacional de Bases de Datos** de la AAIP. Un organismo público generalmente ya tiene bases registradas.

**Pregunta para la AIF:** ¿la base de inscriptos se cubre con una inscripción existente o hay que registrar una nueva?

### 7. Retención y baja

Definir **por cuánto tiempo** se guardan los datos después del evento. No pueden conservarse indefinidamente: la ley exige suprimirlos cuando dejan de ser necesarios para la finalidad.

**Sugerencia:** conservar 12 meses post-evento (para la edición siguiente) y luego anonimizar, conservando solo agregados estadísticos (cuántos de cada ciudad, etc.), que no son dato personal.

## Página de Política de Privacidad

El sitio necesita `/privacidad` con: responsable, finalidad, destinatarios, derechos del titular, plazo de conservación y contacto. Debe enlazarse desde el footer y desde el propio formulario.

## Mapa de Google en la sección de sede

La sección de sede embebe un mapa de Google (`Sede.tsx`). Es el embed público, sin clave de API, pero **igual carga recursos de Google y deja cookies de terceros** en el navegador de quien visita, antes de cualquier consentimiento.

No es dato personal recolectado por la AIF —el sitio no recibe nada—, pero sí es seguimiento de un tercero en un sitio cuyo responsable es un organismo público. Es una decisión de la AIF, no técnica.

Tres caminos, de menor a mayor fricción:

1. **Dejarlo como está.** Es lo que hace la mayoría de los sitios públicos argentinos. Cero fricción para el visitante.
2. **Carga con clic.** Mostrar una imagen estática del mapa y cargar el iframe solo si la persona lo pide. Nada de Google hasta que haya una acción explícita.
3. **Sin Google.** Reemplazar por OpenStreetMap, que no rastrea. Menos familiar de usar y con menos detalle en Ushuaia.

Ya está aplicado `loading="lazy"`, así que el mapa no se descarga hasta que alguien scrollea cerca: quien no llega a esa sección nunca contacta a Google. Eso reduce el alcance, pero no lo elimina.

**Pregunta para la AIF:** ¿alcanza con la carga diferida o se prefiere carga con clic?

## Formulario de contacto (publicado)

A diferencia del de registro, el formulario de contacto **sí está publicado**.
La diferencia no es de criterio sino de datos: solo pide nombre, correo, asunto
y mensaje. No hay DNI, no hay fecha de nacimiento, no hay dato sensible, y la
finalidad —responder la consulta— se agota en el propio acto de responder.

Decisiones tomadas ahí:

- **Nada se guarda en base.** El mensaje viaja por Resend a la casilla
  institucional y no queda copia en el sitio. Sin base, no hay base que
  registrar ni que dar de baja.
- **Antispam sin captcha.** Se usa un campo trampa (*honeypot*) invisible en
  lugar de reCAPTCHA. Un captcha manda datos del visitante a un tercero —
  justamente lo que esta política trata de minimizar— y es una carga de
  accesibilidad para quien usa lector de pantalla.
- **El límite de envíos es por instancia**, en memoria. Frena el reenvío
  accidental, no a un atacante decidido. Un límite real necesita almacén
  compartido (Upstash Redis); queda como decisión, no se agregó un servicio
  más por cuenta propia.

## Estado de la página `/privacidad`

Está **escrita y publicable, pero es un borrador técnico**: cubre la estructura
que pide la ley y describe con exactitud lo que el sitio hace hoy, con la
cláusula del art. 14 inc. 3 incluida.

✅ **La sección de registro de inscriptos ya está agregada** (23/8/2026): DNI,
fecha de nacimiento, la restricción a mayores de 18, y los proveedores
técnicos (Neon, Resend). Era el requisito de la trampa de arriba —"antes de
recolectar el primer dato"— y ya se cumplió.

⛔ **Sigue faltando que el área legal de la AIF la valide antes de darla por
definitiva.** El contenido está completo y correcto según lo que el sitio
hace hoy, pero eso no reemplaza la revisión legal formal.

## Checklist previo a publicar el formulario

- [ ] Texto de consentimiento validado **formalmente por legales de la AIF** — hay un texto cargado y confirmado por gestión (23/8), pero eso no reemplaza la revisión legal (ver §1)
- [x] ~~Definido si se ceden datos a sponsors~~ → **no se ceden** (23/8/2026, ver §2)
- [x] ~~Decidido: fecha de nacimiento exacta vs. rango etario~~ → **fecha completa** (ver §3)
- [x] ~~Decidido: política para menores de edad~~ → **registro individual solo para mayores de 18**, implementado (23/8/2026, ver §4)
- [x] ~~Confirmado si el DNI es realmente necesario~~ → **sí, siempre** (ver §3)
- [x] Página `/privacidad` publicada — actualizada el 23/8 con la sección de inscriptos
- [ ] Base registrada ante la AAIP (o confirmado que ya está cubierta)
- [ ] Definido plazo de retención — `/privacidad` ya usa el default recomendado (12 meses), pero no está confirmado explícitamente por la AIF
