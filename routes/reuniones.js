const express = require('express');
const router = express.Router();
const ReunionTecnica = require('../models/ReunionTecnica');

// Obtener todas las reuniones técnicas
router.get('/', async (req, res) => {
  try {
    const reuniones = await ReunionTecnica.find()
      .populate('participantes', 'nombreUsuario')
      .populate('equiposInvolucrados', 'nombre categoria')
      .sort({ fecha: -1 });
    res.json(reuniones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener reuniones técnicas', error: err.message });
  }
});

// Obtener una reunión técnica por ID
router.get('/:id', async (req, res) => {
  try {
    const reunion = await ReunionTecnica.findById(req.params.id)
      .populate('participantes', 'nombreUsuario')
      .populate('equiposInvolucrados', 'nombre categoria');
    
    if (!reunion) {
      return res.status(404).json({ mensaje: 'Reunión técnica no encontrada' });
    }
    
    res.json(reunion);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener la reunión técnica', error: err.message });
  }
});

// Obtener reuniones por equipo involucrado
router.get('/equipo/:equipoId', async (req, res) => {
  try {
    const reuniones = await ReunionTecnica.find({ 
      equiposInvolucrados: { $in: [req.params.equipoId] } 
    })
      .populate('participantes', 'nombreUsuario')
      .sort({ fecha: -1 });
    res.json(reuniones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener reuniones del equipo', error: err.message });
  }
});

// Crear nueva reunión técnica
router.post('/', async (req, res) => {
  try {
    const { 
      fecha, 
      participantes, 
      acta, 
      acuerdos, 
      equiposInvolucrados 
    } = req.body;
    
    const nuevaReunion = new ReunionTecnica({
      fecha,
      participantes,
      acta,
      acuerdos,
      equiposInvolucrados
    });
    
    const reunionGuardada = await nuevaReunion.save();
    res.status(201).json(reunionGuardada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear la reunión técnica', error: err.message });
  }
});

// Actualizar una reunión técnica
router.put('/:id', async (req, res) => {
  try {
    const { 
      fecha, 
      participantes, 
      acta, 
      acuerdos, 
      equiposInvolucrados 
    } = req.body;
    
    const reunionActualizada = await ReunionTecnica.findByIdAndUpdate(
      req.params.id,
      { 
        fecha, 
        participantes, 
        acta, 
        acuerdos, 
        equiposInvolucrados 
      },
      { new: true, runValidators: true }
    );
    
    if (!reunionActualizada) {
      return res.status(404).json({ mensaje: 'Reunión técnica no encontrada' });
    }
    
    res.json(reunionActualizada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar la reunión técnica', error: err.message });
  }
});

// Eliminar una reunión técnica
router.delete('/:id', async (req, res) => {
  try {
    const reunionEliminada = await ReunionTecnica.findByIdAndDelete(req.params.id);
    
    if (!reunionEliminada) {
      return res.status(404).json({ mensaje: 'Reunión técnica no encontrada' });
    }
    
    res.json({ mensaje: 'Reunión técnica eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar la reunión técnica', error: err.message });
  }
});

module.exports = router;
