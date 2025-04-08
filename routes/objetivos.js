const express = require('express');
const router = express.Router();
const Objetivo = require('../models/Objetivo');

// Obtener todos los objetivos
router.get('/', async (req, res) => {
  try {
    const objetivos = await Objetivo.find()
      .populate('equipo', 'nombre categoria')
      .populate('temporada', 'nombre')
      .sort({ fechaCreacion: -1 });
    res.json(objetivos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener objetivos', error: err.message });
  }
});

// Obtener objetivos por equipo
router.get('/equipo/:equipoId', async (req, res) => {
  try {
    const objetivos = await Objetivo.find({ equipo: req.params.equipoId })
      .populate('temporada', 'nombre')
      .sort({ estado: 1, fechaCreacion: -1 });
    res.json(objetivos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener objetivos del equipo', error: err.message });
  }
});

// Obtener objetivos por temporada
router.get('/temporada/:temporadaId', async (req, res) => {
  try {
    const objetivos = await Objetivo.find({ temporada: req.params.temporadaId })
      .populate('equipo', 'nombre categoria')
      .sort({ estado: 1, fechaCreacion: -1 });
    res.json(objetivos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener objetivos de la temporada', error: err.message });
  }
});

// Crear nuevo objetivo
router.post('/', async (req, res) => {
  try {
    const { 
      equipo, 
      temporada, 
      descripcion, 
      tipo, 
      estado 
    } = req.body;
    
    const nuevoObjetivo = new Objetivo({
      equipo,
      temporada,
      descripcion,
      tipo,
      estado,
      fechaCreacion: Date.now(),
      fechaActualizacion: Date.now()
    });
    
    const objetivoGuardado = await nuevoObjetivo.save();
    res.status(201).json(objetivoGuardado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear el objetivo', error: err.message });
  }
});

// Actualizar un objetivo
router.put('/:id', async (req, res) => {
  try {
    const { 
      descripcion, 
      tipo, 
      estado 
    } = req.body;
    
    const objetivoActualizado = await Objetivo.findByIdAndUpdate(
      req.params.id,
      { 
        descripcion, 
        tipo, 
        estado,
        fechaActualizacion: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!objetivoActualizado) {
      return res.status(404).json({ mensaje: 'Objetivo no encontrado' });
    }
    
    res.json(objetivoActualizado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar el objetivo', error: err.message });
  }
});

// Actualizar estado de un objetivo
router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    
    const objetivoActualizado = await Objetivo.findByIdAndUpdate(
      req.params.id,
      { 
        estado,
        fechaActualizacion: Date.now()
      },
      { new: true }
    );
    
    if (!objetivoActualizado) {
      return res.status(404).json({ mensaje: 'Objetivo no encontrado' });
    }
    
    res.json(objetivoActualizado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar el estado del objetivo', error: err.message });
  }
});

// Eliminar un objetivo
router.delete('/:id', async (req, res) => {
  try {
    const objetivoEliminado = await Objetivo.findByIdAndDelete(req.params.id);
    
    if (!objetivoEliminado) {
      return res.status(404).json({ mensaje: 'Objetivo no encontrado' });
    }
    
    res.json({ mensaje: 'Objetivo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el objetivo', error: err.message });
  }
});

module.exports = router;
