const express = require('express');
const router = express.Router();
const Valoracion = require('../models/Valoracion');

// Obtener todas las valoraciones
router.get('/', async (req, res) => {
  try {
    const valoraciones = await Valoracion.find()
      .populate('jugador', 'nombre apellidos')
      .sort({ fecha: -1 });
    res.json(valoraciones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener valoraciones', error: err.message });
  }
});

// Obtener valoraciones por jugador
router.get('/jugador/:jugadorId', async (req, res) => {
  try {
    const valoraciones = await Valoracion.find({ jugador: req.params.jugadorId })
      .sort({ fecha: -1 });
    res.json(valoraciones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener valoraciones del jugador', error: err.message });
  }
});

// Crear nueva valoración
router.post('/', async (req, res) => {
  try {
    const { 
      jugador, 
      fecha, 
      valoracionTecnica, 
      valoracionTactica, 
      valoracionFisica, 
      valoracionActitudinal, 
      comentarios 
    } = req.body;
    
    const nuevaValoracion = new Valoracion({
      jugador,
      fecha,
      valoracionTecnica,
      valoracionTactica,
      valoracionFisica,
      valoracionActitudinal,
      comentarios
    });
    
    const valoracionGuardada = await nuevaValoracion.save();
    res.status(201).json(valoracionGuardada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear la valoración', error: err.message });
  }
});

// Actualizar una valoración
router.put('/:id', async (req, res) => {
  try {
    const { 
      valoracionTecnica, 
      valoracionTactica, 
      valoracionFisica, 
      valoracionActitudinal, 
      comentarios 
    } = req.body;
    
    const valoracionActualizada = await Valoracion.findByIdAndUpdate(
      req.params.id,
      { 
        valoracionTecnica, 
        valoracionTactica, 
        valoracionFisica, 
        valoracionActitudinal, 
        comentarios 
      },
      { new: true, runValidators: true }
    );
    
    if (!valoracionActualizada) {
      return res.status(404).json({ mensaje: 'Valoración no encontrada' });
    }
    
    res.json(valoracionActualizada);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar la valoración', error: err.message });
  }
});

// Eliminar una valoración
router.delete('/:id', async (req, res) => {
  try {
    const valoracionEliminada = await Valoracion.findByIdAndDelete(req.params.id);
    
    if (!valoracionEliminada) {
      return res.status(404).json({ mensaje: 'Valoración no encontrada' });
    }
    
    res.json({ mensaje: 'Valoración eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar la valoración', error: err.message });
  }
});

module.exports = router;
