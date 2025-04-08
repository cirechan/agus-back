const express = require('express');
const router = express.Router();
const Jugador = require('../models/Jugador');

// Obtener todos los jugadores
router.get('/', async (req, res) => {
  try {
    const jugadores = await Jugador.find()
      .populate('equipo', 'nombre categoria')
      .sort({ apellidos: 1, nombre: 1 });
    res.json(jugadores);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores', error: err.message });
  }
});

// Obtener un jugador por ID
router.get('/:id', async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id)
      .populate('equipo', 'nombre categoria')
      .populate({
        path: 'temporadasAnteriores.temporada',
        select: 'nombre'
      })
      .populate({
        path: 'temporadasAnteriores.equipo',
        select: 'nombre categoria'
      });
    
    if (!jugador) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    
    res.json(jugador);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el jugador', error: err.message });
  }
});

// Obtener jugadores por equipo
router.get('/equipo/:equipoId', async (req, res) => {
  try {
    const jugadores = await Jugador.find({ equipo: req.params.equipoId })
      .sort({ apellidos: 1, nombre: 1 });
    res.json(jugadores);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores por equipo', error: err.message });
  }
});

// Crear un nuevo jugador
router.post('/', async (req, res) => {
  try {
    const { 
      nombre, 
      apellidos, 
      fechaNacimiento, 
      posicion, 
      equipo, 
      dorsal, 
      observaciones, 
      foto,
      temporadasAnteriores 
    } = req.body;
    
    const nuevoJugador = new Jugador({
      nombre,
      apellidos,
      fechaNacimiento,
      posicion,
      equipo,
      dorsal,
      observaciones,
      foto,
      temporadasAnteriores
    });
    
    const jugadorGuardado = await nuevoJugador.save();
    res.status(201).json(jugadorGuardado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear el jugador', error: err.message });
  }
});

// Actualizar un jugador
router.put('/:id', async (req, res) => {
  try {
    const { 
      nombre, 
      apellidos, 
      fechaNacimiento, 
      posicion, 
      equipo, 
      dorsal, 
      observaciones, 
      foto,
      temporadasAnteriores 
    } = req.body;
    
    const jugadorActualizado = await Jugador.findByIdAndUpdate(
      req.params.id,
      { 
        nombre, 
        apellidos, 
        fechaNacimiento, 
        posicion, 
        equipo, 
        dorsal, 
        observaciones, 
        foto,
        temporadasAnteriores 
      },
      { new: true, runValidators: true }
    );
    
    if (!jugadorActualizado) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    
    res.json(jugadorActualizado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar el jugador', error: err.message });
  }
});

// Eliminar un jugador
router.delete('/:id', async (req, res) => {
  try {
    const jugadorEliminado = await Jugador.findByIdAndDelete(req.params.id);
    
    if (!jugadorEliminado) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }
    
    res.json({ mensaje: 'Jugador eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el jugador', error: err.message });
  }
});

module.exports = router;
