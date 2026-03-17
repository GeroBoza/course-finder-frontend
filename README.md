# Frontend - Cursos Platform (CapaContinua)

Documento de contexto del proyecto frontend. Usar este README como referencia al implementar cambios, nuevas pantallas o componentes para mantener coherencia con la arquitectura y convenciones existentes.

---

## 1. Arquitectura general

- **Framework:** Next.js 14 con **App Router** (`src/app/`).
- **Lenguaje:** TypeScript en modo estricto.
- **Estilos:** Tailwind CSS; estilos globales y utilidades en `src/app/globals.css`.
- **Estado:** Solo React (useState, useEffect). No hay librerías de estado global ni de datos (React Query, SWR, etc.).
- **Datos:** Capa de servicios que consumen la API REST del backend NestJS mediante `fetch`. Los servicios devuelven directamente los datos (`.data` de la respuesta).

**Flujo de datos:** Páginas (Server o Client) → servicios (`src/services/*`) → `fetchApi` (`src/services/api.ts`) → backend. Tipos compartidos en `src/types/index.ts`.

---

## 2. Estructura del proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz MÍNIMO (solo html/body + globals.css)
│   │   ├── globals.css
│   │   ├── (public)/               # Route group público — URLs sin prefijo
│   │   │   ├── layout.tsx          # Layout con Navbar + main + Footer
│   │   │   ├── page.tsx            # Home (/)
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx        # Listado con filtros y paginación (/courses)
│   │   │   │   └── [id]/page.tsx   # Detalle de curso + formulario inscripción
│   │   │   ├── organizations/page.tsx
│   │   │   └── about/page.tsx
│   │   └── dashboard/              # Área privada (sin Navbar/Footer público)
│   │       ├── layout.tsx          # Auth guard + DashboardSidebar + top bar
│   │       ├── page.tsx            # Dashboard home (acciones rápidas)
│   │       └── courses/
│   │           └── new/page.tsx    # Formulario de creación de curso
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CourseCard.tsx
│   │   ├── CategoryBadge.tsx
│   │   ├── CourseCarousel.tsx
│   │   └── DashboardSidebar.tsx    # Sidebar del panel de administración
│   ├── services/
│   │   ├── api.ts                  # fetchApi<T> y API_BASE_URL
│   │   ├── auth.service.ts         # Mock de autenticación (getCurrentUser, isAdmin)
│   │   ├── courses.service.ts      # getAll, getById, create
│   │   ├── categories.service.ts
│   │   ├── organizations.service.ts
│   │   └── course-leads.service.ts
│   └── types/
│       └── index.ts                # Interfaces y tipos compartidos
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json                   # Alias: "@/*" → "./src/*"
```

- **Importaciones:** Usar siempre el alias `@/` para referenciar `src/` (ej: `@/components/Button`, `@/types`, `@/services/api`).
- **Componentes:** Un componente por archivo, exportación por defecto. Sin barriles (`index.ts`) en `components/`.

---

## 3. Rutas y páginas

### Área pública — route group `(public)`

El group `(public)` no agrega segmento a la URL. Todas las rutas dentro siguen siendo `/`, `/courses`, etc.

| Ruta | Archivo | Tipo | Descripción |
|------|---------|------|-------------|
| `/` | `(public)/page.tsx` | Server | Home: hero, SearchBar, CourseCarousel (destacados), categorías |
| `/courses` | `(public)/courses/page.tsx` | Client | Listado con filtros (categoría, organización), grid de CourseCard, paginación por query |
| `/courses/[id]` | `(public)/courses/[id]/page.tsx` | Client | Detalle de curso + formulario de inscripción |
| `/organizations` | `(public)/organizations/page.tsx` | Server | Listado de organizaciones |
| `/about` | `(public)/about/page.tsx` | Server | Contenido estático "Acerca de" |

### Panel de administración — `dashboard/`

Ruta privada. El layout verifica que el usuario sea admin antes de renderizar.

| Ruta | Archivo | Tipo | Descripción |
|------|---------|------|-------------|
| `/dashboard` | `dashboard/page.tsx` | Server | Home del panel: acciones rápidas |
| `/dashboard/courses/new` | `dashboard/courses/new/page.tsx` | Client | Formulario de creación de curso |

### Layouts

- **`app/layout.tsx` (raíz):** Solo `html` > `body` + `globals.css`. Sin Navbar ni Footer; es el mínimo necesario para que los layouts anidados funcionen.
- **`app/(public)/layout.tsx`:** Agrega `Navbar` + `<main>` + `Footer`. Solo aplica al grupo público.
- **`app/dashboard/layout.tsx`:** Client Component. Ejecuta `authService.getCurrentUser()` y `isAdmin()`; si falla redirige a `/`. Renderiza `DashboardSidebar` + top bar + `<main>`.
- **Server vs Client:** Páginas con `useRouter`, `useSearchParams`, `useParams`, `useState` o `useEffect` requieren `'use client'` al inicio.

---

## 4. Componentes: convenciones

- **Props:** Interfaces definidas en el mismo archivo (ej: `ButtonProps`, `CourseCardProps`). Incluir `className?: string` cuando el componente deba ser estilizable desde fuera.
- **Variantes:** Componentes como `Button` usan props de variante/tamaño y mapean a clases Tailwind (`variant='primary' | 'secondary' | 'outline'`, `size='sm' | 'md' | 'lg'`).
- **Composición:** Componentes de presentación reciben datos ya preparados (ej: `CourseCard` recibe `course: Course`). La lógica de "qué mostrar" se resuelve dentro del componente.
- **Enlaces:** Navegación con `next/link`. `Button` admite `href` opcional y se renderiza como Link cuando se pasa.
- **Imágenes:** Next.js `Image` para assets locales (ej: logo); `<img>` para URLs externas (API).
- **Client Components:** Solo donde hace falta interactividad: `SearchBar`, `CourseCarousel`, páginas de cursos (listado y detalle), `DashboardSidebar` y formularios del dashboard.

### DashboardSidebar

Recibe `user: AdminUser`. Usa `usePathname` para marcar el ítem activo. Los `navItems` están definidos en el mismo archivo con `label`, `href`, `icon` y opcionalmente `children` (sub-ítems que se muestran al estar activo el padre). Para agregar nuevas secciones al panel, extender el array `navItems`.

---

## 5. Servicios y API

- **Base:** `src/services/api.ts` define `API_BASE_URL` y `fetchApi<T>(endpoint, options?)`. La respuesta del backend tiene forma `{ status, data }`; los servicios retornan `response.data`.
- **Servicios existentes:**
  - **authService:** `getCurrentUser()` → `AdminUser | null` (mock), `isAdmin(user)` → boolean.
  - **coursesService:** `getAll(filters?)`, `getById(id)`, `create(dto: CreateCourseDto)`.
  - **categoriesService:** `getAll()`.
  - **organizationsService:** `getAll()`, `getById(id)`.
  - **courseLeadsService:** `create(data: CreateCourseLeadDto)` (POST).
- Los servicios son objetos con métodos async (no clases). Se importan directamente: `import { authService } from '@/services/auth.service'`.

### Auth (mock)

`authService` está en `src/services/auth.service.ts`. Actualmente devuelve siempre un usuario admin hardcodeado (simula un delay de 300 ms). Cuando el backend de auth esté disponible, reemplazar `getCurrentUser()` por la llamada real a la API (ej: `GET /auth/me` con el token del header/cookie).

---

## 6. Tipos (`src/types/index.ts`)

- **Entidades:** `Course`, `CourseImage`, `CourseCategory`, `Category`, `Organization`, `User`, `CourseLead`.
- **DTOs:** `CreateCourseLeadDto`, `FilterCourseDto`, `CreateCourseDto`.
- **Respuestas:** `CoursesResponse` (data, total, page, limit, totalPages).
- **Auth:** `AdminRole` (`'admin' | 'user'`), `AdminUser` (id, fullName, email, role, isActive).

Mantener tipos alineados con el backend; si la API cambia, actualizar primero `types/index.ts` y luego servicios y componentes.

---

## 7. Estilos y diseño

- **Tailwind:** Clases utility-first. Contenedores públicos: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Dashboard: `p-8` en el `<main>`.
- **Tema (`tailwind.config.ts`):** Colores `primary` (escala 50–900), animaciones (`fade-in`, `slide-up`, etc.), sombras (`soft`, `medium`, `strong`).
- **Paleta de marca:** Azules (`blue-800/900/950`) para hero, footer y sidebar; dorados (`#b8962e`, `#c4a84a`, `#e8dfc4`) para CTAs, énfasis y texto del sidebar.
- **globals.css:** Scroll suave, fondo de body en gradiente, utilidades `.line-clamp-2`, `.glass-effect`, `.gradient-text`.
- **Loading/Skeletons:** `animate-pulse` + bloques `bg-gray-200`. Dashboard usa spinner dorado (`border-[#c4a84a]`) durante el auth check.

