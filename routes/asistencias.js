const express = require('express');
const router = express.Router();
const Asistencia = require('../models/Asistencia');
const Jugador = require('../models/Jugador');

// Obtener todas las asistencias
router.get('/', async (req, res) => {
  try {
    const asistencias = await Asistencia.find()
      .populate('jugador', 'nombre apellidos')
      .sort({ fecha: -1 });
    res.json(asistencias);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener asistencias', error: err.message });
  }
});

// Obtener asistencias por jugador
router.get('/jugador/:jugadorId', async (req, res) => {
  try {
    const asistencias = await Asistencia.find({ jugador: req.params.jugadorId })
      .sort({ fecha: -1 });
    res.json(asistencias);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener asistencias del jugador', error: err.message });
  }
});

// Obtener asistencias por fecha
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const fechaInicio = new Date(req.params.fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(req.params.fecha);
    fechaFin.setHours(23, 59, 59, 999);
    
    const asistencias = await Asistencia.find({
      fecha: { $gte: fechaInicio, $lte: fechaFin }
    }).populate('jugador', 'nombre apellidos');
    
    res.json(asistencias);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener asistencias por fecha', error: err.message });
  }
});

// Obtener asistencias por equipo
router.get('/equipo/:equipoId', async (req, res) => {
  try {
    // Primero obtenemos los jugadores del equipo
    const jugadores = await Jugador.find({ equipo: req.params.equipoId }, '_id');
    const jugadoresIds = jugadores.map(jugador => jugador._id);
    
    // Luego buscamos las asistencias de esos jugadores
    const asistencias = await Asistencia.find({
      jugador: { $in: jugadoresIds }
    })
    .populate('jugador', 'nombre apellidos')
    .sort({ fecha: -1 });
    
    res.json(asistencias);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener asistencias por equipo', error: err.message });
  }
});

// Registrar nueva asistencia
router.post('/', async (req, res) => {
  try {
    const { jugador, fecha, asistio, motivoAusencia, observaciones } = req.body;
    
    // Verificar si ya existe una asistencia para este jugador en esta fecha
    const asistenciaExistente = await Asistencia.findOne({
      jugador,
      fecha: new Date(fecha)
    });
    
    if (asistenciaExistente) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un registro de asistencia para este jugador en esta fecha' 
      });
    }
    
    const nuevaAsistencia = new Asistencia({
      jugador,
      fecha,
      asistio,
      motivoAusencia,
      observaciones
    });
    
    const asistenciaGuardada = await nuevaAsistencia.save();
    res.status(201).json(asistenciaGuardada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al registrar la asistencia', error: err.message });
  }
});

// Registrar asistencias en lote (para un equipo completo)
router.post('/lote', async (req, res) => {
  try {
    const { fecha, registros } = req.body;
    // registros es un array de objetos { jugador, asistio, motivoAusencia }
    
    const fechaAsistencia = new Date(fecha);
    const resultados = [];
    
    for (const registro of registros) {
      // Verificar si ya existe una asistencia para este jugador en esta fecha
      const asistenciaExistente = await Asistencia.findOne({
        jugador: registro.jugador,
        fecha: fechaAsistencia
      });
      
      if (asistenciaExistente) {
        // Actualizar la existente
        asistenciaExistente.asistio = registro.asistio;
        asistenciaExistente.motivoAusencia = registro.motivoAusencia;
        asistenciaExistente.observaciones = registro.observaciones;
        
        const actualizada = await asistenciaExistente.save();
        resultados.push(actualizada);
      } else {
        // Crear nueva
        const nuevaAsistencia = new Asistencia({
          jugador: registro.jugador,
          fecha: fechaAsistencia,
          asistio: registro.asistio,
          motivoAusencia: registro.motivoAusencia,
          observaciones: registro.observaciones
        });
        
        const guardada = await nuevaAsistencia.save();
        resultados.push(guardada);
      }
    }
    
    res.status(201).json({
      mensaje: `Se han registrado ${resultados.length} asistencias`,
      resultados
    });
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al registrar asistencias en lote', error: err.message });
  }
});

// Actualizar una asistencia
router.put('/:id', async (req, res) => {
  try {
    const { asistio, motivoAusencia, observaciones } = req.body;
    
    const asistenciaActualizada = await Asistencia.findByIdAndUpdate(
      req.params.id,
      { asistio, motivoAusencia, observaciones },
      { new: true, runValidators: true }
    );
    
    if (!asistenciaActualizada) {
      return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
    
    res.json(asistenciaActualizada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar la asistencia', error: err.message });
  }
});

// Eliminar una asistencia
router.delete('/:id', async (req, res) => {
  try {
    const asistenciaEliminada = await Asistencia.findByIdAndDelete(req.params.id);
    
    if (!asistenciaEliminada) {
      return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
    
    res.json({ mensaje: 'Asistencia eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar la asistencia', error: err.message });
  }
});

module.exports = router;
