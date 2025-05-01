const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Opciones básicas de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Administración de Tareas',
      version: '1.0.0',
      description: 'API RESTful para administrar tareas, organizarlas en Sprints y mantener un Backlog general',
      contact: {
        name: 'Administrador'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor de Desarrollo'
        }
      ]
    },
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['titulo', 'fechaLimite'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID autogenerado de la tarea'
            },
            titulo: {
              type: 'string',
              description: 'Título de la tarea'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción detallada de la tarea'
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'en-progreso', 'completado'],
              description: 'Estado actual de la tarea'
            },
            fechaLimite: {
              type: 'string',
              format: 'date',
              description: 'Fecha límite para completar la tarea'
            },
            color: {
              type: 'string',
              description: 'Color asignado a la tarea para identificación visual'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación de la tarea'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización de la tarea'
            }
          }
        },
        Sprint: {
          type: 'object',
          required: ['nombre', 'fechaInicio', 'fechaCierre'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID autogenerado del sprint'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del sprint'
            },
            fechaInicio: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del sprint'
            },
            fechaCierre: {
              type: 'string',
              format: 'date',
              description: 'Fecha de cierre del sprint'
            },
            tareas: {
              type: 'array',
              items: {
                type: 'string',
                description: 'ID de la tarea'
              },
              description: 'Lista de referencias a tareas asignadas al sprint'
            },
            color: {
              type: 'string',
              description: 'Color asignado al sprint para identificación visual'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del sprint'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización del sprint'
            }
          }
        },
        Backlog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID autogenerado del backlog'
            },
            tareas: {
              type: 'array',
              items: {
                type: 'string',
                description: 'ID de la tarea'
              },
              description: 'Lista de referencias a tareas en el backlog'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del backlog'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización del backlog'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Ruta donde se encuentran los endpoints documentados
};

// Inicializar Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs
}; 