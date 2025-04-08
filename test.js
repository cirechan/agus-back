const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Temporada = require('./models/Temporada');
const Equipo = require('./models/Equipo');
const Jugador = require('./models/Jugador');
const Asistencia = require('./models/Asistencia');

// Configuración para pruebas
let mongoServer;

// Datos de prueba
const temporadaPrueba = {
  nombre: "2024-2025",
  fechaInicio: new Date("2024-09-01"),
  fechaFin: new Date("2025-06-30"),
  activa: true
};

const equipoPrueba = {
  nombre: "Benjamín A",
  categoria: "Benjamín",
  limiteJugadores: 15
};

const jugadorPrueba = {
  nombre: "Juan",
  apellidos: "García López",
  fechaNacimiento: new Date("2015-05-10"),
  posicion: "Centrocampista",
  dorsal: 8,
  observaciones: "Jugador con buena técnica"
};

const asistenciaPrueba = {
  fecha: new Date(),
  asistio: true,
  observaciones: "Entrenamiento completo"
};

// Función principal de prueba
async function ejecutarPruebas() {
  try {
    console.log("Iniciando pruebas del backend...");
    
    // Iniciar servidor MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Conectar a la base de datos en memoria
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("Conexión a MongoDB en memoria establecida");
    
    // Ejecutar pruebas
    await probarTemporadas();
    await probarEquipos();
    await probarJugadores();
    await probarAsistencias();
    
    console.log("\n✅ Todas las pruebas completadas con éxito");
    
  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
  } finally {
    // Cerrar conexión y servidor
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log("Pruebas finalizadas, conexión cerrada");
  }
}

// Pruebas de Temporadas
async function probarTemporadas() {
  console.log("\n--- Pruebas de Temporadas ---");
  
  // Crear temporada
  const nuevaTemporada = new Temporada(temporadaPrueba);
  const temporadaGuardada = await nuevaTemporada.save();
  console.log("✅ Temporada creada:", temporadaGuardada.nombre);
  
  // Obtener temporadas
  const temporadas = await Temporada.find();
  console.log(`✅ Obtenidas ${temporadas.length} temporadas`);
  
  // Actualizar temporada
  const temporadaActualizada = await Temporada.findByIdAndUpdate(
    temporadaGuardada._id,
    { nombre: "2024-2025 (Actualizada)" },
    { new: true }
  );
  console.log("✅ Temporada actualizada:", temporadaActualizada.nombre);
  
  // Guardar ID para pruebas posteriores
  global.temporadaId = temporadaGuardada._id;
  
  return temporadaGuardada;
}

// Pruebas de Equipos
async function probarEquipos() {
  console.log("\n--- Pruebas de Equipos ---");
  
  // Crear equipo
  const nuevoEquipo = new Equipo({
    ...equipoPrueba,
    temporada: global.temporadaId
  });
  
  const equipoGuardado = await nuevoEquipo.save();
  console.log("✅ Equipo creado:", equipoGuardado.nombre);
  
  // Obtener equipos
  const equipos = await Equipo.find();
  console.log(`✅ Obtenidos ${equipos.length} equipos`);
  
  // Obtener equipos por temporada
  const equiposPorTemporada = await Equipo.find({ temporada: global.temporadaId });
  console.log(`✅ Obtenidos ${equiposPorTemporada.length} equipos para la temporada`);
  
  // Guardar ID para pruebas posteriores
  global.equipoId = equipoGuardado._id;
  
  return equipoGuardado;
}

// Pruebas de Jugadores
async function probarJugadores() {
  console.log("\n--- Pruebas de Jugadores ---");
  
  // Crear jugador
  const nuevoJugador = new Jugador({
    ...jugadorPrueba,
    equipo: global.equipoId
  });
  
  const jugadorGuardado = await nuevoJugador.save();
  console.log("✅ Jugador creado:", `${jugadorGuardado.nombre} ${jugadorGuardado.apellidos}`);
  
  // Obtener jugadores
  const jugadores = await Jugador.find();
  console.log(`✅ Obtenidos ${jugadores.length} jugadores`);
  
  // Obtener jugadores por equipo
  const jugadoresPorEquipo = await Jugador.find({ equipo: global.equipoId });
  console.log(`✅ Obtenidos ${jugadoresPorEquipo.length} jugadores para el equipo`);
  
  // Guardar ID para pruebas posteriores
  global.jugadorId = jugadorGuardado._id;
  
  return jugadorGuardado;
}

// Pruebas de Asistencias
async function probarAsistencias() {
  console.log("\n--- Pruebas de Asistencias ---");
  
  // Crear asistencia
  const nuevaAsistencia = new Asistencia({
    ...asistenciaPrueba,
    jugador: global.jugadorId
  });
  
  const asistenciaGuardada = await nuevaAsistencia.save();
  console.log("✅ Asistencia creada para la fecha:", asistenciaGuardada.fecha.toISOString().split('T')[0]);
  
  // Obtener asistencias
  const asistencias = await Asistencia.find();
  console.log(`✅ Obtenidas ${asistencias.length} asistencias`);
  
  // Obtener asistencias por jugador
  const asistenciasPorJugador = await Asistencia.find({ jugador: global.jugadorId });
  console.log(`✅ Obtenidas ${asistenciasPorJugador.length} asistencias para el jugador`);
  
  return asistenciaGuardada;
}

// Ejecutar pruebas
ejecutarPruebas();
