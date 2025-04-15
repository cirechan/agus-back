const express = require('express');
const router = express.Router();
const Partido = require('../models/Partido');
const Equipo = require('../models/Equipo');

// Obtener todos los partidos
router.get('/', async (req, res) => {
  try {
    // Filtros opcionales
    const filtros = {};
    
    if (req.query.equipo) {
      filtros.equipo = req.query.equipo;
    }
    
    if (req.query.temporada) {
      filtros.temporada = req.query.temporada;
    }
    
    if (req.query.ubicacion) {
      filtros.ubicacion = req.query.ubicacion;
    }
    
    // Filtro por rango de fechas
    if (req.query.fechaInicio && req.query.fechaFin) {
      filtros.fecha = {
        $gte: new Date(req.query.fechaInicio),
        $lte: new Date(req.query.fechaFin)
      };
    } else if (req.query.fechaInicio) {
      filtros.fecha = { $gte: new Date(req.query.fechaInicio) };
    } else if (req.query.fechaFin) {
      filtros.fecha = { $lte: new Date(req.query.fechaFin) };
    }
    
    // Filtro por resultado
    if (req.query.jugado === 'true') {
      filtros['resultado.jugado'] = true;
    } else if (req.query.jugado === 'false') {
      filtros['resultado.jugado'] = false;
    }
    
    const partidos = await Partido.find(filtros)
      .populate('equipo', 'nombre categoria')
      .populate('temporada', 'nombre')
      .sort({ fecha: 1, hora: 1 });
    
    res.json(partidos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener partidos', error: err.message });
  }
});
router.get("/test", async (req, res) => {
  try {
    const partidos = await Partido.find().limit(10)
    res.json({ mensaje: "Conexión OK", total: partidos.length, partidos })
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener partidos", error: err.message })
  }
})

// Obtener un partido por ID
router.get('/:id', async (req, res) => {
  try {
    const partido = await Partido.findById(req.params.id)
      .populate('equipo', 'nombre categoria')
      .populate('temporada', 'nombre');
    
    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }
    
    res.json(partido);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el partido', error: err.message });
  }
});

// Crear un nuevo partido
router.post('/', async (req, res) => {
  try {
    // Verificar que el equipo existe
    const equipo = await Equipo.findById(req.body.equipo);
    if (!equipo) {
      return res.status(400).json({ mensaje: 'El equipo especificado no existe' });
    }
    
    const nuevoPartido = new Partido(req.body);
    const partidoGuardado = await nuevoPartido.save();
    
    res.status(201).json(partidoGuardado);
  } catch (err) {
    // Manejar error de duplicado (mismo equipo, fecha y hora)
    if (err.code === 11000) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un partido para este equipo en la misma fecha y hora' 
      });
    }
    
    res.status(500).json({ mensaje: 'Error al crear el partido', error: err.message });
  }
});

// Actualizar un partido
router.put('/:id', async (req, res) => {
  try {
    const partidoActualizado = await Partido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!partidoActualizado) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }
    
    res.json(partidoActualizado);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar el partido', error: err.message });
  }
});

// Registrar resultado de un partido
router.patch('/:id/resultado', async (req, res) => {
  try {
    const { golesLocal, golesVisitante } = req.body;
    
    // Validar que los goles sean números no negativos
    if (golesLocal < 0 || golesVisitante < 0) {
      return res.status(400).json({ mensaje: 'Los goles no pueden ser negativos' });
    }
    
    const partidoActualizado = await Partido.findByIdAndUpdate(
      req.params.id,
      { 
        'resultado.golesLocal': golesLocal,
        'resultado.golesVisitante': golesVisitante,
        'resultado.jugado': true
      },
      { new: true, runValidators: true }
    );
    
    if (!partidoActualizado) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }
    
    res.json(partidoActualizado);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar el resultado', error: err.message });
  }
});

// Eliminar un partido
router.delete('/:id', async (req, res) => {
  try {
    const partidoEliminado = await Partido.findByIdAndDelete(req.params.id);
    
    if (!partidoEliminado) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }
    
    res.json({ mensaje: 'Partido eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el partido', error: err.message });
  }
});

// Obtener estadísticas de partidos por equipo
router.get('/estadisticas/equipo/:equipoId', async (req, res) => {
  try {
    const { equipoId } = req.params;
    
    // Verificar que el equipo existe
    const equipo = await Equipo.findById(equipoId);
    if (!equipo) {
      return res.status(400).json({ mensaje: 'El equipo especificado no existe' });
    }
    
    // Obtener todos los partidos jugados del equipo
    const partidos = await Partido.find({
      equipo: equipoId,
      'resultado.jugado': true
    });
    
    // Calcular estadísticas
    let victorias = 0;
    let empates = 0;
    let derrotas = 0;
    let golesFavor = 0;
    let golesContra = 0;
    
    partidos.forEach(partido => {
      const { golesLocal, golesVisitante } = partido.resultado;
      
      if (partido.ubicacion === 'casa') {
        golesFavor += golesLocal;
        golesContra += golesVisitante;
        
        if (golesLocal > golesVisitante) victorias++;
        else if (golesLocal === golesVisitante) empates++;
        else derrotas++;
      } else {
        golesFavor += golesVisitante;
        golesContra += golesLocal;
        
        if (golesVisitante > golesLocal) victorias++;
        else if (golesVisitante === golesLocal) empates++;
        else derrotas++;
      }
    });
    
    res.json({
      equipo: equipo.nombre,
      partidosJugados: partidos.length,
      victorias,
      empates,
      derrotas,
      golesFavor,
      golesContra,
      diferenciaGoles: golesFavor - golesContra
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: err.message });
  }

  
});

module.exports = router;

