import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: String,
        required: true
    },
    carrito: {
        type: String,
        required: true
    }
});

const Venta = mongoose.model('Venta', ventaSchema);

export default Venta;