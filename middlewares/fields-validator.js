// Custom Middleware para validar campos

const { response } = require('express'); // para obtener el tipado de express
const { validationResult } = require('express-validator');

const fieldsValidator = ( req, res = response, next) => {

    // Manejo de errores
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) { //errors es un objeto de express-validator
        return res.status(400).json({ 
            ok: false,
            errors: errors.mapped()
        })
    };
    next();
}

module.exports = {
    fieldsValidator
}


/*
    El next es un callback que tengo que llamar si el moddleware se ejecuta correctamente
    Si se produce un error, el next no se ejecuta y se envía el error
*/