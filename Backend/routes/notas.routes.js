import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validators.js';
import { authRequired } from '../middlewares/authRequired.js';
import { upsertNotas, getNotasByAlumnoMateria, getPromedios } 
from '../controllers/notas.controller.js';

const router = Router();

router.post('/',
authRequired,
body('alumno_id').isInt(),
body('materia_id').isInt(),
body('nota1').optional({ nullable: true }).isFloat({ min: 0, max: 10 }),
body('nota2').optional({ nullable: true }).isFloat({ min: 0, max: 10 }),
body('nota3').optional({ nullable: true }).isFloat({ min: 0, max: 10 }),
validate,
upsertNotas
);

router.get('/promedios', authRequired, getPromedios);

router.get('/:alumno_id/:materia_id',
authRequired,
param('alumno_id').isInt(),
param('materia_id').isInt(),
validate,
getNotasByAlumnoMateria
);


export default router;