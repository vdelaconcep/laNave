import mongoose from 'mongoose';

// Creación de esquema de contacto
const productoSchema = new mongoose.Schema({
    fechaYHoraAlta: {
        type: Date,
        default: Date.now
    },
    tipo: {
        type: String,
        required: true
    },
    banda: {
        type: String,
        required: true
    },
    modelo: {
        type: Number,
        required: true
    },
    stockU: {
        type: Number,
        required: true
    },
    stockXS: {
        type: Number,
        required: true
    },
    stockS: {
        type: Number,
        required: true
    },
    stockL: {
        type: Number,
        required: true
    },
    stockXL: {
        type: Number,
        required: true
    },
    stockXXL: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    descuento: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    destacado: {
        type: Boolean,
        required: true
    }
});

// Exportación del modelo "Producto"
const Producto = mongoose.model('Producto', productoSchema);

export default Producto;