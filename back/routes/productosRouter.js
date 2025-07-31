import express from 'express';
import {
    altaProducto,
    obtenerProductos,
    actualizacionProducto,
    eliminacionProducto
} from '../controller/productosController.js';

import { reglasValidacionAlta } from '../helpers/altaValidatorHelper.js';
import { reglasValidacionActualizacion } from '../helpers/actualizacionValidatorHelper.js';

import { validar } from '../middlewares/validator.js'

// Middleware para acceso de administrador
import { rutaAdmin } from '../middlewares/rutaAdmin.js';

// Configuración del enrutador
const router = express.Router();

// Para subir imagen
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() });

// Registrar nuevo producto (alta)
router.post('/alta', rutaAdmin, upload.single('imagen'), reglasValidacionAlta, validar, altaProducto);

// Obtener productos
router.get('/', obtenerProductos);

// Modificar producto
router.put('/actualizar/:id', rutaAdmin, upload.single('imagen'), reglasValidacionActualizacion, validar, actualizacionProducto);

// Eliminar Producto
router.delete('/eliminar/:id', rutaAdmin, eliminacionProducto);

export default router;