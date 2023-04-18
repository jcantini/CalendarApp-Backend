// Custom validator para fechas
const moment = require('moment');

const isDate = ( value ) => { // value lo pasa custom  de express-validator
    
    if (!value) {
        return false; // esto le indica a express-validator que la validacion fallo
    }

    const fecha = moment( value );
    if (fecha.isValid() ) { // funcion propia de moment
        return true
    } else {
        return false;
    }
}   

module.exports = {
    isDate
}