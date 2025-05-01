const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio']
  },
  descripcion: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en-progreso', 'completado'],
    default: 'pendiente'
  },
  fechaLimite: {
    type: Date,
    required: [true, 'La fecha límite es obligatoria']
  },
  color: {
    type: String,
    default: '#4A90E2'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema); 