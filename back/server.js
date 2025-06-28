// Configuración del servidor
import app from './app.js';

// Configuración variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// Conexión a la base de datos
import connectDB from './database/conexionMongo.js';

// Puerto
const PORT = process.env.PORT || 3000;

// URI de la base de datos
const MONGO_URI = process.env.MONGO_URI;

// Conectar a la base de datos
connectDB(MONGO_URI);

// Ponemos a escuchar el servidor
app.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
