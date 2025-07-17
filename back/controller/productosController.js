import Producto from '../models/productoMongo.js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Importar configuración de dotenv
import dotenv from 'dotenv';
dotenv.config();

// Importar la configuración de Cloudinary
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ingresar nuevo producto en la base de datos
const altaProducto = async (req, res) => {
    console.log(req.body);

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
        const productos = await Producto.find();
        let resultado = productos.filter(elemento => {
            const buscaPorBanda = elemento.banda.trim().toLowerCase();
            const buscaPorTipo = elemento.tipo.trim().toLowerCase();
            return buscaPorBanda.includes(banda.trim().toLowerCase()) &&
                buscaPorTipo.includes(tipo.trim().toLowerCase());
        });
        modelo = resultado.length + 1;
    } catch (err) {
        return res.status(500).json({ error: `Error al recuperar productos de la base de datos: ${err.message}` });
    }

    // Generar uuid
    const uuid = uuidv4();

    // Parsear valores recibidos como string
    let destacado;
    if (typeof req.body.destacado === 'string') {
        req.body.destacado === 'true' ? destacado = true : destacado = false
    } else destacado = req.body.destacado

    const stock = typeof req.body.stock === 'string' ? JSON.parse(req.body.stock) : req.body.stock;
    const stockNumerico = {};
    for (const [talle, cantidad] of Object.entries(stock)) {
        stockNumerico[talle] = Number(cantidad);
    };

    const precio = Number(req.body.precio);
    const descuento = Number(req.body.descuento);

    // Guardar en la base de datos (nueva entrada)
    const productoNuevo = {
        uuid: uuid,
        tipo: tipo,
        banda: banda,
        modelo: modelo,
        stock: stockNumerico,
        precio: precio,
        imagen: imagen,
        descuento: descuento,
        destacado: destacado
    };

    try {
        const producto = new Producto(productoNuevo);
        const productoGuardado = await producto.save();
        res.status(200).send(productoGuardado);
    } catch (err) {
        res.status(500).json({ error: `El producto no pudo ingresarse en la base de datos: ${err.message}` });
    }
};

// Obtener productos de la base de datos
const obtenerProductos = async (req, res) => {

    let productos;
    try {
        if (req.query.destacados) productos = await Producto.find({ destacado: true });

        if (req.query.tipo) {
            if (req.query.tipo === 'todos') {
                productos = await Producto.find();
            } else {
                const indumentaria = ['remeras', 'buzos', 'mochilas'];
                const filtro = indumentaria.includes(req.query.tipo) ? `${req.query.tipo.slice(0, -1)}` : req.query.tipo;
                productos = await Producto.find({ tipo: filtro });
            }
        };

        if (productos) {
            return res.status(200).json(productos);
        } else return res.status(404).json({error: 'Productos no encontrados'})
    } catch (err) {
        res.status(500).json({ error: `Error al obtener productos de la base de datos: ${err.message}` });
    };
};

export {
    altaProducto,
    obtenerProductos
};