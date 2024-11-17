const pool = require('../config/databaseController');

module.exports = {
    // Obtener todos los profesores
    obtenerTodosLosProfesores: async () => {
        try {
            const result = await pool.query('SELECT * FROM profesores');
            return result;
        } catch (error) {
            console.error('Ocurrió un error al obtener los profesores: ', error);
        }
    },

    // Obtener un profesor por ID
    obtenerProfesorPorId: async (idprofesor) => {
        try {
            const result = await pool.query('SELECT * FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result[0];
        } catch (error) {
            console.error('Ocurrió un error al obtener el profesor: ', error);
        }
    },

    // Agregar un nuevo profesor
    agregarProfesor: async (profesor) => {
        try {
            const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = profesor;
            const result = await pool.query(
                'INSERT INTO profesores (nombre, apellido, fecha_nacimiento, profesion, genero, email) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, apellido, fecha_nacimiento, profesion, genero, email]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un error al agregar el profesor: ', error);
            return false;
        }
    },

    // Actualizar un profesor
    actualizarProfesor: async (idprofesor, profesor) => {
        try {
            const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = profesor;
            const result = await pool.query(
                'UPDATE profesores SET nombre = ?, apellido = ?, fecha_nacimiento = ?, profesion = ?, genero = ?, email = ? WHERE idprofesor = ?',
                [nombre, apellido, fecha_nacimiento, profesion, genero, email, idprofesor]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un error al actualizar el profesor: ', error);
            return false;
        }
    },

    // Eliminar un profesor
    eliminarProfesor: async (idprofesor) => {
        try {
            const result = await pool.query('DELETE FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un error al eliminar el profesor: ', error);
            return false;
        }
    }
};
