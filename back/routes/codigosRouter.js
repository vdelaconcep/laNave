import express from 'express';
import {
    crearCodigo,
    obtenerCodigos,
    buscarCodigo,
    eliminarCodigo,
    buscarCodigoPorID
} from '../controller/codigosController.js';

import { reglasValidacionCodigo } from '../helpers/codigoValidatorHelper.js';

import { validar } from '../middlewares/validator.js'

// Middleware para acceso de administrador
import { rutaAdmin } from '../middlewares/rutaAdmin.js';

// Configuración del enrutador
const router = express.Router();

// Crear código
router.post('/crear', reglasValidacionCodigo, validar, crearCodigo);

// Obtener todos los códigos
router.get('/', rutaAdmin, obtenerCodigos);

// Buscar código
router.get('/buscar/:codigo', buscarCodigo);

// Buscar código por ID
router.get('/buscarid/:id', buscarCodigoPorID)

// Eliminar código por id
router.delete('/eliminar/:id', rutaAdmin, eliminarCodigo)

export default router;