# Frontend - Cursos Platform

Aplicación web frontend desarrollada con Next.js para la plataforma de búsqueda de cursos.

## Requisitos

- Node.js (v18 o superior)
- npm o yarn

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

Crear un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Ejecutar la aplicación

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── app/              # Páginas y rutas (App Router)
├── components/       # Componentes reutilizables
├── services/         # Servicios para consumir la API
├── types/            # Tipos TypeScript
└── styles/           # Estilos globales
```

## Características

- **Home Page**: Hero section, buscador, carrusel de cursos destacados y categorías
- **Listado de Cursos**: Búsqueda, filtros por categoría y organización, paginación
- **Detalle de Curso**: Información completa y formulario de inscripción
- **Organizaciones**: Listado de todas las organizaciones
- **Acerca de**: Información sobre la plataforma

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18

## Integración con API

La aplicación consume la API REST del backend NestJS. Asegurate de que el backend esté corriendo en `http://localhost:3000/api` antes de iniciar el frontend.

