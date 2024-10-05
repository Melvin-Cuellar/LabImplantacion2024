const mysql = require('mysql2');
const { promisify } = require('util');
const { database } = require('./keys');
const { CONSTANTS } = require('../../utils/utils.js');

const pool = mysql.createPool(database); //Se crea el pool de conexiones

// Iniciando conexión con la base de datos
pool.getConnection((error, conexion) => {
    //Validar si la conexion tiene algún tipo de error
    if(error){
        //Validando códigod de error más comunes
        switch(error.code){
            case CONSTANTS.PROTOCOL_CONNECTION_LOST:
                //Indica que la conexion con la bd está perdida
                console.error('DATABASE CONNECTION WAS CLOSED');
                break;
            case CONSTANTS.ER_CON_COUNT_ERROR:
                //Indica que existen demasiadas conexiones
                console.error('DATABASE HAS TO MANY CONNECTIONS');
                break;                
            case CONSTANTS.ECONNREFUSED:
                //Indica que la conexion con la bd está perdida
                console.error('DATABASE CONNECTION WAS REFUSED');
                break;                
            case CONSTANTS.ER_ACCESS_DENIED_ERROR:
                //Indica que la conexion con la bd está perdida
                console.error('ACCESS DENIED FOR USER');
                break;                
            default:
                //Opción para validar que la opción solicitada está dentro de las opciones permitidas
                console.error('Error de bd no encontrado, fuera de rango');
                break;
        }
    }

    //Si la conexión es exitosa, imprimir un mensaje indicandolo
    if(conexion){
        console.log('Conexion establecida con la BD');
        conexion.release();
    }

    return;
});

//Configurando PROMISIFY para permitir en cada consulta un async/await (promesas)
pool.query = promisify(pool.query);

module.exports = pool;