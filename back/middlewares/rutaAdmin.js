import jwt from 'jsonwebtoken';


// Middleware para que sólo tenga acceso a la ruta el usuario con rol administrador
const rutaAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token === 'null') return res.status(401).json({ error: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.rol !== 'administrador') return res.status(403).json({ error: 'Se requieren permisos de administrador' })
        
        next();
    } catch (err) {
        return res.status(401).json({error: `Token inválido o expirado (${err.message})`})
    }
};

export { rutaAdmin };