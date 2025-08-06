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
        const mismoCodigo = await Codigo.findOne({ codigo: codigoNuevo.codigo })
        
        if (mismoCodigo) return res.status(400).json({ error: `ya existe el código que se intenta crear` });

        const codigo = new Codigo(codigoNuevo);
        const codigoGuardado = await codigo.save();
        res.status(200).send(codigoGuardado);
    } catch (err) {
        res.status(500).json({ error: `No se ha podido crear el código de descuento: ${err.message}` });
    }
};

const obtenerCodigos = async (req, res) => {
    try {
        const codigos = await Codigo.find();
        if (!codigos) return res.status(404).json({ error: 'No se encontraron códigos de descuento' });
        res.status(200).send(codigos);
    } catch (err) {
        res.status(500).json({ error: `No se ha podido obtener los códigos de descuento: ${err.message}` });
    }
}

const buscarCodigo = async (req, res) => {
    const codigoBuscado = req.params.codigo;
    try {
        const codigo = await Codigo.findOne({codigo: codigoBuscado});
        if (!codigo) return res.status(404).json({ error: 'No se encontró el código de descuento buscado' });
        res.status(200).send(codigo);
    } catch (err) {
        res.status(500).json({ error: `No se ha podido obtener el código de descuento buscado: ${err.message}` });
    }
}

const buscarCodigoPorID = async (req, res) => {
    const codigoIDBuscado = req.params.id;
    try {
        const codigo = await Codigo.findOne({uuid: codigoIDBuscado});
        if (!codigo) return res.status(404).json({ error: 'No se encontró el código de descuento' });
        res.status(200).send(codigo);
    } catch (err) {
        res.status(500).json({ error: `No se ha podido obtener el código de descuento: ${err.message}` });
    }
}

const eliminarCodigo = async (req, res) => {
    const idAEliminar = req.params.id;
    try {
        const codigo = await Codigo.findOneAndDelete({ uuid: idAEliminar });
        if (!codigo) return res.status(404).json({ error: 'No se encontró el código' });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: `No se ha podido eliminar el código de descuento: ${err.message}` });
    }
}

export {
    crearCodigo,
    obtenerCodigos,
    buscarCodigo,
    buscarCodigoPorID,
    eliminarCodigo
};