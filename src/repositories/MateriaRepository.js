const pool = require('../config/databaseController');

module.exports = {
    // Obtener todas las materias
    obtenerTodasLasMaterias: async () => {
        try {
            const result = await pool.query('SELECT * FROM materias');
            return result;
        } catch (error) {
            console.error('Ocurrió un error al obtener las materias: ', error);
        }
    },

    // Obtener una materia por ID
    obtenerMateriaPorId: async (idmateria) => {
        try {
            const result = await pool.query('SELECT * FROM materias WHERE idmateria = ?', [idmateria]);
            return result[0];
        } catch (error) {
            console.error('Ocurrió un error al obtener la materia: ', error);
        }
    },

    // Agregar una nueva materia
    agregarMateria: async (materia) => {
        try {
            const result = await pool.query('INSERT INTO materias (materia) VALUES (?)', [materia]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un error al agregar la materia: ', error);
            return false;
        }
    },

    // Actualizar una materia
    actualizarMateria: async (idmateria, materia) => {
        try {
            const result = await pool.query('UPDATE materias SET materia = ? WHERE idmateria = ?', [materia, idmateria]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un error al actualizar la materia: ', error);
            return false;
        }
    },

    // Eliminar una materia
    eliminarMateria: async (idmateria) => {
        try {
            const result = await pool.query('DELETE FROM materias WHERE idmateria = ?', [idmateria]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un error al eliminar la materia: ', error);
            return false;
        }
    }
};
