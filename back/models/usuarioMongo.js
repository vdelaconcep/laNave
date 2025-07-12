import mongoose from 'mongoose';

// Creación de esquema de Usuarios
const usuarioSchema = new mongoose.Schema({
    fechaYHoraRegistro: {
        type: Date,
        default: Date.now
    },
    rol: {
        type: String,
        default: 'cliente'
    },
    uuid: {
        type: String,
        required: true
    },
    nombreYApellido: {
        type: String,
        required: true
    },
    nacimiento: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    telefono: {
        type: String,
        required: false
    },
    passwordHash: {
        type: String,
        required: true
    }
});

// Exportación del modelo "Usuario"
const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;