import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validators.js';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

//ruta para el registro de usuarios nuevos
router.post('/registro',
body('nombre').trim().isLength({ min: 2 }).withMessage('Nombre requerido'),
body('email').isEmail().withMessage('Email inválido'),
body('password').isLength({ min: 8 }).withMessage('Min 8 caracteres'),
validate,
register
);

//ruta para el login de usuarios
router.post('/login',
body('email').isEmail(),
body('password').notEmpty(),
validate,
login
);


export default router;
