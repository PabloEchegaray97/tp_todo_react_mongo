const express = require('express');
const { check } = require('express-validator');
const sprintController = require('../controllers/sprintController');

const router = express.Router();

// Definir validaciones
const sprintValidation = [
  check('nombre', 'El nombre del sprint es obligatorio').not().isEmpty(),
  check('fechaInicio', 'La fecha de inicio es obligatoria').not().isEmpty(),
  check('fechaCierre', 'La fecha de cierre es obligatoria').not().isEmpty()
];

/**
 * @swagger
 * /api/sprints:
 *   get:
 *     summary: Obtiene todos los sprints
 *     description: Devuelve un listado de todos los sprints con sus tareas asociadas
 *     responses:
 *       200:
 *         description: Lista de sprints obtenida con éxito
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
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sprint'
 *       500:
 *         description: Error del servidor
 */
router.get('/', sprintController.getAllSprints);

/**
 * @swagger
 * /api/sprints/{id}:
 *   get:
 *     summary: Obtiene un sprint por su ID
 *     description: Devuelve un sprint específico con sus tareas asociadas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     responses:
 *       200:
 *         description: Sprint obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Sprint'
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', sprintController.getSprintById); // middleware para validar el ID del sprint
// Puedes usar un middleware como express-validator para validar el ID del sprint

/**
 * @swagger
 * /api/sprints:
 *   post:
 *     summary: Crea un nuevo sprint
 *     description: Crea un nuevo sprint para organizar tareas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - fechaInicio
 *               - fechaCierre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Sprint 3"
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               fechaCierre:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               color:
 *                 type: string
 *                 example: "#4CAF50"
 *               tareas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *     responses:
 *       201:
 *         description: Sprint creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Sprint'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', sprintValidation, sprintController.createSprint);

/**
 * @swagger
 * /api/sprints/{id}:
 *   put:
 *     summary: Actualiza un sprint existente
 *     description: Actualiza los datos de un sprint según su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Sprint 3 Actualizado"
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               fechaCierre:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-20"
 *               color:
 *                 type: string
 *                 example: "#4CAF50"
 *     responses:
 *       200:
 *         description: Sprint actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Sprint'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', sprintValidation, sprintController.updateSprint);

/**
 * @swagger
 * /api/sprints/{id}:
 *   delete:
 *     summary: Elimina un sprint
 *     description: Elimina un sprint según su ID y devuelve las tareas asociadas al backlog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     responses:
 *       200:
 *         description: Sprint eliminado con éxito
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
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', sprintController.deleteSprint);

/**
 * @swagger
 * /api/sprints/{id}/add-task/{taskId}:
 *   put:
 *     summary: Añade una tarea a un sprint
 *     description: Asigna una tarea existente a un sprint y la elimina del backlog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a añadir
 *     responses:
 *       200:
 *         description: Tarea añadida al sprint con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Sprint'
 *       400:
 *         description: La tarea ya está asignada al sprint
 *       404:
 *         description: Sprint o tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id/add-task/:taskId', sprintController.addTaskToSprint);

module.exports = router; 