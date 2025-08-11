import express from 'express';
import {
    compraProducto
} from '../controller/compraController.js';

import { reglasValidacionCompra } from '../helpers/compraValidatorHelper.js';

import { validar } from '../middlewares/validator.js'

// Configuración del enrutador
const router = express.Router();

// Realizar compra
router.post('/', reglasValidacionCompra, validar, compraProducto);

export default router;