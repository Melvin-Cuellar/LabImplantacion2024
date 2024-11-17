const express = require('express');
const router = express.Router();
const queries = require('../repositories/ProfesorRepository');
const { isLoggedIn } = require('../lib/auth');

// Mostrar todos los profesores
router.get('/', isLoggedIn, async (request, response) => {
    let profesores = await queries.obtenerTodosLosProfesores();

    // Formateamos las fechas de nacimiento
    profesores = profesores.map(profesor => {
        const fechaNacimiento = new Date(profesor.fecha_nacimiento);
        profesor.fecha_nacimiento = fechaNacimiento.toISOString().slice(0, 10);
        return profesor;
    });

    response.render('profesores/listado', { profesores });
});

// Mostrar el formulario para agregar un nuevo profesor
router.get('/agregar', isLoggedIn, async(request, response) => {
    response.render('profesores/agregar'); // Mostramos el formulario de agregar
});

// Agregar un nuevo profesor
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body; // Extraemos los datos del formulario
    const resultado = await queries.agregarProfesor({ nombre, apellido, fecha_nacimiento, profesion, genero, email });

    if (resultado) {
        request.flash('success', 'Profesor agregado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al agregar el profesor');
    }

    response.redirect('/profesores'); // Redirigimos al listado de profesores
});

// Endpoint que permite mostrar el formulario para editar un profesor
router.get('/editar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    const profesor = await queries.obtenerProfesorPorId(idprofesor); // Obtener datos del profesor a editar

    // Formateamos la fecha para que sea compatible con el campo de tipo date (YYYY-MM-DD)
    const fechaNacimiento = new Date(profesor.fecha_nacimiento);
    profesor.fecha_nacimiento = fechaNacimiento.toISOString().slice(0, 10);

    response.render('profesores/editar', { profesor }); // Mostrar el formulario con los datos
});

// Actualizar un profesor
router.post('/editar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body; // Nuevos datos
    const resultado = await queries.actualizarProfesor(idprofesor, { nombre, apellido, fecha_nacimiento, profesion, genero, email });

    if (resultado) {
        request.flash('success', 'Profesor actualizado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al actualizar el profesor');
    }

    response.redirect('/profesores'); // Redirigimos al listado de profesores
});

// Eliminar un profesor
router.get('/eliminar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    const resultado = await queries.eliminarProfesor(idprofesor); // Eliminamos el profesor

    if (resultado > 0) {
        request.flash('success', 'Profesor eliminado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al eliminar el profesor');
    }

    response.redirect('/profesores');
});

module.exports = router;
