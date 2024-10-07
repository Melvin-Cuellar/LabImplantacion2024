const express = require('express');
const router = express.Router();
const queries = require('../repositories/EstudianteRepository');

function desplazarLetra(letra) {
    // Desplazar la letra a la siguiente en el alfabeto
    const siguiente = String.fromCharCode(letra.charCodeAt(0) + 1);
    // Asegurarse de que la letra desplazada no exceda 'z'
    return siguiente <= 'z' ? siguiente : 'a'; 
}

async function generarIdNuevo(nombre, apellido, idcarrera) {
    // Asegurarse de que los parámetros no estén vacíos
    if (!nombre || !apellido || !idcarrera) {
        throw new Error("Nombre, apellido e idcarrera son necesarios para generar un nuevo ID.");
    }

    let parteNombre = nombre.substring(0, 2).toLowerCase();
    let parteApellido = apellido.charAt(0).toLowerCase() + apellido.charAt(apellido.length - 1).toLowerCase();
    
    let nuevoId = parteNombre + parteApellido + idcarrera;

    // Verificar si el nuevo ID ya existe
    let existeId = await queries.obtenerEstudiantePorId(nuevoId);
    
    // Si existe, se realiza desplazamiento de letra
    while (existeId) {
        // Intentar desplazando la última letra del nombre
        if (parteNombre.length > 1) {
            parteNombre = parteNombre.charAt(0) + desplazarLetra(parteNombre.charAt(1));
        } else {
            // Desplazar la primera letra del apellido si no hay más letras en el nombre
            parteApellido = desplazarLetra(parteApellido.charAt(0)) + parteApellido.charAt(1);
            parteNombre = 'a'; // Resetear nombre para iniciar con 'a'
        }

        nuevoId = parteNombre + parteApellido + idcarrera;
        existeId = await queries.obtenerEstudiantePorId(nuevoId); // Verificar nuevamente
    }

    return nuevoId;
}

// Endpoint para mostrar todos los estudiantes
router.get('/', async (request, response) => {
    const estudiantes = await queries.obtenerTodosLosEstudiantes();
    response.render('estudiantes/listado', {estudiantes}); // Mostramos el listado de estudiantes
});

// Endpoint que permite mostrar el formulario para agregar un nuevo estudiante
router.get('/agregar', async(request, response) => {
    // Renderizamos el formulario
    const carreras = await queries.obtenerTodasLasCarreras(); // Obtener las carreras de la base de datos
    response.render('estudiantes/agregar', {carreras}); //Enviar las carreras a la vista
});

// Endpoint para agregar un estudiante
router.post('/agregar', async(request, response) => {
    const { nombre, apellido, email, idcarrera, usuario } = request.body; // Extraemos los datos del formulario
    
    const IdGenerado = await generarIdNuevo(nombre, apellido, idcarrera);
    console.log('ID generado:', IdGenerado); // Log del ID generado

    const resultado = await queries.crearEstudiante({ idestudiante : IdGenerado, nombre, apellido, email, idcarrera, usuario });
    if (resultado) {
        console.log('Estudiante agregado con éxito');
        response.redirect('/estudiantes'); // Redirigimos al listado de estudiantes
    } else {
        response.status(500).send('Error al agregar el estudiante');
    }
});

// Endpoint que permite eliminar un estudiante
router.get('/eliminar/:idestudiante', async(request, response) => {
    // Desestructuramos el objeto que nos mandan en la peticion y extraemos el idestudiante
    const { idestudiante } = request.params;
    const resultado = await queries.eliminarEstudiante(idestudiante);
    if (resultado) {
        console.log('Estudiante eliminado con éxito');
        response.redirect('/estudiantes'); // Redirigimos al listado de estudiantes
    } else {
        response.status(500).send('Error al eliminar el estudiante');
    }
});
module.exports = router;
