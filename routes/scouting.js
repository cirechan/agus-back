const express = require('express');
const router = express.Router();
const ScoutingRival = require('../models/ScoutingRival');

// Obtener todos los registros de scouting
router.get('/', async (req, res) => {
  try {
    const scoutingRegistros = await ScoutingRival.find()
      .populate('equipoObservador', 'nombre categoria')
      .sort({ fechaObservacion: -1 });
    res.json(scoutingRegistros);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener registros de scouting', error: err.message });
  }
});

// Obtener registros de scouting por equipo observador
router.get('/equipo/:equipoId', async (req, res) => {
  try {
    const scoutingRegistros = await ScoutingRival.find({ equipoObservador: req.params.equipoId })
      .sort({ fechaObservacion: -1 });
    res.json(scoutingRegistros);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener registros de scouting del equipo', error: err.message });
  }
});

// Obtener jugadores en seguimiento
router.get('/seguimiento', async (req, res) => {
  try {
    const jugadoresEnSeguimiento = await ScoutingRival.find({ enSeguimiento: true })
      .populate('equipoObservador', 'nombre categoria')
      .sort({ valoracionGeneral: -1 });
    res.json(jugadoresEnSeguimiento);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores en seguimiento', error: err.message });
  }
});

// Crear nuevo registro de scouting
router.post('/', async (req, res) => {
  try {
    const { 
      nombreJugador, 
      dorsal, 
      equipoRival, 
      posicion, 
      valoracionGeneral, 
      observaciones, 
      enSeguimiento, 
      fechaObservacion, 
      equipoObservador 
    } = req.body;
    
    const nuevoScouting = new ScoutingRival({
      nombreJugador,
      dorsal,
      equipoRival,
      posicion,
      valoracionGeneral,
      observaciones,
      enSeguimiento,
      fechaObservacion,
      equipoObservador
    });
    
    const scoutingGuardado = await nuevoScouting.save();
    res.status(201).json(scoutingGuardado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear el registro de scouting', error: err.message });
  }
});

// Actualizar un registro de scouting
router.put('/:id', async (req, res) => {
  try {
    const { 
      nombreJugador, 
      dorsal, 
      equipoRival, 
      posicion, 
      valoracionGeneral, 
      observaciones, 
      enSeguimiento, 
      fechaObservacion, 
      equipoObservador 
    } = req.body;
    
    const scoutingActualizado = await ScoutingRival.findByIdAndUpdate(
      req.params.id,
      { 
        nombreJugador, 
        dorsal, 
        equipoRival, 
        posicion, 
        valoracionGeneral, 
        observaciones, 
        enSeguimiento, 
        fechaObservacion, 
        equipoObservador 
      },
      { new: true, runValidators: true }
    );
    
    if (!scoutingActualizado) {
      return res.status(404).json({ mensaje: 'Registro de scouting no encontrado' });
    }
    
    res.json(scoutingActualizado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar el registro de scouting', error: err.message });
  }
});

// Cambiar estado de seguimiento
router.patch('/:id/seguimiento', async (req, res) => {
  try {
    const { enSeguimiento } = req.body;
    
    const scoutingActualizado = await ScoutingRival.findByIdAndUpdate(
      req.params.id,
      { enSeguimiento },
      { new: true }
    );
    
    if (!scoutingActualizado) {
      return res.status(404).json({ mensaje: 'Registro de scouting no encontrado' });
    }
    
    res.json(scoutingActualizado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar el estado de seguimiento', error: err.message });
  }
});

// Eliminar un registro de scouting
router.delete('/:id', async (req, res) => {
  try {
    const scoutingEliminado = await ScoutingRival.findByIdAndDelete(req.params.id);
    
    if (!scoutingEliminado) {
      return res.status(404).json({ mensaje: 'Registro de scouting no encontrado' });
    }
    
    res.json({ mensaje: 'Registro de scouting eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el registro de scouting', error: err.message });
  }
});

module.exports = router;
