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
    stock: {
        type: Map,
        of: Number,
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