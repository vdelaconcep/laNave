import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import usuariosRouter from './routes/usuariosRouter.js';
import productosRouter from './routes/productosRouter.js';
import mensajesRouter from './routes/mensajesRouter.js';
import codigosRouter from './routes/codigosRouter.js';
import compraRouter from './routes/compraRouter.js';
import ventasRouter from './routes/ventasRouter.js';

// Servidor
const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));

// Rutas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/mensajes', mensajesRouter);
app.use('/api/codigos', codigosRouter);
app.use('/api/comprar', compraRouter);
app.use('/api/ventas', ventasRouter);

export default app;