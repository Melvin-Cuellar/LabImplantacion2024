const express = require('express');
const router = express.Router();
const queries = require('../repositories/GrupoRepository');
const queriesMaterias = require('../repositories/MateriaRepository');
const queriesProfesores = require('../repositories/ProfesorRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los grupos
router.get('/',isLoggedIn,  async (req, res) => {
    const grupos = await queries.obtenerTodosLosGrupos();
    res.render('grupos/listado', { grupos });
});

// Endpoint para mostrar el formulario para agregar un grupo
router.get('/agregar',isLoggedIn,  async (req, res) => {
    const materias = await queriesMaterias.obtenerTodasLasMaterias();
    const profesores = await queriesProfesores.obtenerTodosLosProfesores();
    res.render('grupos/agregar', { materias, profesores });
});

// Endpoint para agregar un grupo
router.post('/agregar', isLoggedIn, async (req, res) => {
    const { num_grupo, anio, ciclo, idmateria, idprofesor } = req.body;
    const resultado = await queries.agregarGrupo({ num_grupo, anio, ciclo, idmateria, idprofesor });
    
    if (resultado) {
        req.flash('success', 'Grupo agregado con éxito');
    } else {
        req.flash('error', 'Ocurrió un problema al agregar el grupo');
    }
    res.redirect('/grupos');
});

// Endpoint para mostrar el formulario para editar un grupo
router.get('/editar/:idgrupo', isLoggedIn, async (req, res) => {
    const { idgrupo } = req.params;
    const grupo = await queries.obtenerGrupoPorId(idgrupo);
    const materias = await queriesMaterias.obtenerTodasLasMaterias();
    const profesores = await queriesProfesores.obtenerTodosLosProfesores();
    res.render('grupos/editar', { grupo, materias, profesores });
});

// Endpoint para actualizar un grupo
router.post('/editar/:idgrupo', isLoggedIn, async (req, res) => {
    const { idgrupo } = req.params;
    const { num_grupo, anio, ciclo, idmateria, idprofesor } = req.body;
    const actualizacion = await queries.actualizarGrupo(idgrupo, { num_grupo, anio, ciclo, idmateria, idprofesor });
    
    if (actualizacion) {
        req.flash('success', 'Grupo actualizado con éxito');
    } else {
        req.flash('error', 'Ocurrió un problema al actualizar el grupo');
    }
    res.redirect('/grupos');
});

// Endpoint para eliminar un grupo
router.get('/eliminar/:idgrupo', isLoggedIn, async (req, res) => {
    const { idgrupo } = req.params;
    const eliminacion = await queries.eliminarGrupo(idgrupo);
    
    if (eliminacion) {
        req.flash('success', 'Grupo eliminado con éxito');
    } else {
        req.flash('error', 'Ocurrió un problema al eliminar el grupo');
    }
    res.redirect('/grupos');
});

//--------------------------------
// Endpoint que permite navegar a la pantalla para asignar un grupo
router.get('/asignargrupo/:idgrupo', isLoggedIn, async (request, response) => {
    const { idgrupo } = request.params;
    const lstEstudiantes = await estudiantesQuery.obtenerTodosLosEstudiantes();
    response.render('grupos/asignargrupo', { lstEstudiantes, idgrupo });
});

// Endpoint que permite asignar un grupo
router.post('/asignargrupo', isLoggedIn, async (request, response) => {
    const data = request.body;
    let resultado = null;
    const result = processDataFromForm(data);
    for (const tmp of result.grupo_estudiantes) {
        resultado = await queries.asignarGrupo(tmp);
    }
    if (resultado) {
        request.flash('success', 'Asignación de grupo realizada con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al realizar la asignación');
    }
    response.redirect('/grupos');
});

// Función para procesar los datos del formulario
function processDataFromForm(data) {
    const result = {
        grupo_estudiantes: []
    };
    for (const key in data) {
        if (key.startsWith('grupo_estudiantes[')) {
            const match = key.match(/\[(\d+)\]\[(\w+)\]/);
            if (match) {
                const index = parseInt(match[1]);
                const property = match[2];
                if (!result.grupo_estudiantes[index]) {
                    result.grupo_estudiantes[index] = {};
                }
                result.grupo_estudiantes[index][property] = data[key];
            }
        } else {
            result[key] = data[key];
        }
    }
    return result;
}

module.exports = router;
