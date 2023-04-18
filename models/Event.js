const { Schema, model } = require('mongoose');

const EventSchema = Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: { // usuario que creo este registro
        type: Schema.Types.ObjectId,
        ref: 'User', //  es el nombre de referencia que le di al modelo de usuario
        required: true
    }
});

EventSchema.method('toJSON', function() { // (2)
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;                     
});

module.exports = model('Event', EventSchema ); // le indico un nombre de referencia y el nombre del schema

/*
Schema.Types.ObjectId  esto le indica a monggose que es una referencia que la espscifico al modelo 'Usuario'
y que es tipo _id de mongo.

Cuando se genera un registro mongo al id le pone el nombre _id y también me genera la verión del documento
__v  Mongoose serializa la repuesta que me devuelve usando el toJSON. Si quiero que me devuelva _id con
otro nombre y no quiero que me pase el __v puedo modificar esta serialización.
Pero ojo porque esto vale solo para la respuesta que me devuelve mongo q lo veo en Postman o le llega al front
En la DB va a estar el __v y _id
(2) Esta modificación la hago así:
Uso function en lugar de => xq necesito usar this que me referencia a todo el objeto que se esta serializando.
Esto me permite acceder a cada una de las propiedades de este objeto. Entonces extraigo __v, _id y en 
...object me queda el resto de las propiedades. Retorno solo object al que le agregue la propiedad id que es 
el nombre que quiero que tenga.
*/
