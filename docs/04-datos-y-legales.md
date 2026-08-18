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

Texto de referencia sugerido (**debe validarlo el área legal de la AIF antes de publicar**):

> Presto mi consentimiento libre, expreso e informado para que la Agencia de Innovación de Fuego (AIF) trate mis datos personales con la finalidad exclusiva de gestionar mi inscripción y acreditación al congreso COPAT 3D. Los datos no serán cedidos a terceros sin mi consentimiento previo. Podré ejercer mis derechos de acceso, rectificación y supresión conforme a la Ley 25.326 escribiendo a copat3d@aif.gob.ar.

La cláusula legal obligatoria que debe figurar visible:

> El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326.

### 2. ⛔ Definir la finalidad y no excederla

Si los datos se recolectan "para inscripción al congreso", **no pueden después usarse** para enviar publicidad de sponsors ni cederse a empresas participantes. Si la AIF quiere hacer eso, tiene que estar declarado en el consentimiento desde el día uno.

**Pregunta directa para la AIF:** ¿los datos de inscriptos se comparten con sponsors o empresas? La respuesta cambia el texto legal.

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

### 4. Menores de edad

Si el congreso admite estudiantes secundarios, hay inscriptos menores de 18. El consentimiento de un menor **no es válido por sí solo**. Opciones:

- **(a)** Restringir el registro individual a mayores de 18 y canalizar a los colegios por inscripción institucional (un docente responsable inscribe al grupo). ← *recomendada, mucho más simple*
- **(b)** Implementar consentimiento parental, con la complejidad de verificación que eso implica.

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

## Checklist previo a publicar el formulario

- [ ] Texto de consentimiento validado por legales de la AIF
- [ ] Definido si se ceden datos a sponsors
- [ ] Decidido: fecha de nacimiento exacta vs. rango etario
- [ ] Decidido: política para menores de edad
- [ ] Confirmado si el DNI es realmente necesario
- [ ] Página `/privacidad` publicada
- [ ] Base registrada ante la AAIP (o confirmado que ya está cubierta)
- [ ] Definido plazo de retención
