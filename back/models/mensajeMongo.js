import mongoose from 'mongoose';

// Creación de esquema de contacto
const mensajeSchema = new mongoose.Schema({
    fechaYHora: {
        type: Date,
        default: Date.now
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
    }
});

// Exportación del modelo "Mensaje"
const Mensaje = mongoose.model('Mensaje', mensajeSchema);

export default Mensaje;