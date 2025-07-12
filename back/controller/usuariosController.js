import Usuario from '../models/usuarioMongo.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Registrar usuario
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
        res.status(500).json({ error: `Error al registrar el usuario: ${err.message}` });
        console.log(err);
        return;
    };
};

export default registrarUsuario;