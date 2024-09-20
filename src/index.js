const express = require('express');

// Inicializaciones
const app = express();

// Ajustes del servidor
app.set('port', process.env.PORT || 4000);

// Iniciar el servidor
app.listen(app.get("port"), () => {
    console.log('Servidor iniciado en el puerto: ', app.get('port'));
});
