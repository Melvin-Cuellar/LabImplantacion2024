const express = require('express');
const router = express.Router();
const queries = require('../repositories/CarreraRepository');

// Función para generar el nuevo ID basado en la inicial del nombre
async function generarIdNuevo(carrera) {
    // Asegurarse que el parámetro no esté vacío
    if (!carrera) {
        throw new Error("El nombre es necesario para generar un nuevo ID.");
    }

    let inicialNombre = carrera.charAt(0).toUpperCase(); // Tomar la inicial del nombre
    let numeroRegistro = 1; // Inicializar el número del registro

    // Verificar si el ID ya existe
    let nuevoId = inicialNombre + String(numeroRegistro).padStart(2, '0');

    let existeId = await queries.obtenerCarreraPorId(nuevoId);
    
    // Si existe, incrementar el número hasta encontrar uno disponible
    while (existeId) {
        numeroRegistro++;
        nuevoId = inicialNombre + String(numeroRegistro).padStart(2, '0');

        existeId = await queries.obtenerCarreraPorId(nuevoId);
    }

    return nuevoId;
}

// Endpoint para mostrar todos los registros
router.get('/', async (request, response) => {
    const carreras = await queries.obtenerTodasLasCarreras();
    response.render('carreras/listadoCarreras', {carreras}); // Mostramos el listado de estudiantes
});

// Endpoint que permite mostrar el formulario para agregar un nuevo registro
router.get('/agregarCarrera', async (request, response) => {
    response.render('carreras/agregarCarrera'); // Renderizamos el formulario
});

// Endpoint para agregar un registro
router.post('/agregarCarrera', async (request, response) => {
    const { carrera } = request.body; // Extraemos los datos del formulario
    
    const idGenerado = await generarIdNuevo(carrera);
    console.log('ID generado:', idGenerado); // Log del ID generado

    const resultado = await queries.crearCarrera({ idcarrera: idGenerado, carrera });
    if (resultado) {
        console.log('Carrera agregada con éxito');
        response.redirect('/carreras'); // Redirigimos al listado de registros
    } else {
        response.status(500).send('Error al agregar la carrera');
    }
});

// Endpoint que permite mostrar el formulario para editar un registro
router.get('/editarCarrera/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params; // Extraemos el ID del registro a editar
    const carrera = await queries.obtenerCarreraPorId(idcarrera);
    
    if (carrera) {
        response.render('carreras/editarCarrera', { carrera }); // Renderizamos el formulario de edición con los datos del registro
    } else {
        response.status(404).send('Carrera no encontrada');
    }
});

// Endpoint para editar un registro
router.post('/editarCarrera/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params;
    const { carrera } = request.body;
    const resultado = await queries.actualizarCarrera(idcarrera, { carrera });
    if (resultado) {
        console.log('Registro actualizado con éxito');
        response.redirect('/carreras');
    } else {
        response.status(500).send('Error al actualizar el registro');
    }
});

// Endpoint que permite eliminar un registro
router.get('/eliminar/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params;
    const resultado = await queries.eliminarCarrera(idcarrera);
    if (resultado) {
        console.log('Registro eliminado con éxito');
        response.redirect('/carreras'); // Redirigimos al listado de carreras
    } else {
        response.status(500).send('Error al eliminar el registro');
    }
});

module.exports = router;
