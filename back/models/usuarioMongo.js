import mongoose from 'mongoose';

// Creación de esquema de Usuarios
const usuarioSchema = new mongoose.Schema({
    fechaYHoraRegistro: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    rol: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    nacimiento: {
        type: Date,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    }
});

// Exportación del modelo "Usuario"
const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;