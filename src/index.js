const express = require('express');

// Inicializaciones
const app = express();

require('dotenv').config();

// Ajustes del servidor
app.set('port', process.env.PORT || 4500);

//Configuración de rutas
app.use(require('./routes')); //Node automaticamente busca el index.js del módulo

// Iniciar el servidor
app.listen(app.get("port"), () => {
    console.log('Servidor iniciado en el puerto: ', app.get('port'));
});
