import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import usuariosRouter from './routes/usuariosRouter.js';

// Servidor
const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', usuariosRouter);

export default app;