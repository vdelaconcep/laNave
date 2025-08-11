import express from 'express';
import {
    obtenerVentas
} from '../controller/ventasController.js';

// Middleware para acceso de administrador
import { rutaAdmin } from '../middlewares/rutaAdmin.js';

const router = express.Router();

router.get('/', rutaAdmin, obtenerVentas);

export default router;