---

## 8. Patrones de comportamiento

- **Auth guard:** El layout del dashboard ejecuta `authService.getCurrentUser()` al montar. Si el usuario no es admin, llama a `router.replace('/')`. Mientras verifica muestra una pantalla de carga.
- **Búsqueda:** SearchBar redirige a `/courses?search=...`. La página de cursos (Client) lee `searchParams`.
- **Filtros y paginación:** Estado en la URL. Al cambiar filtros se resetea `page`; la paginación hace `router.push(..., { scroll: false })`.
- **Formulario de creación de curso:** Estado controlado con `useState`. Categorías se togglean como chips. Submit llama a `coursesService.create(dto)`; muestra banner de éxito o error inline (no `alert`).
- **Idioma:** Textos de UI en español (Argentina).

---

## 9. Requisitos y ejecución

- **Node.js** v18+.
- **Variables de entorno:** Crear `.env.local` con `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api`.
- **Comandos:**
  - `npm install` — dependencias
  - `npm run dev` — desarrollo
  - `npm run build` / `npm run start` — producción
  - `npm run lint` — lint

---

## 10. Resumen para cambios futuros

- **Nueva página pública:** Agregar `page.tsx` bajo `app/(public)/` con la ruta deseada.
- **Nueva página del dashboard:** Agregar `page.tsx` bajo `app/dashboard/`. El layout ya maneja auth y sidebar.
- **Nueva sección en el sidebar:** Extender el array `navItems` en `DashboardSidebar.tsx` con `{ label, href, icon, children? }`.
- **Nuevo componente:** Crear archivo en `src/components/` con interfaz de props y export default.
- **Nueva llamada a API:** Agregar método en el servicio correspondiente usando `fetchApi`; tipar con `src/types`.
- **Reemplazar mock de auth:** Implementar `authService.getCurrentUser()` con la llamada real al backend (ej: leer token de cookie/localStorage y llamar a `GET /auth/me`).
- **Cambio de diseño:** Respetar Tailwind, tokens de `tailwind.config.ts` y paleta (azul + dorado); reutilizar `Button`, `CategoryBadge`, etc.
- **Nuevos tipos:** Definir en `src/types/index.ts` y usar en servicios y componentes.

Usar este README como contexto al pedir o implementar cambios.
