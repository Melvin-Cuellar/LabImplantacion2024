const pool = require('../config/databaseController.js');

module.exports = {

    // Consulta para obtener todos los registros
    obtenerTodasLasCarreras: async () => {
        try {
            const result = await pool.query('SELECT * FROM carreras');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al obtener los registros: ', error);
        }
    },
    
    // Consulta para obtener un registro por su ID
    obtenerCarreraPorId: async (idcarrera) => {
        try {
            const result = await pool.query('SELECT * FROM carreras WHERE idcarrera = ?', [idcarrera]);
            return result.length > 0 ? result[0] : null;  // Si no existe, retornamos null
        } catch (error) {
            console.error('Ocurrió un problema al obtener el registro: ', error);
        }
    },

     // Crear un nuevo registro
     crearCarrera: async (nuevaCarrera) => {
        try {
            const { idcarrera, carrera } = nuevaCarrera; // Asumiendo que los datos del objeto tienen estas propiedades
            const result = await pool.query(
                'INSERT INTO carreras (idcarrera, carrera) VALUES (?, ?)',
                [idcarrera, carrera ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ocurrió un problema al crear el registro: ', error);
        }
    },

    // Actualizar un registro
    actualizarCarrera: async (idcarrera, carreraActualizada) => {
        try {
            const { carrera} = carreraActualizada;
            const result = await pool.query(
                'UPDATE carreras SET carrera = ? WHERE idcarrera = ?',
                [carrera, idcarrera]
            );
            return result.affectedRows > 0;  // Retornamos si se actualizó correctamente
        } catch (error) {
            console.error('Ocurrió un problema al actualizar el registro: ', error);
        }
    },
    
    // Eliminar un registro
    eliminarCarrera: async(idcarrera) => {
        try{
            const result = await pool.query('DELETE FROM carreras WHERE idcarrera = ?', [idcarrera]);
            return result.affectedRows > 0;
        }catch(error){
            console.error('Erro al eliminar el registro', error);
        }
    }
}

