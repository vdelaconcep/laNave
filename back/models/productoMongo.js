import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    fechaYHoraAlta: {
        type: Date,
        default: Date.now
    },
    uuid: {
        type: String,
        required: true
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
        required: false
    }
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;