const jwt = require('jsonwebtoken');

// La librería jsonwebtoken por el momento no trabaja con promesas sino con callbacks. Necesito trabajar
// con promesas para que cuando llame a la función generateJWT pueda usar el await y esperar que el jwt
// se genera. Para poder hacer que trabaje de esa manera, necesito retornar una Promesa. 
// Las promesas reciben un callback con el resolve y el reject

const generateJWT = ( uid, name ) => { // los argumentos son el payload que le voy a poner
    return new Promise( (resolve, reject) => {

        const payload = { uid, name };
        // Genero el JWT
        jwt.sign( payload, process.env.SECRET_JWT_SEED, { expiresIn: '2h'},
             ( err, token ) => {
                if ( err ) {
                    console.log( err );
                    reject('JWT could not be generated');
                }

                resolve( token )
        })
    })
}

module.exports = {
    generateJWT
}