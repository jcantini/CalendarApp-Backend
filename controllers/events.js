// Controlador para las rutas del CRUD de Calendar
const { response } = require('express');
const Event = require('../models/Event');

// Crear un Evento
const createEvent = async (req, res = response ) => {

    const event = new Event( req.body ); // genero una instancia del modelo Event toda info adicional que venga
                                         // en el body pero no está definida en el modelo es ignorada
    try {
        event.user = req.uid; // (1)

        const newEvent = await event.save();

        res.status(200).json({
            ok: true,
            event: newEvent
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Couldn't create event. Please call IT"
        });
    }


};

// R Obtener Eventos
const getEvents = async (req, res = response ) => {

    try {
        const events = await Event.find() // (2)
                                .populate('user', 'name'); // (3)
        // (4)
        res.status(200).json({ 
            ok: true,
            events
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Couldn't recover the events list. Please call IT"
        });
    }
};


// U Actualizar un evento lo llamo con /23
const updateEvent = async (req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid; // que fue argegado en la validación del jwt

    try {
        const event = await Event.findById( eventId ); // Busco el id para ver si existe
        if ( !event ) {
            return res.status(401).json({
                ok: false,
                msg: "Event dosen't exist"
            });
        }

        // Controlo que la persona que quiere actualizar el evento es la misma que lo creo
        if ( event.user.toString() !== uid ) {
            return res.status(404).json({
                ok: false,
                msg: "Can't update event. It was created by another user."
            });
        }

        const newEvent = { 
            ...req.body, // desestructuro todo lo que me llega por el body y le agrego el id del user
            user: uid    // porque no me viene en el body
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } ); //(5)
        res.status(200).json({
            ok: true,
            event: eventUpdated
        });
            
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Couldn't update the event. Please call IT"
        });
        
    }
};

// D Eliminar un evento lo llamo con /23
const deleteEvent = async (req, res= response ) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId ); // Busco el id para ver si existe
        if ( !event ) {
            return res.status(401).json({
                ok: false,
                msg: "Can't find event."
            });
        }

        // Controlo que la persona que quiere eliminar el evento es la misma que lo creo
        if ( event.user.toString() !== uid ) {
            return res.status(404).json({
                ok: false,
                msg: "Not authorized to delete this event"
            });
        }

        await Event.findByIdAndDelete( eventId ); 
        res.status(200).json({
            ok: true
        });
            
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Couldn't delete the event. Please call IT"
        });
        
    }
};


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}

/*
(1)
Antes de grabar la nota tengo que escribir la propiedad user que está definida en el modelo y completarla
con el id del usuario que lo está generando. El uid que viene, lo había qgregado cuando validé el JWT

(2)
En el find puedo aplicar filtros y paginación. 

(3)
Con populate le pido que me traiga también los campos  que están asociados al campo user del evento.
Si pusiera .populate(), me trae todos los campos. En mi caso especifiqué cuales quiero que me traiga
Para que por ej me traiga name y password pongo .pupulate('user','name password')

(4)
En la respuesta que envio con el json, puedo desestructurar info que viene de mongo
para x ej renombrar _id que me viene de mongo de user._id directamente como uid como lo hago en para 
el login del usuario y así queda uniforme en el front como uid para ambos
 
(5)
Cuando se actualiza, el findByIdAndUpdate siempre devuelve el documento como estaba antes de actualizar 
por si quiero comparar alg[un valor. Si quiero que en lugar de esto me devuelva el documento actualizado
tengo que pasarle un 3er argumento con algunas opciones. En este caso seria { new: true }
*/