const Sprint = require('../models/Sprint');
const Task = require('../models/Task');
const Backlog = require('../models/Backlog');
const { validationResult } = require('express-validator');

// Obtener todos los sprints
exports.getAllSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find().populate('tareas');
    res.status(200).json({
      success: true,
      count: sprints.length,
      data: sprints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Obtener un sprint por ID
exports.getSprintById = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id).populate('tareas');
    
    if (!sprint) {
      return res.status(404).json({
        success: false,
        error: 'Sprint no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: sprint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Crear un nuevo sprint
exports.createSprint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newSprint = await Sprint.create(req.body);
    res.status(201).json({
      success: true,
      data: newSprint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Actualizar un sprint
exports.updateSprint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const sprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('tareas');

    if (!sprint) {
      return res.status(404).json({
        success: false,
        error: 'Sprint no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: sprint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Eliminar un sprint
exports.deleteSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndDelete(req.params.id);
    
    if (!sprint) {
      return res.status(404).json({
        success: false,
        error: 'Sprint no encontrado'
      });
    }

    // Devolver todas las tareas del sprint al backlog
    if (sprint.tareas.length > 0) {
      const backlog = await Backlog.findOne();
      if (backlog) {
        // Añadir las tareas al backlog
        sprint.tareas.forEach(taskId => {
          if (!backlog.tareas.includes(taskId)) {
            backlog.tareas.push(taskId);
          }
        });
        await backlog.save();
      }
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

// Añadir una tarea a un sprint
exports.addTaskToSprint = async (req, res) => {
  try {
    // Verificar si la tarea existe
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    // Verificar si el sprint existe
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({
        success: false,
        error: 'Sprint no encontrado'
      });
    }

    // Verificar si la tarea ya está en el sprint
    if (sprint.tareas.includes(req.params.taskId)) {
      return res.status(400).json({
        success: false,
        error: 'La tarea ya está asignada a este sprint'
      });
    }

    // Añadir la tarea al sprint
    sprint.tareas.push(req.params.taskId);
    await sprint.save();

    // Eliminar la tarea del backlog
    const backlog = await Backlog.findOne();
    if (backlog) {
      backlog.tareas = backlog.tareas.filter(
        taskId => taskId.toString() !== req.params.taskId
      );
      await backlog.save();
    }

    // Obtener el sprint actualizado con las tareas populadas
    const updatedSprint = await Sprint.findById(req.params.id).populate('tareas');

    res.status(200).json({
      success: true,
      data: updatedSprint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
}; 