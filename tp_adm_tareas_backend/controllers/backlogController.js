const Backlog = require('../models/Backlog');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Obtener el backlog
exports.getBacklog = async (req, res) => {
  try {
    // Obtener el backlog, si no existe lo creamos
    let backlog = await Backlog.findOne().populate('tareas');
    
    if (!backlog) {
      backlog = await Backlog.create({ tareas: [] });
      backlog = await Backlog.findById(backlog._id).populate('tareas');
    }

    res.status(200).json({
      success: true,
      data: backlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Crear el backlog (solo debe haber uno)
exports.createBacklog = async (req, res) => {
  try {
    // Comprobar si ya existe un backlog
    const existingBacklog = await Backlog.findOne();
    if (existingBacklog) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un backlog'
      });
    }

    // Crear un nuevo backlog
    const backlog = await Backlog.create({ tareas: [] });
    
    res.status(201).json({
      success: true,
      data: backlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
};

// Añadir una tarea al backlog
exports.addTaskToBacklog = async (req, res) => {
  try {
    // Verificar si la tarea existe
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    // Buscar el backlog, si no existe lo creamos
    let backlog = await Backlog.findOne();
    if (!backlog) {
      backlog = await Backlog.create({ tareas: [] });
    }

    // Verificar si la tarea ya está en el backlog
    if (backlog.tareas.includes(req.params.taskId)) {
      return res.status(400).json({
        success: false,
        error: 'La tarea ya está en el backlog'
      });
    }

    // Añadir la tarea al backlog
    backlog.tareas.push(req.params.taskId);
    await backlog.save();

    // Obtener el backlog actualizado con las tareas populadas
    const updatedBacklog = await Backlog.findById(backlog._id).populate('tareas');

    res.status(200).json({
      success: true,
      data: updatedBacklog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor: ' + error.message
    });
  }
}; 