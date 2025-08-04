import Usuario from '../models/usuarioMongo.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Iniciar sesión (usuarios registrados)
const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Identificar usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ error: 'E-mail o contraseña incorrectos' });

        // Chequear contraseña
        const passwordOk = await bcrypt.compare(password, usuario.passwordHash);
        if (!passwordOk) return res.status(400).json({ error: 'E-mail o contraseña incorrectos' });

        // Guardar último inicio de sesión
        usuario.ultimaSesion = new Date().toISOString();
        await usuario.save();

        // Crear webtoken
        const token = jwt.sign(
            { id: usuario.uuid, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Responder con datos del usuario
        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                nombreYApellido: usuario.nombreYApellido,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (err) {
        return res.status(500).json({ error: `Error al iniciar sesión: ${err.message}` });
    };
};

const registrarUsuario = async (req, res) => {
    try {
        // Encriptar contraseña
        const hash = bcrypt.hashSync(req.body.password, 10);

        // Generar ID propio
        const id = uuidv4();

        // Guardar datos en BD
        const usuarioNuevo = {
            uuid: id,
            nombreYApellido: req.body.nombreYApellido,
            nacimiento: req.body.nacimiento,
            email: req.body.email,
            telefono: req.body.telefono,
            passwordHash: hash
        };

        const usuarioAGuardar = new Usuario(usuarioNuevo);
        const usuarioGuardado = await usuarioAGuardar.save();
        return res.status(200).send(usuarioGuardado);
    } catch (err) {
        return res.status(500).json({ error: `Error al registrar el usuario: ${err.message}` });
    };
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        if (!usuarios) return res.status(404).json({ error: 'No se encontraron usuarios' });
        return res.status(200).json(usuarios);
    } catch (err) {
        return res.status(500).json({ error: `Error al obtener usuarios: ${err.message}` })
    }
}

export {
    registrarUsuario,
    iniciarSesion,
    obtenerUsuarios
};