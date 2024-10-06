const pool = require('../config/databaseController.js');

module.exports = {

    //Consulta para obtener todos los estudiantes
    obtenerTodosLosEstudiantes: async() =>{
        try{
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        }catch(error){
            console.error('Ocurrio un problema al consultar la lista de estudiantes: ', error);
        }
    },

     // Crear un nuevo estudiante
     crearEstudiante: async (nuevoEstudiante) => {
        try {
            const { nombre, edad, grado } = nuevoEstudiante; // Asumiendo que los datos de estudiante tienen estas propiedades
            const result = await pool.query(
                'INSERT INTO estudiantes (nombre, edad, grado) VALUES (?, ?, ?)',
                [nombre, edad, grado]
            );
            return result.insertId;  // Retornamos el ID del nuevo estudiante
        } catch (error) {
            console.error('Ocurrió un problema al crear el estudiante: ', error);
        }
    },

    // Actualizar un estudiante
    actualizarEstudiante: async (idestudiante, estudianteActualizado) => {
        try {
            const { nombre, edad, grado } = estudianteActualizado;
            const result = await pool.query(
                'UPDATE estudiantes SET nombre = ?, edad = ?, grado = ? WHERE idestudiante = ?',
                [nombre, edad, grado, idestudiante]
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

