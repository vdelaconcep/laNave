import mongoose from 'mongoose';

const codigoSchema = new mongoose.Schema({
    fechaYHora: {
        type: Date,
        default: Date.now
    },
    uuid: {
        type: String,
        required: true
    },
    codigo: {
        type: String,
        required: true
    },
    tipoProducto: {
        type: String,
        required: true
    },
    banda: {
        type: String,
        required: false
    },
    descuento: {
        type: String,
        required: true
    },
    creadoPor: {
        type: String,
        required: true
    }
});

const Codigo = mongoose.model('Codigo', codigoSchema);

export default Codigo;