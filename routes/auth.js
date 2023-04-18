/*  Rutas de usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express'); // si ya lo tiene cargado en memoria, no lo vuelve a cargar
const { check } = require('express-validator'); // check se encarga de validar un campo en particular
const { fieldsValidator } = require('../middlewares/fields-validator');
const { createUser, userLogin, renewToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para registrar un usuario
router.post('/new', 
    [ // Middlewares
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'password is required with a min length of 6 characters').isLength({ min:6 }),
        fieldsValidator // Este es el middleware que chequea el objeto check y si hay algún error no deja seguir.
    ], 
    createUser 
);

// Ruta para loguear a un usuario
router.post('/',
    [ // Middlewares
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'password is required with a min length of 6 characters').isLength({ min:6 }),
        fieldsValidator
    ],
     userLogin
);

// Ruta para renovar el token del usuario
// El JWT viene en el header y con este middleware lo valido o genero uno nuevo
router.get('/renew', validarJWT,
    renewToken );


module.exports = router;        

/*
 check('name', 'Name is required')  check se encarga de validar un campo en particular. Le paso el nombre
 del campo, el mensaje de error que quiero emitir y la condición. No emite el error directamente porque puedo
 tener varios encadenados. Es un objeto que va almacenando los distintos errores que encuentrs. Al final del
 último check pongo fieldsValidator que es el middleware que chequea el objeto check y si hay algún error no 
 permite seguir.

 Mis custom middlewares como en este caso fieldsValidator siempre van al final de los otros.
*/