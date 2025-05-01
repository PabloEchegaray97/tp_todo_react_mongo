const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const backlogSchema = new Schema({
  tareas: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Backlog', backlogSchema); 