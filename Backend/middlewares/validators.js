import { validationResult } from 'express-validator';

//middleware que valida los resultados de las validaciones definidas en las rutas
export const validate = (req, res, next) => {

const errors = validationResult(req);

if (!errors.isEmpty()) {
return res.status(400).json({ success: false, errors: errors.array() });
}

next();

};
