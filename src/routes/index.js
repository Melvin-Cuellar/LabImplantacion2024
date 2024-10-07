//Este archivo será utilizado para configurar todas las rutas princiales del sistema
const express = require('express');
const router = express.Router();
const estudianteRepository = require('../repositories/EstudianteRepository');
const carreraRepository = require('../repositories/CarreraRepository');

//Configuración de ruta inicial de la app
router.get('/', async (request, response) => {
    //Probando conexión con la BD
    const lstEstudiantes = await estudianteRepository.obtenerTodosLosEstudiantes();
    const lstCarreras = await carreraRepository.obtenerTodasLasCarreras();
    console.log('Listado: ', lstCarreras);

    response.send('Bienvenido al laboratorio de IMPS ');
});

module.exports = router;