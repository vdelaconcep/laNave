import Producto from '../models/productoMongo.js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ingresar nuevo producto en la base de datos
const altaProducto = async (req, res) => {

    // Si se envió una imagen del producto:
    let imagen = req.file || "";

    if (req.file) {

        // Verificar proporción de imagen
        const metadata = await sharp(req.file.buffer).metadata();
        const ratio = metadata.width / metadata.height;
        const diferenciaRelativa = Math.abs(ratio - 1);

        if (diferenciaRelativa > 0.2) {
            return res.status(400).json({ error: "La relación de aspecto de la imagen debe ser cercana a 1:1 para evitar distorsiones" });
        }

        // Redimensionar imagen
        const imagenRedimensionada = await sharp(req.file.buffer)
            .resize(310, 300)
            .jpeg({ quality: 100 })
            .toBuffer();
        
        // Subir imagen a Cloudinary
        try {
            const imagenBase64 = `data:image/jpeg;base64,${imagenRedimensionada.toString('base64')}`;

            const result = await cloudinary.uploader.upload(imagenBase64, {
                resource_type: "image"
            });

            imagen = result.secure_url;

        } catch (err) {
            return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${err.message}` });
        }
    }
    
    // Definir número del modelo
    const banda = req.body.banda;
    const tipo = req.body.tipo;
    let modelo;

    try {
        const productos = await Producto.find({ tipo: tipo, banda: banda });
        let ultimoModelo
        if (productos.length > 0) {
            const modelos = productos.map(producto => producto.modelo || 0);
            ultimoModelo = Math.max(...modelos);
        } else ultimoModelo = 0;
        modelo = ultimoModelo + 1;
        
    } catch (err) {
        return res.status(500).json({ error: `Error al recuperar productos de la base de datos: ${err.message}` });
    }

    const uuid = uuidv4();

    // Parsear valores recibidos como string
    const stock = typeof req.body.stock === 'string' ? JSON.parse(req.body.stock) : req.body.stock;
    const stockNumerico = {};
    for (const [talle, cantidad] of Object.entries(stock)) {
        stockNumerico[talle] = Number(cantidad);
    };

    const precio = Number(req.body.precio);
    const descuento = req.body.descuento ? Number(req.body.descuento) : 0;

    // Guardar en la base de datos (nueva entrada)
    const productoNuevo = {
        uuid: uuid,
        tipo: tipo,
        banda: banda,
        modelo: modelo,
        stock: stockNumerico,
        precio: precio,
        imagen: imagen,
        descuento: descuento
    };

    try {
        const producto = new Producto(productoNuevo);
        const productoGuardado = await producto.save();
        return res.status(200).send(productoGuardado);
    } catch (err) {
        return res.status(500).json({ error: `El producto no pudo ingresarse en la base de datos: ${err.message}` });
    }
};

// Obtener productos de la base de datos
const obtenerProductos = async (req, res) => {

    let productos;
    const predefinidos = ['remeras', 'buzos', 'mochilas'];
    try {
        // Obtener por id
        if (req.query.id) {
            productos = await Producto.findOne({uuid: req.query.id})
        }

        // Productos recientes
        if (req.query.recientes) {
            productos = await Producto.find()
                .sort({ fechaYHoraAlta: -1 })
                .limit(11);
        }

        // Obtener productos por tipo
        if (req.query.tipo) {
            if (req.query.tipo === 'todos') {
                productos = await Producto.find();
            } else {
                if (predefinidos.includes(req.query.tipo)) {
                    const filtro = req.query.tipo.slice(0, -1);
                    productos = await Producto.find({ tipo: filtro });
                } else productos = await Producto.find({ tipo: {$nin: ['remera', 'buzo', 'mochila']} });
            }
        };

        // Para búsqueda por banda
        if (req.query.banda) {
            const regex = new RegExp(req.query.banda.trim().replace(/\s+/g, '.*'), 'i');
            productos = await Producto.find({ banda: regex });
        };

        // Para obtener ofertas (productos con descuento)
        if (req.query.descuento) productos = await Producto.find({ descuento: {$gt: 0} });

        if (productos && !req.query.id) {
            const productosOrdenados = productos.sort((a, b) => new Date(b.fechaYHoraAlta) - new Date(a.fechaYHoraAlta));
            return res.status(200).json(productosOrdenados);

        } else if (productos && req.query.id) {
            return res.status(200).json(productos);

        } else return res.status(404).json({ error: `${req.query.id ? 'Producto no encontrado' : 'Productos no encontrados'}` })
    } catch (err) {
        return res.status(500).json({ error: `Error al obtener ${req.query.id ? 'producto' : 'productos'}` });
    };
};

// Modificar producto en la base de datos
const actualizacionProducto = async (req, res) => {

    // Encontrar producto a actualizar
    let productoAActualizar;
    try {
        const producto = await Producto.findOne({ uuid: req.params.id });
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        productoAActualizar = producto;
    } catch (err) {
        return res.status(500).json({ error: `Error al obtener producto de la base de datos: ${err.message}` });
    };

    // Si se envió una nueva imagen del producto:
    let imagen = "";

    if (req.file) {

        // Verificar proporción de imagen
        const metadata = await sharp(req.file.buffer).metadata();
        const ratio = metadata.width / metadata.height;
        const diferenciaRelativa = Math.abs(ratio - 1);

        if (diferenciaRelativa > 0.2) {
            return res.status(400).json({ error: "La relación de aspecto de la imagen debe ser cercana a 1:1 para evitar distorsiones" });
        }

        // Redimensionar imagen
        const imagenRedimensionada = await sharp(req.file.buffer)
            .resize(310, 300)
            .jpeg({ quality: 100 })
            .toBuffer();

        // Subir imagen a Cloudinary
        try {
            const imagenBase64 = `data:image/jpeg;base64,${imagenRedimensionada.toString('base64')}`;

            const result = await cloudinary.uploader.upload(imagenBase64, {
                resource_type: "image"
            });

            imagen = result.secure_url;

        } catch (err) {
            return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${err.message}` });
        }
    }

    // Chequear número del modelo
    const banda = req.body.banda || productoAActualizar.banda
    const tipo = req.body.tipo || productoAActualizar.tipo
    const modeloActual = productoAActualizar.modelo;

    let modelo

    try {
        const productos = await Producto.find({ tipo: tipo, banda: banda });
        
        const existeModelo = productos.some(
            (p) => p.modelo === modeloActual && p.uuid !== productoAActualizar.uuid
        );

        if (existeModelo) {
            const modelos = productos.map((p) => p.modelo);
            const modeloNuevo = Math.max(...modelos) + 1;

            modelo = modeloNuevo;
        } else modelo = modeloActual;

    } catch (err) {
        return res.status(500).json({ error: `Error al recuperar productos de la base de datos: ${err.message}` });
    }

    // Parsear valores recibidos como string
    let stockNumerico = {};
    if (req.body.stock) {
        const stock = typeof req.body.stock === 'string' ? JSON.parse(req.body.stock) : req.body.stock;
        for (const [talle, cantidad] of Object.entries(stock)) {
            stockNumerico[talle] = Number(cantidad);
        };
    } else stockNumerico = productoAActualizar.stock;
    
    const precio = req.body.precio ? Number(req.body.precio) : productoAActualizar.precio;
    const descuento = req.body.descuento ? Number(req.body.descuento) : productoAActualizar.descuento;

    // Actualizar la base de datos
    const dataActualizada = {
        tipo: tipo,
        banda: banda,
        modelo: modelo,
        stock: stockNumerico,
        precio: precio,
        descuento: descuento,
        fechaYHoraModificacion: new Date(),
        ...(imagen ? { imagen: imagen } : {})
    };

    try {
        productoAActualizar.set(dataActualizada);

        const productoActualizado = await productoAActualizar.save();
        return res.status(200).send(productoActualizado);
    } catch (err) {
        return res.status(500).json({ error: `El producto no pudo actualizarse: ${err.message}` });
    }
};

const eliminacionProducto = async (req, res) => {
    
    try {
        const eliminado = await Producto.findOneAndDelete({ uuid: req.params.id });

        if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });

        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({ error: `Error al eliminar el producto: ${err.message}` });
    };
}

export {
    altaProducto,
    obtenerProductos,
    actualizacionProducto,
    eliminacionProducto
};