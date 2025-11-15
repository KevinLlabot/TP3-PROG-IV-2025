import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validators.js';
import { authRequired } from '../middlewares/authRequired.js';
import { listAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno }
from '../controllers/alumnos.controller.js';

//router para las rutas de gestión de alumnos
const router = Router();

// rutas para la gestión de alumnos
router.get('/', authRequired, listAlumnos);

// Obtener un alumno por ID
router.get('/:id', authRequired, param('id').isInt(), validate, getAlumno);

// Crear un nuevo alumno
router.post('/',
authRequired,
body('nombre').trim().notEmpty(),
body('apellido').trim().notEmpty(),
body('dni').isInt().isLength({ min: 7, max: 9 }),
validate,
createAlumno
);

// Editar un alumno existente
router.put('/:id',
authRequired,
param('id').isInt(),
body('nombre').trim().notEmpty(),
body('apellido').trim().notEmpty(),
body('dni').isInt().isLength({ min: 7, max: 9 }),
validate, updateAlumno
);

// Eliminar un alumno
router.delete('/:id', authRequired, param('id').isInt(), validate,
deleteAlumno);


export default router;
