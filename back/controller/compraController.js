import Producto from '../models/productoMongo.js';
import Codigo from '../models/codigoMongo.js';
import Venta from '../models/ventaMongo.js';

const compraProducto = async (req, res) => {
    const carrito = req.body.carrito;

    let carritoProductos = carrito
        .filter(item => item.hasOwnProperty('cantidad'))
        .map(producto => ({
            ...producto,
            talle: producto.talle === '' ? 'U' : producto.talle
        }));

    // Verificación de stock
    const productosSinStock = [];
    const productosAComprarBD = [];

    for (let producto of carritoProductos) {
        try {
            const aChequear = await Producto.findOne({ uuid: producto.id });
            if (!aChequear) {
                productosSinStock.push({
                    id: producto.id,
                    error: "Producto no encontrado"
                });
                continue;
            }

            producto.producto = `${aChequear.tipo[0].toUpperCase() + aChequear.tipo.slice(1)} ${aChequear.banda} #${aChequear.modelo}`;

            const stockDisponible = aChequear.stock.get(producto.talle);

            if (stockDisponible === undefined) {
                productosSinStock.push({
                    nombre: producto.producto,
                    talle: producto.talle,
                    error: "Talle no disponible"
                });
                continue;
            }

            if (producto.cantidad > stockDisponible) {
                productosSinStock.push({
                    nombre: producto.producto,
                    talle: producto.talle,
                    cantidadSolicitada: producto.cantidad,
                    stockDisponible
                });
            }

            productosAComprarBD.push(aChequear);

        } catch (err) {
            return res.status(500).json({ error: `Error verificando stock: ${err.message}` });
        }
    }

    if (productosSinStock.length > 0) {
        return res.status(409).json({
            error: "Stock insuficiente",
            productos: productosSinStock
        });
    }

    // Cálculo del total a pagar
    const entregaObj = carrito.find(item => item.hasOwnProperty('entrega'));
    const entrega = entregaObj.entrega;

    let totalEnvio = 0;
    if (entrega && entrega.formaEntrega === 'correo') {
        const provincia = entrega.direccion.provincia;

        if (provincia === 'Buenos Aires') {
            totalEnvio = 4000;
        } else if (provincia === 'Ciudad Autónoma de Buenos Aires') {
            totalEnvio = 5000;
        } else if (['Entre Ríos', 'Corrientes', 'Córdoba', 'La Pampa', 'Santa Fe'].includes(provincia)) {
            totalEnvio = 7000;
        } else if (['Chaco', 'Chubut', 'Formosa', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'San Luis', 'Santiago del Estero', 'Tucumán'].includes(provincia)) {
            totalEnvio = 9000;
        } else totalEnvio = 11000;
    }

    let totalProductos = 0;

    let carritoCodigoObj = carrito.find(item => item.hasOwnProperty('codigo'));
    let carritoCodigo = carritoCodigoObj?.codigo || '';

    let codigo = {};

    if (carritoCodigo !== '') {
        try {
            codigo = await Codigo.findOne({ codigo: carritoCodigo });

            if (!codigo) return res.status(404).json({ error: 'Código de descuento no encontrado. No se ha realizado la compra' });

        } catch (err) {
            return res.status(500).json({ error: `Error al aplicar el código de descuento ingresado. No se ha podido efectuar la compra: ${err.message}` });
        }
    }

    let codigoArmado = '';
    if (codigo?.descuento && codigo?.tipoProducto) {
        const productoTexto = codigo.tipoProducto === 'todo'
            ? 'todos los productos'
            : `${codigo.tipoProducto}s`;
        const bandaTexto = codigo.banda ? ` de ${codigo.banda}` : '';

        codigoArmado = `${codigo.descuento}% sobre ${productoTexto}${bandaTexto}`;
    }

    for (const producto of carritoProductos) {
        const productoBD = productosAComprarBD.find(item => item.uuid === producto.id);
        let totalProducto = productoBD.precio * producto.cantidad;

        if (productoBD.descuento && typeof productoBD.descuento === 'number' && productoBD.descuento > 0) totalProducto = totalProducto * (1 - productoBD.descuento / 100);

        if (Object.keys(codigo).length > 0) {
            let aplicaBanda = false;
            let aplicaTipo = false;

            if (codigo.tipoProducto === 'todo') {
                aplicaTipo = true;
            } else aplicaTipo = codigo.tipoProducto === productoBD.tipo;

            if ('banda' in codigo &&
                typeof codigo.banda === 'string' && codigo.banda.trim().length > 0) {
                aplicaBanda = productoBD.banda.toLowerCase().includes(codigo.banda.toLowerCase());
            } else aplicaBanda = true;

            if (aplicaBanda && aplicaTipo) totalProducto = totalProducto * (1 - codigo.descuento / 100);
        };

        totalProductos += totalProducto;
    };

    const pago = carrito.find(item => item.hasOwnProperty('modoPago'));
    if (pago && pago.modoPago === 'transferencia') totalProductos = totalProductos * 0.8;

    // Modificación de stock en base de datos de productos
    for (const producto of carritoProductos) {
        try {
            await Producto.updateOne(
                { uuid: producto.id },
                { $inc: { [`stock.${producto.talle}`]: -producto.cantidad } });

        } catch (err) {
            return res.status(500).json({ error: `Error: no se ha podido modificar el stock: ${err.message}` });
        }
    }

    // Armado de registro de la transacción para guardar en base de datos

    const usuario = carrito.find(item => item.hasOwnProperty('usuario'));

    let nuevaVenta = {
        emailUsuario: usuario.usuario,
        carritoProductos: carritoProductos,
        codigoIngresado: codigoArmado || '',
        entrega: entrega ? {
            formaEntrega: entrega.formaEntrega,
            direccion: entrega.direccion
        } : null,
        modoDePago: pago.modoPago,
        totalProductos: totalProductos,
        totalEnvio: totalEnvio
    };

    try {
        const venta = new Venta(nuevaVenta);
        const registroGuardado = await venta.save();
        res.status(200).json({
            mensaje: 'La compra se ha registrado con éxito',
            venta: registroGuardado
        });
    } catch (err) {
        res.status(500).json({ error: `No se ha podido registrar la compra: ${err.message}` });
    }
};

export {
    compraProducto
};