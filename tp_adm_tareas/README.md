# Sistema de Administración de Tareas

## Descripción General

Este proyecto presenta una aplicación web desarrollada como parte del trabajo práctico para la materia de Metodología de Sistemas (TUP). Es un sistema completo de administración de tareas, diseñado con enfoque en la organización de proyectos mediante el uso de sprints y backlog, siguiendo metodologías ágiles.

## Tecnologías Utilizadas

- **React 19**: Framework frontend para la construcción de interfaces interactivas
- **TypeScript**: Superconjunto tipado de JavaScript que mejora la calidad del código
- **Zustand**: Biblioteca para manejo de estado global simplificado
- **Material UI (MUI)**: Sistema de componentes para interfaces consistentes
- **SweetAlert2**: Biblioteca para alertas personalizadas y responsivas
- **Vite**: Herramienta de compilación rápida para desarrollo moderno
- **CSS Modules**: Sistema de encapsulamiento de estilos para evitar conflictos

## Estructura del Proyecto

```
src/
├── components/      # Componentes de la interfaz
│   ├── screens/     # Vistas principales
│   └── ui/          # Elementos de interfaz reutilizables
├── http/            # Configuración de peticiones HTTP
├── store/           # Gestión de estado global con Zustand
├── styles/          # Estilos globales y temas
├── types/           # Definiciones de tipos TypeScript
└── utils/           # Utilidades y funciones auxiliares
```

## Características Principales

- **Gestión de Sprints**: Creación, edición y visualización de períodos de trabajo
- **Backlog de Tareas**: Administración de tareas pendientes sin asignación a sprints
- **Kanban Board**: Visualización de tareas en columnas según su estado (pendiente, en progreso, completado)
- **Temas Claro/Oscuro**: Sistema completo de cambio de tema visual
- **Alertas Personalizadas**: Interacciones mejoradas mediante alertas modales

## Funcionalidades Detalladas

### Gestión de Sprints
- Crear sprints con nombre, fecha de inicio y cierre
- Visualizar lista de sprints disponibles
- Editar información de sprints existentes
- Eliminar sprints con confirmación

### Gestión de Tareas en Backlog & Sprints
- Crear tareas con título, descripción y fecha límite
- Asignar tareas a sprints específicos
- Mover tareas entre diferentes estados (pendiente, en progreso, completado)
- Enviar tareas al backlog cuando sea necesario
- Visualizar detalles de tareas en modales informativos

## Instalación y Ejecución

Para comenzar a trabajar con este proyecto, es necesario seguir los siguientes pasos:

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Ingresar al directorio
cd tp_adm_tareas

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# En una terminal separada, ejecutar el servidor de base de datos
npm run dbDev
```

