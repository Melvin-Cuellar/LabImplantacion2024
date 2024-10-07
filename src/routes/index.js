//Este archivo será utilizado para configurar todas las rutas princiales del sistema
const express = require('express');
const router = express.Router();
const estudianteRepository = require('../repositories/EstudianteRepository');

//Configuració de ruta inicial de la app
router.get('/', async (request, response) => {
    //Probando conexión con la BD
    const lstEstudiantes = await estudianteRepository.obtenerTodosLosEstudiantes();
    console.log('Listado: ', lstEstudiantes);

    response.send('Bienvenido al laboratorio de IMPS ');
});

module.exports = router;