import express from 'express';
import registrarUsuario from '../controller/usuariosController.js';

const router = express.Router();

// Registrar nuevo usuario
router.post('/registro', registrarUsuario);

export default router;