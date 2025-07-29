import express from 'express';
import {
    altaProducto,
    obtenerProductos,
    actualizacionProducto,
    eliminacionProducto
} from '../controller/productosController.js';

import { reglasValidacionAlta } from '../helpers/altaValidatorHelper.js';

import { validar } from '../middlewares/validator.js'

// Middleware para acceso de administrador
import { rutaAdmin } from '../middlewares/rutaAdmin.js';

// Configuración del enrutador
const router = express.Router();

// Para subir imagen
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() });

// Registrar nuevo producto (alta)
router.post('/alta', upload.single('image'), reglasValidacionAlta, validar, rutaAdmin, altaProducto);

// Obtener productos
router.get('/', obtenerProductos);

// Modificar producto
router.put('/actualizar/:id', upload.single('image'), rutaAdmin, actualizacionProducto);

// Eliminar Producto
router.delete('/eliminar/:id', rutaAdmin, eliminacionProducto);

export default router;