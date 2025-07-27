import Mensaje from '../models/mensajeMongo.js';
import { v4 as uuidv4 } from 'uuid';

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

export { enviarMensaje };