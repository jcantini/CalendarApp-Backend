// Custom middleware para validar que el JWT recibido es válido

const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) =>{
    // Recibo el JWT en el Header como x-token
    const token = req.header('x-token');

    // Valido el JWT
    if( !token ) { // Si no vino un token retorno
        return res.status(401).json({
            ok: false,
            msg: 'No JWT recived'
        })
    }

    try {
        const payload = jwt.verify( //(1)
            token,
            process.env.SECRET_JWT_SEED
        );
       // console.log(payload) // para ver que trae 
       // Me trae el uid y el name que están en el payload. Los puedo agregar al req que solo traía el JWT 
       // para que cuando next mande al próximo paso, req contenga además del token, el uid y el name
       req.uid = payload.uid;
       req.name = payload.name;
        
    } catch (error) { // el payload no coincide con la firma o el token ya expiró
        return res.status(401).json({
            ok: false,
            msg: 'Invalid JWT'
        })
    }

    next();

}

module.exports = {
    validarJWT
}

/*
(1)
Estoy verificando y también extrayendo el payload del token. Por lo tanto si alguien modificó el payload
del token también tendría que haber modificado la firma xq esta tambíen contiene todos los datos del payload.
Si el payload no coincide con la firma o si ya expiró, el token es inválido.
*/
