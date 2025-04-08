const express = require('express');
const router = express.Router();
const Temporada = require('../models/Temporada');

// Obtener todas las temporadas
router.get('/', async (req, res) => {
  try {
    const temporadas = await Temporada.find().sort({ fechaInicio: -1 });
    res.json(temporadas);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener temporadas', error: err.message });
  }
});

// Obtener una temporada por ID
router.get('/:id', async (req, res) => {
  try {
    const temporada = await Temporada.findById(req.params.id);
    if (!temporada) {
      return res.status(404).json({ mensaje: 'Temporada no encontrada' });
    }
    res.json(temporada);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener la temporada', error: err.message });
  }
});

// Crear una nueva temporada
router.post('/', async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin, activa } = req.body;
    
    // Si la nueva temporada es activa, desactivar las demás
    if (activa) {
      await Temporada.updateMany({}, { activa: false });
    }
    
    const nuevaTemporada = new Temporada({
      nombre,
      fechaInicio,
      fechaFin,
      activa
    });
    
    const temporadaGuardada = await nuevaTemporada.save();
    res.status(201).json(temporadaGuardada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear la temporada', error: err.message });
  }
});

// Actualizar una temporada
router.put('/:id', async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin, activa } = req.body;
    
    // Si la temporada actualizada es activa, desactivar las demás
    if (activa) {
      await Temporada.updateMany({ _id: { $ne: req.params.id } }, { activa: false });
    }
    
    const temporadaActualizada = await Temporada.findByIdAndUpdate(
      req.params.id,
      { nombre, fechaInicio, fechaFin, activa },
      { new: true, runValidators: true }
    );
    
    if (!temporadaActualizada) {
      return res.status(404).json({ mensaje: 'Temporada no encontrada' });
    }
    
    res.json(temporadaActualizada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar la temporada', error: err.message });
  }
});

// Eliminar una temporada
router.delete('/:id', async (req, res) => {
  try {
    const temporadaEliminada = await Temporada.findByIdAndDelete(req.params.id);
    
    if (!temporadaEliminada) {
      return res.status(404).json({ mensaje: 'Temporada no encontrada' });
    }
    
    res.json({ mensaje: 'Temporada eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar la temporada', error: err.message });
  }
});

module.exports = router;
