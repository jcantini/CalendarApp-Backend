const express = require('express');
require('dotenv').config(); // 
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Conexión a la base de datos
dbConnection();

// CORS Poniéndolo acá se lo aplico a todas las rutas
app.use( cors() );

// Directorio público
// Lo que quiero es que cuando se entra al directorio raiz / se muestre el index.html que esta en public.
app.use( express.static('./public'));

// Lectura y parseo de la info que se recibe del body
app.use( express.json() ); // las peticiones que vienenen formato json las proceso y extraigo el contenido.

// Rutas
// Rutas de autenticacion
app.use('/api/auth', require('./routes/auth')); // (1) 

// Rutas para CRUD de los eventos
app.use('/api/events', require('./routes/events'));


// Escuchar peticiones
// El 1er param es el puerto que le asigno y el 2do es un callback que se ejecuta cuando se haya levantado
// el servidor
app.listen( process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`)
})

/* 
use en un middleware de express que es una función que se ejecuta cuando llega una petición al server.
En este caso lo uso para establecer cual es el directorio público. Acá es donde estará el front

process.env me permite acceder a las variables de entorno y a todos los proceso corriendo dentro de node

(1)
Endpoint para manejar todo lo relacionado con la autenticación. Todo lo que ese archivo tiene como exportado
queda habilitado para este endpoint o ruta

*/