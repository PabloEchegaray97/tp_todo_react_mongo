const express = require('express');
const { check } = require('express-validator');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Definir validaciones
const taskValidation = [
  check('titulo', 'El título es obligatorio').not().isEmpty(),
  check('fechaLimite', 'La fecha límite es obligatoria').not().isEmpty(),
  check('estado', 'El estado solo puede ser: pendiente, en-progreso o completado')
    .optional()
    .isIn(['pendiente', 'en-progreso', 'completado'])
];

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtiene todas las tareas
 *     description: Devuelve un listado de todas las tareas. Puede filtrarse por estado y ordenarse por fecha límite.
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, en-progreso, completado]
 *         description: Filtrar por estado de la tarea
 *       - in: query
 *         name: ordenarPorFecha
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Ordenar por fecha límite (ascendente)
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       500:
 *         description: Error del servidor
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea por su ID
 *     description: Devuelve una tarea específica según su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', taskController.getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     description: Crea una nueva tarea y la añade automáticamente al backlog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - fechaLimite
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Implementar autenticación"
 *               descripcion:
 *                 type: string
 *                 example: "Configurar autenticación con JWT"
 *               fechaLimite:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-30"
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en-progreso, completado]
 *                 example: "pendiente"
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Tarea creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', taskValidation, taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     description: Actualiza los datos de una tarea según su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Implementar autenticación actualizada"
 *               descripcion:
 *                 type: string
 *                 example: "Configurar autenticación con OAuth"
 *               fechaLimite:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en-progreso, completado]
 *                 example: "en-progreso"
 *               color:
 *                 type: string
 *                 example: "#33A8FF"
 *     responses:
 *       200:
 *         description: Tarea actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', taskValidation, taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     description: Elimina una tarea según su ID. No se puede eliminar si está asignada a un sprint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: No se puede eliminar (asignada a un sprint)
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router; 