import express from 'express';
import {
    altaProducto
} from '../controller/productosController.js';

/* import { reglasValidacionAlta } from '../helpers/productoValidatorHelper.js';

import { validar } from '../middlewares/validator.js' */

// Configuración del enrutador
const router = express.Router();

// Para subir imagen
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() });

// Registrar nuevo producto (alta)
router.post('/alta', upload.single('imagen'), /* , reglasValidacionProducto, validar, */ altaProducto);

export default router;