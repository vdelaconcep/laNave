import Venta from '../models/ventaMongo.js';

const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.find();

        if (!ventas) return res.status(404).json({error: 'No se encontraron ventas'})

        return res.status(200).json(ventas);
    } catch (err) {
        res.status(500).json({ error: `Error al obtener registro de ventas: ${err.message}` });
    }
};

export {
    obtenerVentas
}