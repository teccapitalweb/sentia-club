# Reglas de Firestore

`firestore.rules` protege los datos del Club por encima de la interfaz web.
Antes de desplegarlo, asigna el custom claim `admin: true` a cada administrador
actual usando la utilidad del repositorio `sentia-academy-webhook`.

Las reglas siguen este principio:

- Un miembro solo consulta y actualiza nombre/datos de perfil permitidos; no
  puede activar su membresía, cambiar su plan ni editar notificaciones.
- El administrador realiza altas, regalos, cancelaciones y bajas de miembros
  mediante el webhook; el navegador no puede editar vencimientos, planes ni
  eliminar documentos de membresía directamente.
- Precios y enlaces de `config/club` se validan y guardan desde el webhook;
  Firestore solo conserva lectura pública para mostrar precios y contacto.
- Las fichas no visibles del directorio solo las ve su titular o un
  administrador; el listado de miembros solo solicita fichas públicas.
- Solo un administrador modifica membresías, cursos, precios y webinars desde
  el panel. Las notificaciones globales se crean o eliminan mediante el
  webhook, nunca con escritura directa desde el navegador.
- Los certificados se verifican por folio mediante el webhook, pero no se
  crean ni se consultan directamente desde el navegador, ni siquiera desde
  una sesión administradora.
- Railway registra el avance autenticado y emite automáticamente un único
  certificado cuando valida todas las clases y actividades del curso.
- Las publicaciones, reacciones y comentarios del foro se procesan mediante
  Railway; las reglas no permiten que el navegador altere sus contadores ni
  suplante la identidad de otra persona.
- Las solicitudes manuales antiguas se conservan solo para consulta durante la
  migración; el cliente ya no puede crear nuevas.
- Todo acceso no listado se bloquea.

Al cerrar la bienvenida de una activación, el panel llama al webhook
`POST /api/notificaciones/marcar-mostrada`. Esa ruta valida el token y solo
marca ese aviso concreto como visto; no abras de nuevo ese permiso en las
reglas de Firestore.

Para publicar las reglas desde un equipo autorizado con Firebase CLI:

```powershell
firebase use sentia-academy
firebase deploy --only firestore:rules
```

No las publiques hasta desplegar primero el webhook que incluye
`POST /api/cursos/progreso`, `POST /api/notificaciones/marcar-mostrada` y las
rutas administrativas de notificaciones;
esas reglas bloquean por completo las escrituras de certificados y de datos
sensibles de membresía desde el navegador.
