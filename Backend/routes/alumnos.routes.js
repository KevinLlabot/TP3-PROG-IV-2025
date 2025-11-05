import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validators.js';
import { authRequired } from '../middlewares/authRequired.js';
import { listAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno }
from '../controllers/alumnos.controller.js';


const router = Router();

router.get('/', authRequired, listAlumnos);

router.get('/:id', authRequired, param('id').isInt(), validate, getAlumno);

router.post('/',
authRequired,
body('nombre').trim().notEmpty(),
body('apellido').trim().notEmpty(),
body('dni').isInt().isLength({ min: 7, max: 9 }),
validate,
createAlumno
);

router.put('/:id',
authRequired,
param('id').isInt(),
body('nombre').trim().notEmpty(),
body('apellido').trim().notEmpty(),
body('dni').isInt().isLength({ min: 7, max: 9 }),
validate, updateAlumno
);

router.delete('/:id', authRequired, param('id').isInt(), validate,
deleteAlumno);


export default router;
