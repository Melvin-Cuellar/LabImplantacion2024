const express = require('express');
const router = express.Router();
const queries = require('../repositories/MateriaRepository');
const { isLoggedIn } = require('../lib/auth');

// Mostrar todas las materias
router.get('/', isLoggedIn, async (request, response) => {
    const materias = await queries.obtenerTodasLasMaterias();
    response.render('materias/listado', { materias }); // Mostramos el listado de materias
});

// Mostrar el formulario para agregar una nueva materia
router.get('/agregar', (request, response) => {
    response.render('materias/agregar'); // Mostramos el formulario de agregar
});

// Agregar una nueva materia
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { materia } = request.body; // Extraemos los datos del formulario
    const resultado = await queries.agregarMateria(materia); // Insertamos en la base de datos

    if (resultado) {
        request.flash('success', 'Materia agregada con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al agregar la materia');
    }
    
    response.redirect('/materias'); // Redirigimos al listado de materias
});

// Mostrar el formulario para editar una materia
router.get('/editar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const materia = await queries.obtenerMateriaPorId(idmateria); // Obtener datos de la materia a editar
    response.render('materias/editar', { materia }); // Mostrar el formulario con los datos
});

// Actualizar una materia
router.post('/editar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const { materia } = request.body; // Nuevos datos
    const resultado = await queries.actualizarMateria(idmateria, materia); // Actualizamos los datos

    if (resultado) {
        request.flash('success', 'Materia actualizada con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al actualizar la materia');
    }
    
    response.redirect('/materias'); // Redirigimos al listado de materias
});

// Eliminar una materia
router.get('/eliminar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const resultado = await queries.eliminarMateria(idmateria); // Eliminamos la materia

    if (resultado > 0) {
        request.flash('success', 'Materia eliminada con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al eliminar la materia');
    }

    response.redirect('/materias');
});

module.exports = router;
