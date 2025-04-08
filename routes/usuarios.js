const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .populate('equipo', 'nombre categoria')
      .sort({ nombreUsuario: 1 });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: err.message });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .populate('equipo', 'nombre categoria');
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error: err.message });
  }
});

// Obtener usuario por nombre de usuario
router.get('/nombre/:nombreUsuario', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ nombreUsuario: req.params.nombreUsuario })
      .populate('equipo', 'nombre categoria');
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error: err.message });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombreUsuario, rol, equipo } = req.body;
    
    // Verificar si el nombre de usuario ya existe
    const usuarioExistente = await Usuario.findOne({ nombreUsuario });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }
    
    const nuevoUsuario = new Usuario({
      nombreUsuario,
      rol,
      equipo
    });
    
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear el usuario', error: err.message });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { nombreUsuario, rol, equipo } = req.body;
    
    // Verificar si el nombre de usuario ya existe (excepto para el usuario actual)
    if (nombreUsuario) {
      const usuarioExistente = await Usuario.findOne({ 
        nombreUsuario, 
        _id: { $ne: req.params.id } 
      });
      
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
      }
    }
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombreUsuario, rol, equipo },
      { new: true, runValidators: true }
    );
    
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuarioActualizado);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al actualizar el usuario', error: err.message });
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: err.message });
  }
});

// Acceso básico (login simple)
router.post('/acceso', async (req, res) => {
  try {
    const { nombreUsuario } = req.body;
    
    const usuario = await Usuario.findOne({ nombreUsuario })
      .populate('equipo', 'nombre categoria');
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json({
      mensaje: 'Acceso correcto',
      usuario
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el acceso', error: err.message });
  }
});

module.exports = router;
