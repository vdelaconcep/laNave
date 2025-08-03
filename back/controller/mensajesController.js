import Mensaje from '../models/mensajeMongo.js';
import { v4 as uuidv4 } from 'uuid';
import transporter from '../config/nodemailer.js';

const enviarMensaje = async (req, res) => {
    
    const uuid = uuidv4();

    const mensajeNuevo = {
        uuid: uuid,
        nombre: req.body.nombre,
        email: req.body.email,
        asunto: req.body.asunto,
        mensaje: req.body.mensaje
    }

    try {
        const mensaje = new Mensaje(mensajeNuevo);
        const mensajeGuardado = await mensaje.save();
        res.status(200).send(mensajeGuardado);
    } catch (err) {
        res.status(500).json({ error: `No se ha podido enviar el mensaje: ${err.message}` });
    }
};

// Obtener todos los mensajes y actualizar nuevos (nuevos => recibidos)
const obtenerMensajes = async (req, res) => {
    
    try {
        const todos = await Mensaje.find();
        
        await Mensaje.updateMany({ nuevo: true }, { nuevo: false });

        return res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ error: `Error al obtener mensajes: ${err.message}` });
    }
}

// Obtener mensajes nuevos (no actualiza estado de mensajes)
const obtenerMensajesNuevos = async (req, res) => {
    try {
        const nuevos = await Mensaje.find({ nuevo: true });

        return res.status(200).json(nuevos);
    } catch (err) {
        res.status(500).json({ error: `Error al obtener mensajes nuevos: ${err.message}` });
    }
};

const eliminarMensaje = async (req, res) => {
    try {
        const eliminado = await Mensaje.findOneAndDelete({ uuid: req.params.id });

        if (!eliminado) return res.status(404).json({ error: 'Mensaje no encontrado' });

        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({ error: `Error al eliminar el mensaje: ${err.message}` });
    };
}

const responderMensaje = async (req, res) => {
    const { email, respuesta } = req.body;

    try {
        await transporter.sendMail({
            from: GOOGLE_CLIENT,
            to: email,
            subject: 'Respuesta a tu consulta',
            text: respuesta
        });

        return res.status(200).send("Respuesta enviada");
    } catch (err) {
        return res.status(500).json({ error: `Error al enviar respuesta: ${err.message}` });
    }
}

export {
    enviarMensaje,
    obtenerMensajes,
    obtenerMensajesNuevos,
    eliminarMensaje,
    responderMensaje
};