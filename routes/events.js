// Rutes para el CRUD de eventos en el Calendar 
// host + /api/events


const { Router } = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { check } = require('express-validator'); // check se encarga de validar un campo en particular
const { fieldsValidator } = require('../middlewares/fields-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas las rutas tiene que estar validadas es decir que tienen que pasar por la validación del JWT
// Como el middleware se aplica a todas las rutas, en lugar de agregarlo en cada ruta hago:
router.use( validarJWT );

//  C Crear un evento
router.post('/', 
    [ // Middlewares
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Start date is required').custom( isDate ), // (1)
    check('end', 'End date is required').custom( isDate ),
    fieldsValidator // Este es el middleware que chequea el objeto check y si hay algún error no deja seguir.
    ], 
    createEvent 
);

//  R Obtener eventos
router.get('/', getEvents );

//  U Actualizar un evento
router.put('/:id',
  [ // Middlewares
  check('title', 'Title is required').not().isEmpty(),
  check('start', 'Start date is required').custom( isDate ), // (1)
  check('end', 'End date is required').custom( isDate ),
  fieldsValidator // Este es el middleware que chequea el objeto check y si hay algún error no deja seguir.
  ], 
  updateEvent 
);

//  D Eliminar un evento Solo va a poder eliminarlo quien lo creo
router.delete('/:id', deleteEvent );

module.exports = router;

/*
    (1)
    express-validator no tiene algo para validar fechas pero puedo crear una validación personalizada
    usando custom que espera recibir una función que se va a ejecutar para validar este campo. La 
    función la creo en helpers/isDate.js
*/
