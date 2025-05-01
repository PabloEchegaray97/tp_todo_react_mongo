const Task = require('../models/Task');
const Sprint = require('../models/Sprint');
const Backlog = require('../models/Backlog');
const { validationResult } = require('express-validator');

// Obtener todas las tareas
exports.getAllTasks = async (req, res) => {
  try {
    // Filtrar por estado si se proporciona en la consulta
    const filter = {};
    if (req.query.estado && ['pendiente', 'en-progreso', 'completado'].includes(req.query.estado)) {
      filter.estado = req.query.estado;
    }

    // Ordenar por fecha límite si se solicita
    const sortOptions = {};
    if (req.query.ordenarPorFecha === 'true') {
      sortOptions.fechaLimite = 1; // Ascendente
    }

    const tasks = await Task.find(filter).sort(sortOptions);
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Obtener una tarea por ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newTask = await Task.create(req.body);

    // Automáticamente añadimos la tarea al backlog
    const backlog = await Backlog.findOne();
    if (backlog) {
      backlog.tareas.push(newTask._id);
      await backlog.save();
    } else {
      // Si no hay un backlog, lo creamos
      await Backlog.create({ tareas: [newTask._id] });
    }

    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Actualizar una tarea
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    // Verificar si la tarea está asignada a algún sprint
    const sprints = await Sprint.find({ tareas: req.params.id });
    if (sprints.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'No se puede eliminar una tarea asignada a un sprint'
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    // Eliminar la referencia en el backlog
    const backlog = await Backlog.findOne();
    if (backlog) {
      backlog.tareas = backlog.tareas.filter(
        taskId => taskId.toString() !== req.params.id
      );
      await backlog.save();
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
}; 