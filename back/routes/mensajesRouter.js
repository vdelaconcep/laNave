import express from 'express';
import {
    enviarMensaje
} from '../controller/mensajesController.js';

import { reglasValidacionMensaje } from '../helpers/mensajeValidatorHelper.js';

import { validar } from '../middlewares/validator.js'

// Configuración del enrutador
const router = express.Router();

// Enviar mensaje
router.post('/mensajeNuevo', reglasValidacionMensaje, validar, enviarMensaje);

export default router;