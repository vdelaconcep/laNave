import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import usuariosRouter from './routes/usuariosRouter.js';
import productosRouter from './routes/productosRouter.js';

// Servidor
const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);

export default app;