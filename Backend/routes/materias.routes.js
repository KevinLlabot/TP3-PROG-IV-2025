import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validators.js';
import { authRequired } from '../middlewares/authRequired.js';
import { listMaterias, getMateria, createMateria, updateMateria,
deleteMateria } from '../controllers/materias.controller.js';

const router = Router();

// Rutas para gestionar materias
router.get('/', authRequired, listMaterias);

// Obtener una materia por ID
router.get('/:id', authRequired, param('id').isInt(), validate, getMateria);

// Crear una nueva materia
router.post('/',
authRequired,
body('nombre').trim().notEmpty(),
body('codigo').trim().isAlphanumeric().isLength({ min: 2, max: 10 }),
body('año').isInt({ min: 1, max: 6 }),
validate,
createMateria
);

// Editar una materia existente
router.put('/:id',
authRequired,
param('id').isInt(),
body('nombre').trim().notEmpty(),
body('codigo').trim().isAlphanumeric().isLength({ min: 2, max: 10 }),
body('año').isInt({ min: 1, max: 6 }),
validate,
updateMateria
);

// Eliminar una materia
router.delete('/:id', authRequired, param('id').isInt(), validate,
deleteMateria);



export default router;