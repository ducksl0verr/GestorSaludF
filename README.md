# GestorSaludF — Frontend de Gestión de Salud

Cliente web del sistema **Oh, Doctor!**, una aplicación académica para administrar
pacientes, turnos, historias clínicas, diagnósticos, recetas, medicamentos,
tratamientos, cirugías, internaciones, obras sociales y facturación.

Este repositorio contiene **solo el frontend**. Consume la API REST del backend
Spring Boot, que se ejecuta por separado en `http://localhost:8080`.

El documento no es un manual de instalación: es una explicación de **cómo está
armado el proyecto y por qué se tomaron las decisiones que se tomaron**. La idea
es que quien llegue después entienda el criterio antes de tocar el código.

---

## Tabla de contenidos

1. [Stack técnico](#stack-técnico)
2. [Puesta en marcha](#puesta-en-marcha)
3. [Scripts disponibles](#scripts-disponibles)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Decisiones de diseño](#decisiones-de-diseño)
   - [Organización por features](#1-organización-por-features)
   - [Rutas por rol](#2-rutas-por-rol)
   - [El patrón `data.base`](#3-el-patrón-databa)
   - [Lazy loading](#4-lazy-loading)
   - [Autenticación y permisos](#5-autenticación-y-permisos)
   - [Interceptor con refresh y cola de requests](#6-interceptor-con-refresh-y-cola-de-requests)
   - [Guards y SSR](#7-guards-y-ssr)
   - [Formularios con Signal Forms](#8-formularios-con-signal-forms)
   - [Servicios por feature](#9-servicios-por-feature)
   - [Layouts por rol](#10-layouts-por-rol)
   - [Sistema visual](#11-sistema-visual)
   - [Contrato con el backend](#12-contrato-con-el-backend)
6. [Limitaciones conocidas y próximos pasos](#limitaciones-conocidas-y-próximos-pasos)
7. [Convenciones para agregar una feature](#convenciones-para-agregar-una-feature)

---

## Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 22.2 | Framework principal, componentes standalone |
| TypeScript | ~6.0 | Tipado del proyecto |
| RxJS | 7.8 | HTTP y flujos asincrónicos |
| `@angular/forms/signals` | 22.2 | Formularios reactivos basados en signals |
| `@angular/ssr` + Express 5 | 22.2 | Server-side rendering |
| Vitest | 5 | Tests unitarios |
| Prettier | 3.8 | Formato (100 columnas, comillas simples) |

No se usa ninguna librería de componentes (Angular Material, Bootstrap, etc.).
La interfaz se construyó con HTML, CSS propio y un sistema de variables.

---

## Puesta en marcha

### Requisitos

- Node.js `^20.19`, `^22.12` o `^24`
- npm 11
- Backend de Gestor de Salud corriendo en `http://localhost:8080`
- Base de datos MySQL con los datos del backend

### Pasos

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

Durante el desarrollo, el frontend **no llama directamente** a `localhost:8080`.
Todas las peticiones van a rutas relativas `/api/...` y el dev server las
redirige mediante `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

El proxy está declarado en `angular.json`, dentro de la configuración de `serve`,
así que se aplica automáticamente con `ng serve`. Esto evita configurar CORS en
el backend y permite que el mismo código funcione en desarrollo y en producción
detrás de un reverse proxy.

> **Importante:** si el backend no está levantado, el login devuelve un error de
> conexión (`status 0`). No es un problema del frontend.

---

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm start` / `ng serve` | Levanta el dev server en `http://localhost:4200` con proxy a `/api` |
| `npm run build` | Compila la aplicación y genera `dist/GestorSaludF` |
| `npm run watch` | Compila en modo desarrollo y queda observando cambios |
| `npm test` | Ejecuta los tests con Vitest |
| `npm run serve:ssr:GestorSaludF` | Sirve el build SSR con `node dist/GestorSaludF/server/server.mjs` |

El build de producción incluye presupuestos de tamaño en `angular.json`
(500 kB de advertencia y 1 MB de error para el bundle inicial).

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/                     # Infraestructura transversal
│   │   ├── guards/               # authGuard, roleGuard, publicoGuard, loginGuard
│   │   ├── interceptors/         # authInterceptor
│   │   ├── models/               # DTOs de autenticación
│   │   ├── services/             # AuthService
│   │   └── RecuperacionContraseña/
│   ├── shared/                   # Componentes reutilizables
│   │   ├── header/
│   │   └── footer/
│   ├── layouts/                  # Cascarones por rol
│   │   ├── public-layout/
│   │   ├── admin-layout/
│   │   ├── administrativo-layout/
│   │   └── prof-layouts/
│   ├── features/                 # Dominios funcionales
│   │   ├── auth/                 # login, registro, Roles
│   │   ├── public/               # home, medicamentos, tratamientos, obras sociales, proveedores
│   │   ├── administrativo/       # pacientes, turnos, consultorios, salas, quirófanos, pagos...
│   │   ├── profesional/          # diagnósticos, historias clínicas, recetas
│   │   └── admin/                # dashboard, usuarios, profesionales
│   ├── app.config.ts             # Providers globales
│   ├── app.config.server.ts      # Configuración SSR
│   ├── app.routes.ts             # Ruteo principal
│   ├── app.routes.server.ts      # Estrategia de renderizado
│   └── app.ts                    # Componente raíz
├── styles.css                    # Sistema visual global "Oh, Doctor!"
├── main.ts                       # Bootstrap del cliente
├── main.server.ts                # Bootstrap del servidor
└── server.ts                     # Servidor Express para SSR
```

Cada feature repite una estructura interna reconocible:

```
Pagina-X/
├── X.routes.ts                   # Rutas hijas de la feature
├── X-lista/                      # Listado
├── X-formulario/                 # Alta y edición
├── X-detalle/                    # Vista de detalle
├── services/X-services.ts        # Acceso HTTP
└── model/X.ts                    # Interfaces y DTOs
```

La repetición es deliberada: si una feature se elimina o se reescribe, se borra
una carpeta completa sin dejar dependencias cruzadas.

---

## Decisiones de diseño

### 1. Organización por features

El proyecto combina dos criterios de organización:

- **Capas horizontales** en `core`, `shared` y `layouts`, para todo lo que es
  infraestructura y se comparte entre dominios.
- **Cortes verticales** en `features`, donde cada dominio agrupa sus rutas,
  componentes, modelos y servicios.

La alternativa clásica —todo separado en `components/`, `services/` y
`models/`— obliga a saltar entre tres carpetas para entender una sola pantalla.
Con el corte por feature, el código que cambia junto vive junto. El costo es que
puede haber servicios parecidos en features distintas, pero esa duplicación es
preferible a un servicio genérico con condicionales por dominio.

`core` no depende de las features de negocio, con una excepción deliberada: el
enum `Roles` de `features/auth` se usa en guards y en `AuthService` para tipar
el rol. Es una dependencia de un tipo compartido, no de componentes. Las
features pueden importar `core` y `shared`. Los layouts resuelven las pantallas
a través del router; el único componente de feature que reutilizan directamente
es `BotonSalir`.

### 2. Rutas por rol

El ruteo principal (`app.routes.ts`) define tres paneles privados y un conjunto
de rutas públicas:

| Prefijo | Rol | Layout |
|---|---|---|
| `/admin` | `ROLE_ADMINISTRADOR` | `AdminLayout` |
| `/administrativo` | `ROLE_ADMINISTRATIVO` | `AdministrativoLayout` |
| `/profesional` | `ROLE_PROFESIONAL` | `ProfLayouts` |
| `/`, `/login`, `/registrar` | Público | `PublicLayout` o componente suelto |

Cada panel declara sus roles permitidos en la ruta padre:

```ts
{
  path: 'profesional',
  loadComponent: () => import('./layouts/prof-layouts/prof-layouts').then(m => m.ProfLayouts),
  canActivate: [authGuard, roleGuard],
  data: {
    roles: [Roles.ROLE_PROFESIONAL],
    base: '/profesional'
  },
  children: [ /* ... */ ]
}
```

La decisión fue **declarar los roles como datos de ruta** en lugar de escribir
condicionales dentro de cada componente. Así el control de acceso queda en un
solo lugar (`roleGuard`), es declarativo y se puede leer junto a la definición
de la ruta.

El rol no se consulta al backend en cada navegación: se lee del JWT que ya está
en `localStorage`. Eso hace la navegación instantánea, a costa de que un cambio
de rol no impacte hasta que se emita un token nuevo (por ejemplo, al volver a
iniciar sesión).

### 3. El patrón `data.base`

Las features de `profesional` no son exclusivas de ese panel: `PACIENTE_ROUTES`,
`MEDICAMENTOS_ROUTES` y `TRATAMIENTOS_ROUTES` se reutilizan en `/admin`,
`/administrativo` y `/profesional`. Por eso los componentes **no hardcodean** el
prefijo de su panel.

Cada ruta padre publica su prefijo:

```ts
data: { base: '/profesional' }
```

Y cada componente lo recupera una sola vez:

```ts
private route = inject(ActivatedRoute);
private base = this.route.snapshot.data['base'];

// luego
this.router.navigate([this.base, 'historiasclinicas']);
```

Esto permite que el mismo formulario de medicamentos funcione en los tres
paneles sin saber en cuál está. Para que `data` esté disponible en rutas hijas
anidadas, `app.config.ts` configura el router con:

```ts
provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }))
```

**Consecuencia:** toda ruta de panel debe declarar `base`. Si se agrega un panel
nuevo y se olvida, las navegaciones posteriores al guardar apuntan a `undefined`
y el usuario termina en una ruta inválida. Es el precio de no repetir strings.

### 4. Lazy loading

Las pantallas de los paneles se cargan con `loadComponent` y `loadChildren`.
El bundle inicial contiene el componente raíz, el header, el footer, el layout
público y las pantallas de autenticación (login, registro y recuperación de
contraseña); el resto se descarga al navegar.

Se aplicó en dos niveles:

- **Rutas de panel:** el layout se carga de forma diferida.
- **Rutas internas:** cada lista, formulario y detalle también.

Las pantallas de autenticación quedaron eager a propósito: son la puerta de
entrada y conviene que estén disponibles sin una descarga adicional. La decisión
del lazy loading responde a que el sistema tiene muchos dominios y un usuario
concreto usa pocos. Un administrativo no necesita descargar el dashboard del
administrador ni las pantallas de quirófanos.

### 5. Autenticación y permisos

`AuthService` concentra el ciclo de sesión:

- `iniciarSesion()` hace `POST /api/auth/iniciar` y guarda `accessToken` y
  `refreshToken` en `localStorage`.
- `refrescarToken()` hace `POST /api/auth/refresh`.
- `cerrarSesion()` limpia ambas claves.
- `estaAutenticado()` verifica que exista un access token.

Los datos del usuario **no se piden a un endpoint aparte**: se decodifican del
payload del JWT. `getPayload()` convierte el base64url a JSON y de ahí salen:

```ts
getRol(): Roles | null
getPermisos(): string[]
tienePermiso(permiso: string): boolean
rutaInicio(): string
```

`rutaInicio()` mapea el rol a su panel (`/admin`, `/administrativo`,
`/profesional`) y se usa después del login y en las redirecciones de los guards.

La decisión de leer el token en el cliente tiene una consecuencia operativa
importante: **los permisos quedan congelados en el JWT emitido**. Si se agrega un
permiso a un rol en la base de datos, el usuario debe obtener un token nuevo
(cerrar sesión y volver a entrar) para que el cambio tenga efecto. Esto explica
varios `403` que parecen errores de configuración cuando en realidad son tokens
viejos.

`tienePermiso()` está disponible para ocultar acciones en la interfaz, aunque
hoy el control efectivo de acceso está en el backend (`@PreAuthorize`) y en
`roleGuard`. Ocultar un botón es una mejora de experiencia, no una medida de
seguridad.

### 6. Interceptor con refresh y cola de requests

`authInterceptor` es funcional y se registra en `app.config.ts` con
`withInterceptors`.

Su comportamiento:

1. Si la URL contiene `/api/auth`, deja pasar la request sin token. Evita un
   bucle al refrescar.
2. En cualquier otra request agrega `Authorization: Bearer <accessToken>`.
3. Si la respuesta es `401`, intenta refrescar el token una sola vez.
4. Si el refresh falla, limpia la sesión y redirige a `/login`.
5. Si llegan **varios 401 en paralelo**, solo se dispara un refresh. Las demás
   requests esperan en un `BehaviorSubject` y se reintentan con el token nuevo.

El problema que resuelve la cola es concreto: al entrar a una pantalla que hace
tres o cuatro peticiones simultáneas con el token vencido, sin coordinación se
dispararían tres o cuatro refresh, y el backend invalidaría los refresh tokens
anteriores. El resultado sería un cierre de sesión aleatorio. Con la bandera
`refrescando` y el subject compartido, el refresh es único y las requests se
reintentan en orden.

**Consecuencia:** el interceptor no reintenta errores `403`. Un `403` significa
que el token es válido pero no tiene el permiso; refrescarlo no cambia nada y
podría generar bucles. Para ese caso, la solución es revisar los permisos del
rol y volver a iniciar sesión.

### 7. Guards y SSR

Hay cuatro guards en `core/guards`:

| Guard | Función |
|---|---|
| `authGuard` | Exige sesión iniciada; si no, redirige a `/login` |
| `roleGuard` | Compara el rol del JWT con `route.data['roles']` |
| `publicoGuard` | Si ya hay sesión, expulsa al panel correspondiente |
| `loginGuard` | Helper que redirige según haya sesión o no (no está cableado en las rutas actuales) |

Todos empiezan con la misma guarda:

```ts
if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
```

Durante el renderizado en servidor no existe `localStorage` ni un usuario real.
Si los guards evaluaran la sesión en el servidor, todas las rutas privadas
redirigirían a `/login` y el HTML inicial sería el del login, aunque el cliente
tuviera sesión. Devolver `true` en SSR deja que el cliente hidrate y tome la
decisión con el token real.

La aplicación usa SSR con `RenderMode.Client` para **todas** las rutas
(`app.routes.server.ts`). Es decir, el servidor Express entrega el shell de la
aplicación y el renderizado real ocurre en el navegador. La razón es que casi
todas las pantallas dependen de autenticación y datos en vivo; prerenderizarlas
no aporta nada y genera problemas de hidratación. El SSR queda disponible para
infraestructura y para el shell inicial, no como estrategia de contenido.

### 8. Formularios con Signal Forms

Los formularios usan la API de Signal Forms de Angular 22
(`@angular/forms/signals`). El patrón es siempre el mismo:

```ts
modelo = signal<MedicamentoNuevo>({ /* valores iniciales */ });

formulario = form(this.modelo, (campo) => {
  required(campo.nombre, { message: 'El nombre es obligatorio.' });
  min(campo.stock, 0, { message: 'El stock no puede ser negativo.' });
});
```

En el template se enlaza con `[formField]` y se leen los errores desde el mismo
signal:

```html
<input type="text" [formField]="formulario.nombre" />

@if (formulario.nombre().touched() && formulario.nombre().invalid()) {
  @for (error of formulario.nombre().errors(); track error) {
    <small>{{ error.message }}</small>
  }
}
```

La decisión de usar Signal Forms en lugar de `ReactiveFormsModule` fue
aprovechar el modelo reactivo nativo de Angular 22: el estado del formulario es
un signal, la validez se lee sin suscripciones y el template se actualiza solo.
También permite validar arrays dinámicos con `applyEach`, como los detalles de
una receta:

```ts
applyEach(schema.detalles, (detalle) => {
  required(detalle.dosis);
  required(detalle.frecuencia);
  min(detalle.cantidad, 1);
  min(detalle.id_medicamento, 1);
});
```

Los arrays se agregan y eliminan actualizando el signal con `update`, sin
`FormArray` ni `push`/`removeAt`. Es menos ceremonial, pero exige recordar que
**el modelo y el formulario comparten la misma fuente de verdad**: no hay que
sincronizar dos estructuras.

### 9. Servicios por feature

Cada feature tiene su propio servicio `providedIn: 'root'`, con un `HttpClient`
inyectado y una constante `API_URL`:

```ts
@Injectable({ providedIn: 'root' })
export class HistoriaClinicaService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/historiasClinicas';

  getHistoriasClinicas() { /* ... */ }
  getHistoriaClinica(id: number) { /* ... */ }
  guardarHistoriaClinica(historia: HistoriaClinicaNueva) { /* ... */ }
}
```

Los servicios no arman mensajes de error ni navegan. Solo devuelven
`Observable<T>`. La decisión es que el componente sea dueño del estado de la
pantalla (`cargando`, `error`) y de la navegación posterior; el servicio queda
como una traducción fina entre el componente y la API.

**Consecuencia:** hay lógica repetida de `subscribe({ next, error })` en cada
componente. Se aceptó a cambio de que cada pantalla controle su propio feedback
y no haya un manejador global que oculte el contexto del error.

### 10. Layouts por rol

Cada panel tiene su layout con la misma anatomía:

```
.od-layout
├── .od-layout__banner      → título del panel + botón de cerrar sesión
└── .od-layout__body
    ├── .od-sidebar         → navegación lateral
    └── .od-main            → <router-outlet>
```

Los layouts no contienen lógica de negocio: solo navegación, título y el botón
`app-boton-salir`. El menú de cada panel lista únicamente las secciones que ese
rol puede usar, pero **la restricción real la aplica `roleGuard`**, no la
ausencia del link. Un usuario que escriba la URL a mano sigue siendo bloqueado.

Se prefirió un layout por rol en lugar de un layout único con menús
condicionales porque los tres paneles tienen navegaciones muy distintas y
comparten poco más que la estructura visual.

### 11. Sistema visual

La identidad "Oh, Doctor!" vive en `src/styles.css` como variables CSS:

```css
:root {
  --od-teal: #17706C;
  --od-orange: #D9701F;
  --od-cream: #F6F5F0;
  --od-text: #1F2D2B;
  --od-radius: 18px;
  --od-shadow: 0 12px 32px rgba(23, 112, 108, 0.12);
}
```

Los componentes usan clases semánticas (`od-layout`, `od-sidebar`, `od-main`,
`boton-agregar`, `acciones`) y no colores literales. Cambiar la paleta o los
radios se hace en un solo archivo.

La decisión de no usar una librería de componentes fue mantener control total
sobre la estética y evitar un bundle grande para una aplicación académica. El
costo es que tablas, formularios y botones se estilizan a mano; por eso el CSS
global define estilos base para `table`, `form`, `input` y botones dentro de
`.od-main`.

### 12. Contrato con el backend

#### Rutas exactas, no rutas "parecidas"

El backend expone nombres inconsistentes:

| Recurso | Endpoint |
|---|---|
| Historias clínicas | `/api/historiasClinicas` (camelCase) |
| Diagnósticos | `/api/diagnosticos` |
| Medicamentos | `/api/medicamentos` |

Al principio el frontend llamaba a `/api/historias-clinicas`. El backend
devolvía `404`, el frontend redirigía a `/error` y esa ruta, al no estar
autenticada, terminaba mostrando un `401`. El síntoma parecía un problema de
permisos cuando en realidad era una URL mal escrita.

**Lección documentada:** ante un `401` inesperado, primero verificar que la URL
exista y que `/error` esté permitido en el backend. Un `404` puede disfrazarse de
`401` si el manejo de errores redirige a una pantalla protegida.

#### Recetas sin edición ni borrado

El backend no tiene `PUT` ni `DELETE` para recetas. Por eso el frontend solo
ofrece **crear, listar y ver detalle**. Se eliminaron la ruta de edición, los
botones y la lógica asociada.

La decisión fue no mostrar acciones que el backend no puede cumplir. Un botón
de "Editar" que devuelve `405 Method Not Allowed` es peor que la ausencia del
botón. Si en el futuro se agregan esos endpoints, la feature se amplía sin
cambiar el resto del panel.

#### Creación anidada de diagnósticos

Al crear una historia clínica se pueden cargar diagnósticos en la misma
operación. El DTO `HistoriaClinicaNueva` incluye dos campos:

```ts
{
  fecha, observaciones, evolucion, id_paciente, id_profesional,
  ids_diagnosticos: number[],              // vincular diagnósticos existentes
  diagnosticos: DiagnosticoDeHistoriaNueva[] // crear diagnósticos nuevos
}
```

Cada diagnóstico nuevo lleva `nombre`, `descripcion` y `fechaDiagnostico`. El
backend guarda la historia y crea los diagnósticos vinculados **en una misma
transacción**: si falla la creación de un diagnóstico, no queda una historia a
medias.

En el formulario, las filas se agregan y eliminan dinámicamente. Antes de
enviar se valida que todas tengan nombre, descripción y fecha; si falta alguna,
se muestra un error y no se hace la petición. En modo edición solo se permiten
`observaciones` y `evolucion`: fecha, paciente y profesional quedan
deshabilitados porque el backend no los actualiza.

La alternativa —crear primero la historia y después cada diagnóstico con
llamadas separadas— se descartó por el riesgo de estados inconsistentes y por la
peor experiencia de usuario ante un fallo parcial.

---

## Limitaciones conocidas y próximos pasos

Estas son decisiones pendientes, no defectos ocultos:

1. **Fechas de medicamentos.** El formulario usa `type="text"` con placeholder
   `28/07/2030`, pero el backend espera ISO `yyyy-MM-dd`. Escribir el formato con
   barras devuelve `400`. La mejora es usar `type="date"` o convertir el valor
   antes de enviar.
2. **Permisos en la interfaz.** `tienePermiso()` existe pero todavía no se usa
   para ocultar botones. Hoy un usuario sin `CREAR_MEDICAMENTO` ve el formulario
   y recibe `403` al guardar. Ocultar la acción mejoraría la experiencia, aunque
   el backend seguiría siendo la autoridad.
3. **Feedback de errores.** Algunos flujos usan `alert()` y otros muestran un
   párrafo de error. Conviene unificar con un componente de notificaciones.
4. **Cobertura de tests.** Hay specs generados y algunos tests de guards, pero
   no hay cobertura sistemática de servicios ni formularios.
5. **`loginGuard` sin cablear.** El guard existe y está testeado, pero las rutas
   usan `publicoGuard`. Vale la pena unificar el criterio o eliminar el que no
   se usa.
6. **Roles en el backend.** Si se recrean los roles, algunos permisos cargados
   manualmente en la base se pierden. El frontend no puede resolverlo; hay que
   ajustar la inicialización de roles en el backend.

---

## Convenciones para agregar una feature

1. Crear `src/app/features/<capa>/Pagina-<Nombre>/`.
2. Definir el modelo en `model/<nombre>.ts`.
3. Crear el servicio en `services/<nombre>-services.ts` con su `API_URL`.
4. Crear los componentes `lista`, `formulario` y `detalle` como standalone.
5. Declarar las rutas en `<nombre>.routes.ts` usando `loadComponent`.
6. Montar las rutas dentro del panel correspondiente en `app.routes.ts`.
7. En los componentes, obtener el prefijo con
   `private base = this.route.snapshot.data['base']` y navegar con
   `[this.base, '<seccion>']`.
8. Agregar el link al layout del rol si corresponde.
9. Usar `form()` y `FormField` para los formularios, y `cargando`/`error` como
   signals locales.
10. Verificar el nombre exacto del endpoint en el backend antes de escribir la
    URL.

---

## Contexto académico

Proyecto desarrollado para la materia **Programación III**. El frontend y el
backend se mantienen en repositorios separados y se comunican exclusivamente por
HTTP. La prioridad del trabajo fue cubrir los flujos completos de cada rol con
una arquitectura explícita y defendible, no acumular pantallas sin criterio.
