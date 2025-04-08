const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS mejorada
app.use(cors({
  origin: ['https://agus-front.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Importar rutas
const temporadasRoutes = require('./routes/temporadas');
const equiposRoutes = require('./routes/equipos');
const jugadoresRoutes = require('./routes/jugadores');
const asistenciasRoutes = require('./routes/asistencias');
const valoracionesRoutes = require('./routes/valoraciones');
const scoutingRoutes = require('./routes/scouting');
const objetivosRoutes = require('./routes/objetivos');
const reunionesRoutes = require('./routes/reuniones');
const usuariosRoutes = require('./routes/usuarios');

// Usar rutas
app.use('/api/temporadas', temporadasRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/jugadores', jugadoresRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/valoraciones', valoracionesRoutes);
app.use('/api/scouting', scoutingRoutes);
app.use('/api/objetivos', objetivosRoutes);
app.use('/api/reuniones', reunionesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API del Club de Fútbol San Agustín');
});

// Ruta de verificación de estado
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'API funcionando correctamente',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Conexión a MongoDB con manejo de errores mejorado
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conexión a MongoDB establecida'))
.catch(err => {
  console.error('Error al conectar a MongoDB:', err);
  // No detener la aplicación, permitir que funcione sin base de datos en modo de emergencia
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err);
  res.status(500).json({ 
    mensaje: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'production' ? 'Detalles ocultos en producción' : err.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
