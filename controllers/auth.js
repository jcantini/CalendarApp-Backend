// Controlador de las rutas de autenticación

const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt')

// Creación de un usuario
const createUser = async(req, res = response ) => {  // (1)
    const { email, password } = req.body;

    // voy a crear un nuevo usuario en la db
    try {
        // 1ero verifico si ya existe
        let user = await User.findOne({ email }); // (2)
        if ( user) {
            return res.status(400).json({
                ok: false,
                msg: 'email already in use'
            });
        }
        // creo una instacia de usuario
        user = new User( req.body ); // si viene info adicional no definida en el modelo, mongoose lo ignora

        // Encripto la password 
        // 1ero genero el salt (un string de info aleatoria que por default se genera con 10 ciclos)
        const salt = bcrypt.genSaltSync();
        // 2do encripto el password encriptado con el password que recibo del body aplicándole el salt.
        user.password = bcrypt.hashSync( password, salt);

        // Grabo/genero el usuario nuevo
        await user.save();

        // Al usuario creado, le genero el JWT
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please check issue with the IT' 
        });
    }
} 

// Login de un usuario
const userLogin = async (req, res = response ) => {  
    const { email, password } = req.body;

    try {
        // Verifico si el usuario existe
        const user = await User.findOne({ email }); 

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: "Usar dosen't exis"
            });
        }
        // Confirmar que el password recibido coincide con el encriptado en la db
        const validPassword = bcrypt.compareSync( password, user.password ); // devuelve true o false

        if( !validPassword) {
            res.status(400).json({
                ok: false,
                msg: 'Incorrect password'
            })
        }

        // Usuario validado, le genero el JWT
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please check issue with the IT' 
        });
    }
}

// Renovación del JWT
const renewToken = async(req, res = response ) => {  

    const { uid, name } = req;


    // Generar un nuevo JWT
    const token = await generateJWT( uid, name );

    res.status(200).json({
        ok: true,
        token
    });
}


module.exports =  {
    createUser,
    userLogin,
    renewToken
}


/*
(1)
res = response esto que hago no es obligatorio podria poner solo res pero haciéndolo así conservo
el tipado(la ayuda) de todo lo referente a express para res para cuando escribo res. me muestre la opciones.

Validacion típica que la reemplace por Express-validator para no tener tantas validaciones similares a la
siguiente:
    if ( name.length < 5 ) {
        return res.status(400).json({
            ok: false,
            msg: 'El nombre debe de ser de 5 o más letras'
        })
    }

(2)
A pesar de que email está definido como unique, en lugar de que mongo lo valide siempre es bueno que
yo haga el control de los campos.
*/