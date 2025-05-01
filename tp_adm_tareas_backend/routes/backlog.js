const express = require('express');
const backlogController = require('../controllers/backlogController');

const router = express.Router();

/**
 * @swagger
 * /api/backlog:
 *   get:
 *     summary: Obtiene el backlog
 *     description: Devuelve el backlog con todas las tareas no asignadas a sprints
 *     responses:
 *       200:
 *         description: Backlog obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Backlog'
 *       500:
 *         description: Error del servidor
 */
router.get('/', backlogController.getBacklog);

/**
 * @swagger
 * /api/backlog:
 *   post:
 *     summary: Crea el backlog
 *     description: Crea un nuevo backlog (solo debe existir uno)
 *     responses:
 *       201:
 *         description: Backlog creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Backlog'
 *       400:
 *         description: Ya existe un backlog
 *       500:
 *         description: Error del servidor
 */
router.post('/', backlogController.createBacklog);

/**
 * @swagger
 * /api/backlog/add-task/{taskId}:
 *   put:
 *     summary: Añade una tarea al backlog
 *     description: Agrega una tarea existente al backlog
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a añadir
 *     responses:
 *       200:
 *         description: Tarea añadida al backlog con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Backlog'
 *       400:
 *         description: La tarea ya está en el backlog
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/add-task/:taskId', backlogController.addTaskToBacklog);

module.exports = router; 