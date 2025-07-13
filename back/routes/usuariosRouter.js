import express from 'express';
import {
    registrarUsuario,
    iniciarSesion
} from '../controller/usuariosController.js';

import { reglasValidacionRegistro } from '../helpers/registroValidatorHelper.js';

import { validar } from '../middlewares/validator.js'


const router = express.Router();

// Iniciar sesión
router.post('/login', iniciarSesion);

// Registrar nuevo usuario
router.post('/registro', reglasValidacionRegistro, validar, registrarUsuario);

export default router;