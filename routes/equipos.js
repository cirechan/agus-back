const express = require('express');
const router = express.Router();
const Equipo = require('../models/Equipo');

// Obtener todos los equipos
router.get('/', async (req, res) => {
  try {
    const equipos = await Equipo.find()
      .populate('temporada', 'nombre')
      .populate('entrenador', 'nombreUsuario');
    res.json(equipos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener equipos', error: err.message });
  }
});

// Obtener un equipo por ID
router.get('/:id', async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.id)
      .populate('temporada', 'nombre')
      .populate('entrenador', 'nombreUsuario');
    
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    
    res.json(equipo);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el equipo', error: err.message });
  }
});

// Obtener equipos por temporada
router.get('/temporada/:temporadaId', async (req, res) => {
  try {
    const equipos = await Equipo.find({ temporada: req.params.temporadaId })
      .populate('entrenador', 'nombreUsuario');
    res.json(equipos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener equipos por temporada', error: err.message });
  }
});

// Crear un nuevo equipo
router.post('/', async (req, res) => {
  try {
    const { nombre, categoria, temporada, entrenador, limiteJugadores } = req.body;
    
    const nuevoEquipo = new Equipo({
      nombre,
      categoria,
      temporada,
      entrenador,
      limiteJugadores
    });
    
    const equipoGuardado = await nuevoEquipo.save();
    res.status(201).json(equipoGuardado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear el equipo', error: err.message });
  }
});

// Actualizar un equipo
router.put('/:id', async (req, res) => {
  try {
    const { nombre, categoria, temporada, entrenador, limiteJugadores } = req.body;
    
    const equipoActualizado = await Equipo.findByIdAndUpdate(
      req.params.id,
      { nombre, categoria, temporada, entrenador, limiteJugadores },
      { new: true, runValidators: true }
    );
    
    if (!equipoActualizado) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    
    res.json(equipoActualizado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar el equipo', error: err.message });
  }
});

// Eliminar un equipo
router.delete('/:id', async (req, res) => {
  try {
    const equipoEliminado = await Equipo.findByIdAndDelete(req.params.id);
    
    if (!equipoEliminado) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }
    
    res.json({ mensaje: 'Equipo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el equipo', error: err.message });
  }
});

module.exports = router;
