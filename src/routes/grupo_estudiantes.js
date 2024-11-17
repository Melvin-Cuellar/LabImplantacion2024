const express = require('express');
const router = express.Router();
const queries = require('../repositories/GrupoEstudianteRepository');
const queriesGrupos = require('../repositories/GrupoRepository');
const queriesEstudiantes = require('../repositories/EstudianteRepository');
const { isLoggedIn } = require('../lib/auth');


// Ruta para mostrar todos los grupo_estudiantes
router.get('/',isLoggedIn, async (req, res) => {
    const grupoEstudiantes = await queries.obtenerTodosLosGrupoEstudiantes();
    res.render('grupo_estudiantes/listado', { grupoEstudiantes });
});

// Ruta para mostrar el formulario para agregar un grupo_estudiante
router.get('/agregar', isLoggedIn,  async (req, res) => {
    const grupos = await queriesGrupos.obtenerTodosLosGrupos();
    const estudiantes = await queriesEstudiantes.obtenerTodosLosEstudiantes();
    res.render('grupo_estudiantes/agregar', { grupos, estudiantes });
});

// Ruta para agregar un nuevo grupo_estudiante
router.post('/agregar',isLoggedIn,  async (req, res) => {
    const { idgrupo, idestudiante } = req.body;
    const resultado = await queries.agregarGrupoEstudiante({ idgrupo, idestudiante });
    
    if (resultado) {
        req.flash('success', 'Grupo estudiante agregado con éxito');
    } else {
        req.flash('error', 'Hubo un problema al agregar el grupo estudiante');
    }
    
    res.redirect('/grupo_estudiantes');
});

// Ruta para mostrar el formulario para editar un grupo_estudiante
router.get('/editar/:idgrupoestudiante', isLoggedIn, async (req, res) => {
    const { idgrupoestudiante } = req.params;
    const grupoEstudiante = await queries.obtenerGrupoEstudiantePorId(idgrupoestudiante);
    const grupos = await queriesGrupos.obtenerTodosLosGrupos();
    const estudiantes = await queriesEstudiantes.obtenerTodosLosEstudiantes();
    res.render('grupo_estudiantes/editar', { grupoEstudiante, grupos, estudiantes });
});

// Ruta para actualizar un grupo_estudiante
router.post('/editar/:idgrupoestudiante', isLoggedIn, async (req, res) => {
    const { idgrupoestudiante } = req.params;
    const { idgrupo, idestudiante } = req.body;
    const actualizacion = await queries.actualizarGrupoEstudiante(idgrupoestudiante, { idgrupo, idestudiante });
    
    if (actualizacion) {
        req.flash('success', 'Grupo estudiante actualizado con éxito');
    } else {
        req.flash('error', 'Hubo un problema al actualizar el grupo estudiante');
    }
    
    res.redirect('/grupo_estudiantes');
});

// Ruta para eliminar un grupo_estudiante
router.get('/eliminar/:idgrupoestudiante',isLoggedIn,  async (req, res) => {
    const { idgrupoestudiante } = req.params;
    const eliminacion = await queries.eliminarGrupoEstudiante(idgrupoestudiante);
    
    if (eliminacion) {
        req.flash('success', 'Grupo estudiante eliminado con éxito');
    } else {
        req.flash('error', 'Hubo un problema al eliminar el grupo estudiante');
    }
    
    res.redirect('/grupo_estudiantes');
});

module.exports = router;
