const pool = require('../config/databaseController');

module.exports = {

    // Asignar grupo
    asignarGrupo: async(asignacion) => {
        try {
            const result = await pool.query("INSERT INTO grupo_estudiantes SET ? ",
            asignacion);
            console.log('resultado: ', result)
            return result;
        } catch (error) {
            console.log('Ocurrio un problema al asignar el grupo', error);
        }
    },

    obtenerTodosLosGrupos: async () => {
        try {
            const result = await pool.query(
                'SELECT g.*, m.materia, p.nombre AS profesor_nombre, p.apellido AS profesor_apellido FROM grupos g ' +
                'JOIN materias m ON g.idmateria = m.idmateria ' +
                'JOIN profesores p ON g.idprofesor = p.idprofesor'
            );
            return result;
        } catch (error) {
            console.error('Error al obtener grupos: ', error);
        }
    },

    agregarGrupo: async (grupo) => {
        try {
            const { num_grupo, anio, ciclo, idmateria, idprofesor } = grupo;
            const result = await pool.query(
                'INSERT INTO grupos (num_grupo, anio, ciclo, idmateria, idprofesor) VALUES (?, ?, ?, ?, ?)',
                [num_grupo, anio, ciclo, idmateria, idprofesor]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al agregar grupo: ', error);
            return false;
        }
    },

    obtenerGrupoPorId: async (idgrupo) => {
        try {
            const result = await pool.query(
                'SELECT * FROM grupos WHERE idgrupo = ?', [idgrupo]
            );
            return result[0];
        } catch (error) {
            console.error('Error al obtener grupo: ', error);
        }
    },

    actualizarGrupo: async (idgrupo, grupo) => {
        try {
            const { num_grupo, anio, ciclo, idmateria, idprofesor } = grupo;
            const result = await pool.query(
                'UPDATE grupos SET num_grupo = ?, anio = ?, ciclo = ?, idmateria = ?, idprofesor = ? WHERE idgrupo = ?',
                [num_grupo, anio, ciclo, idmateria, idprofesor, idgrupo]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar grupo: ', error);
            return false;
        }
    },

    eliminarGrupo: async (idgrupo) => {
        try {
            const result = await pool.query(
                'DELETE FROM grupos WHERE idgrupo = ?', [idgrupo]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar grupo: ', error);
            return false;
        }
    }
};
