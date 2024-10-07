const pool = require('../config/databaseController.js');

module.exports = {

    // Consulta para obtener todas las carreras para los combobox
    obtenerTodasLasCarreras: async () => {
        try {
            const result = await pool.query('SELECT * FROM carreras');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al obtener las carreras: ', error);
        }
    },

    //Consulta para obtener todos los estudiantes
    obtenerTodosLosEstudiantes: async() =>{
        try{
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        }catch(error){
            console.error('Ocurrio un problema al consultar la lista de estudiantes: ', error);
        }
    },
    
    // Consulta para obtener un estudiante por su ID
    obtenerEstudiantePorId: async (idestudiante) => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result.length > 0 ? result[0] : null;  // Si no existe, retornamos null
        } catch (error) {
            console.error('Ocurrió un problema al obtener el estudiante: ', error);
        }
    },

     // Crear un nuevo estudiante
     crearEstudiante: async (nuevoEstudiante) => {
        try {
            const { idestudiante, nombre, apellido, email, idcarrera, usuario } = nuevoEstudiante; // Asumiendo que los datos de estudiante tienen estas propiedades
            const result = await pool.query(
                'INSERT INTO estudiantes (idestudiante, nombre, apellido, email, idcarrera, usuario) VALUES (?, ?, ?, ?, ?, ?)',
                [idestudiante, nombre, apellido, email, idcarrera, usuario ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un problema al crear el estudiante: ', error);
        }
    },

    // Actualizar un estudiante
    actualizarEstudiante: async (idestudiante, estudianteActualizado) => {
        try {
            const { nombre, apellido, email, idcarrera, usuario } = estudianteActualizado;
            const result = await pool.query(
                'UPDATE estudiantes SET nombre = ?, apellido = ?, email = ?, idcarrera = ?, usuario = ? WHERE idestudiante = ?',
                [nombre, apellido, email, idcarrera, usuario, idestudiante]
            );
            return result.affectedRows > 0;  // Retornamos si se actualizó correctamente
        } catch (error) {
            console.error('Ocurrió un problema al actualizar el estudiante: ', error);
        }
    },
    
    // Eliminar un estudiante
    eliminarEstudiante: async(idestudiante) => {
        try{
            const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result.affectedRows > 0;
        }catch(error){
            console.error('Erro al eliminar el registro', error);
        }
    }
}

