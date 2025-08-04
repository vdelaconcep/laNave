import express from 'express';
import {
    registrarUsuario,
    iniciarSesion,
    obtenerUsuarios,
    cambiarRol,
    obtenerUsuarioPorID,
    eliminarRegistro
} from '../controller/usuariosController.js';

import { reglasValidacionRegistro } from '../helpers/registroValidatorHelper.js';
import { reglasValidacionLogin } from '../helpers/loginValidatorHelper.js';

import { validar } from '../middlewares/validator.js';

// Middleware para acceso de administrador
import { rutaAdmin } from '../middlewares/rutaAdmin.js';

const router = express.Router();

// Iniciar sesión
router.post('/login', reglasValidacionLogin, validar, iniciarSesion);

// Registrar nuevo usuario
router.post('/registro', reglasValidacionRegistro, validar, registrarUsuario);

// Obtener todos los usuarios
router.get('/', rutaAdmin, obtenerUsuarios);

// Obtener usuario por uuid
router.get('/:id', rutaAdmin, obtenerUsuarioPorID);

// Cambiar rol de usuario
router.put('/cambiarRol/:id', rutaAdmin, cambiarRol);

// Eliminar registro de usuario
router.delete('/eliminar/:id', rutaAdmin, eliminarRegistro);

export default router;