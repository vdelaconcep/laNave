import express from 'express';
import {
    registrarUsuario,
    iniciarSesion
} from '../controller/usuariosController.js';

import { reglasValidacionRegistro } from '../helpers/registroValidatorHelper.js';
import { reglasValidacionLogin } from '../helpers/loginValidatorHelper.js';

import { validar } from '../middlewares/validator.js'


const router = express.Router();

// Iniciar sesión
router.post('/login', reglasValidacionLogin, validar, iniciarSesion);

// Registrar nuevo usuario
router.post('/registro', reglasValidacionRegistro, validar, registrarUsuario);

export default router;