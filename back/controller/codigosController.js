import Codigo from '../models/codigoMongo.js';
import { v4 as uuidv4 } from 'uuid';

const crearCodigo = async (req, res) => {

    const uuid = uuidv4();

    let tipoProducto = req.body.tipoProducto;
    const esPlural = tipoProducto.slice(-1) === 's';
    if (esPlural) tipoProducto = tipoProducto.slice(0, -1);

    const codigoNuevo = {
        uuid: uuid,
        codigo: req.body.codigo,
        tipoProducto: tipoProducto,
        descuento: req.body.descuento,
        creadoPor: req.body.creadoPor,
        banda: req.body.banda ? req.body.banda : ''
    };

    try {
        const codigo = new Codigo(codigoNuevo);
        const codigoGuardado = await codigo.save();
        res.status(200).send(codigoGuardado);
    } catch (err) {
        res.status(500).json({ error: `No se ha podido crear el código de descuento: ${err.message}` });
    }
};

export {
    crearCodigo
};