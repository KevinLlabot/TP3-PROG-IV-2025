import express from 'express';
import { db } from './db.js';
import { validationResult , param , body } from 'express-validator';

const router = express.Router();

// Validación de ID
const validarUsuarioID = param('usuarioId').isInt({min: 1}).withMessage("El ID DE USUARIO ebe ser un numero entero");
const validarRolID = param('rolId').isInt({min: 1}).withMessage("El ID DE ROL debe ser un numero entero");

// Middleware para verificar validaciones
const verificarValidaciones = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({success: false , errors: errores.array()});
  }
  next();
};

// Validación de usuarios
const validarRoles = [
    body('nombre').isString().withMessage("El nombre del rol es obligatorio"),
    verificarValidaciones
];

// FUNCION GET

async function getUsuarioRoles (req, res){
    const usuarioId = Number(req.params.usuarioId);
    const rolId = Number(req.params.rolId);

    let sql = "SELECT ur.usuario_id, ur.rol_id, u.username, r.nombre AS Rol, ur.descripcion, ur.nivel \
    FROM usuario_roles ur \
    JOIN  usuario u ON ur.usuario_id = u.id\
    JOIN  roles r ON ur.rol_id = r.id\
    WHERE ur.usuario_id = ? AND ur.rol_id = ? ";

    const [rows] = await db.execute(sql , [usuarioId , rolId])

    if (rows.length === 0) {
        return res.status(404).json({success: false , message: "No se encontró la relación entre el usuario y el rol"});
    }
    res.json({success: true , data: rows[0]})
}



// ejemplos mas simples

router.get('/usuario/:usuarioId', async (req , res) => {})
router.get('/roles/:rolId', async (req , res) => {})

// EJEMPLOS DE UNA SOLA FILA

// GET "/usuario_roles/usuario/1/roles/2"
router.get("/usuario/:usuarioId/roles/:rolId", 
    validarRolID, 
    validarUsuarioID,
    verificarValidaciones, 
    getUsuarioRoles)

// GET "/usuario_roles/roles/2/usuario/1"
router.get("/roles/:rolId/usuario/:usuarioId",
    validarRolID, 
    validarUsuarioID, 
    verificarValidaciones, 
    getUsuarioRoles)

router.get("/:id" , async (req, res) => {})

router.post("/usuario/:usuarioId/roles/:rolId" , validarRoles, async (req , res) => {
    const {usuarioId} = req.param.usuarioId
    
})
router.post("/roles/:rolId/usuario/:usuarioId" , validarRoles, async (req, res) => {})

router.put("/usuario/:usuarioId/roles/:rolId"  , validarRoles, async (req , res) => {})
router.put("/roles/:rolId/usuario/:usuarioId"  , validarRoles, async (req, res) => {})

router.delete("/usuario/:usuarioId/roles/:rolId" , async (req, res) =>{})
router.delete("/roles/:rolId/usuario/:usuarioId" , async (req, res) =>{})




//consultar usurario por rol


// asignar usuario a un rol


// eliminar usuario de un rol

export default router;