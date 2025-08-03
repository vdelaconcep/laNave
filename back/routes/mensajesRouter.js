import express from 'express';
import {
    enviarMensaje,
    obtenerMensajes,
    obtenerMensajesNuevos,
    eliminarMensaje,
    responderMensaje
} from '../controller/mensajesController.js';

import { reglasValidacionMensaje } from '../helpers/mensajeValidatorHelper.js';

import { validar } from '../middlewares/validator.js'

// Middleware para acceso de administrador
import { rutaAdmin } from '../middlewares/rutaAdmin.js';

// Configuración del enrutador
const router = express.Router();

// Enviar mensaje
router.post('/mensajeNuevo', reglasValidacionMensaje, validar, enviarMensaje);

// Obtener todos los mensajes (y cambiar de "nuevos" a "recibidos")
router.get('/', rutaAdmin, obtenerMensajes);

// Obtener mensajes nuevos (no cambia estado de "nuevos")
router.get('/nuevos', rutaAdmin, obtenerMensajesNuevos);

// Eliminar mensaje por ID
router.delete('/eliminar/:id', rutaAdmin, eliminarMensaje);

// Responder Mensaje
router.post('/responder', rutaAdmin, responderMensaje);



export default router;