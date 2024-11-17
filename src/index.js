const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars'); // Necesario para utilizar el motor de plantillas Handlebars
const path = require('path');
const flash = require('connect-flash'); // Nos permite manejar mensajes en la sesion los cuales se guardan en memoria
// y se borran luego de ser mostrados
//-----------

//-----------
const session = require('express-session'); // Permite manejar sesiones, por ejemplo, para almacenar datos en la
// memoria del servidor, tambien se puede almacenar en la base de datos.
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport'); // necesario para autenticacion del usuario
// Inicializaciones
const app = express();

require('dotenv').config()

const { database } = require('./config/keys');

require('./lib/passportConfig'); // permite que passport se entere de la 


// Ajustes del servidor
app.set('port', process.env.PORT || 4500);
app.set('views', path.join(__dirname, 'views')); // Configuración de la ruta donde se encuentran las vistas

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main', // Configuración del layout principal
    layoutsDir: path.join(app.get('views'), 'layouts'), // Configuración de la ruta de los layouts
    partialsDir: path.join(app.get('views'), 'partials'), // Configuracion de vistas parciales
    extname: '.hbs', // Configura la extensión que tendrán los archivos Handlebars
    helpers: require('./lib/handlebars') // Configuracion de funciones
}));

app.set('view engine', '.hbs'); // Configuración para ejecutar el motor de plantillas

// ===== MIDDLEWARES ===
app.use(session({
    secret: process.env.SESSION_KEY, // Esta es la clave secreta de la sesión
    resave: false,                   // Para que no renueve la sesión
    saveUninitialized: false,        // Se deja en false para que no vuelva a establecer la sesión
    store: new MySQLStore(database)  // Se indica dónde se debe guardar la sesión
}));

app.use(flash());
app.use(morgan('dev')); // Configurando el middleware morgan para visualizar lo que está llegando al servidor
app.use(express.urlencoded({ extended: false })); // Sirve para aceptar datos desde formularios
app.use(passport.initialize()); // Para iniciar passport
app.use(passport.session()); // aca se le indica donde se deben guar los datos

// ==== VARIABLES GLOBALES =====
app.use((request, response, next) => {
    // Haciendo global el uso de flash
    app.locals.success = request.flash('success');
    app.locals.error = request.flash('error');
    app.locals.user = request.user; // manejo global del usuario
    next(); // Permite continuar con la ejecución del código
});

// Configuración de rutas
app.use(require('./routes')); // Node automáticamente busca el index.js del módulo
app.use(require('./routes/authentication'));
app.use('/estudiantes', require('./routes/estudiantes')); // Configuración de ruta para estudiantes
app.use('/carreras', require('./routes/carreras'));
app.use('/materias', require('./routes/materias'));
app.use('/profesores', require('./routes/profesores'));
app.use('/grupos', require('./routes/grupos'));
app.use('/grupo_estudiantes', require('./routes/grupo_estudiantes'));

// Archivos públicos (donde se coloca todo el código al que el navegador puede acceder)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en el puerto: ', app.get('port'));
});