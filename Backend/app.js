import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import passport from 'passport';
import { configurePassport } from './passport.js';
import authRoutes from './routes/auth.routes.js';
import alumnosRoutes from './routes/alumnos.routes.js';
import materiasRoutes from './routes/materias.routes.js';
import notasRoutes from './routes/notas.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Inicializar la aplicación Express
const app = express();

// Cargar variables de entorno
dotenv.config();

// Middleware
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Configurar Passport.js
configurePassport();

// Inicializar Passport.js
app.use(passport.initialize());

// Rutas
app.get('/', (req,res)=> res.json({ ok: true, service: 'API TP3 Alumnos' }));
app.use('/api/auth', authRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/notas', notasRoutes);
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`-----> Base de datos conectada en puerto: ${PORT} <------`));



