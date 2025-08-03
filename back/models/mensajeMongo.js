import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
    fechaYHora: {
        type: Date,
        default: Date.now
    },
    uuid: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    asunto: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    nuevo: {
        type: Boolean,
        default: true
    }
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

export default Mensaje;