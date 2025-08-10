import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    emailUsuario: {
        type: String,
        required: true
    },
    carritoProductos: {
        type: [
            {
                id: String,
                producto: String,
                talle: String,
                cantidad: Number
            }
        ],
        required: true
    },
    codigoIngresado: {
        type: String
    },
    entrega: {
        formaEntrega: { type: String, required: true },
        direccion: {
            calle: { type: String },
            numero: { type: Number },
            pisoDto: { type: String },
            localidad: { type: String },
            departamento: { type: String },
            provincia: { type: String },
            cp: {type: String}
        }
    },
    modoDePago: {
        type: String,
        required: true
    },
    totalProductos: {
        type: Number,
        required: true
    },
    totalEnvio: {
        type: Number,
        required: true
    }
});

const Venta = mongoose.model('Venta', ventaSchema);

export default Venta;