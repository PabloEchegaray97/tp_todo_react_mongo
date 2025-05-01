const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const tasksRoutes = require('./routes/tasks');
const sprintsRoutes = require('./routes/sprints');
const backlogRoutes = require('./routes/backlog');
const { swaggerUi, swaggerDocs } = require('./swagger');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => {
  console.error('Error al conectar a MongoDB:', err.message);
  process.exit(1);
});

// Rutas
app.use('/api/tasks', tasksRoutes);
app.use('/api/sprints', sprintsRoutes);
app.use('/api/backlog', backlogRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API para administración de tareas, sprints y backlog',
    endpoints: {
      apiDocs: '/api-docs',
      tasks: '/api/tasks',
      sprints: '/api/sprints',
      backlog: '/api/backlog'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`Documentación de Swagger disponible en http://localhost:${PORT}/api-docs`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando servidor...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app; 