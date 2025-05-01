const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sprintSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del sprint es obligatorio']
  },
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria']
  },
  fechaCierre: {
    type: Date,
    required: [true, 'La fecha de cierre es obligatoria']
  },
  tareas: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  color: {
    type: String,
    default: '#F5A623'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Validación: fecha de cierre debe ser posterior a fecha de inicio
sprintSchema.pre('validate', function(next) {
  if (this.fechaCierre && this.fechaInicio) {
    if (this.fechaCierre < this.fechaInicio) {
      this.invalidate('fechaCierre', 'La fecha de cierre debe ser posterior a la fecha de inicio');
    }
  }
  next();
});

module.exports = mongoose.model('Sprint', sprintSchema); 