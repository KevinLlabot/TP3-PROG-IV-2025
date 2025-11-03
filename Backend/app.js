import express, { Router } from 'express';
import { db } from './db.js';
import { validationResult , param , body } from 'express-validator';
import bcrypt from 'bcrypt';
import passport from 'passport';


const router = express.Router();

// Validación de ID
const validarID = param('id').isInt({min: 1}).withMessage("El ID debe ser un numero entero");

// Middleware para verificar validaciones
const verificarValidaciones = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({success: false , errors: errores.array()});
  }
  next();
};

// Validación de usuarios
const validarUsuario = [
 
  body('username').isString().withMessage("El username es obligatorio"),
  body("nombre").isString().withMessage("El nombre es obligatorio"),
  body("apellido").isString().withMessage("El apellido es obligatorio"),
  body("password_hash").isLength({min: 6}).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("activo").isBoolean().withMessage("El campo activo debe ser completado"),
  verificarValidaciones
];

// === LOGIN ===

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query('SELECT * FROM prog_iv.usuario WHERE username = ?', [username]);
  if (rows.length === 0) {
    return res.status(400).json({ success: false, error: 'Usuario no encontrado' });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
  }

  // Si usás JWT:
  const jwt = await import('jsonwebtoken');
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ success: true, token });
});


// Obtener todos los usuarios --------------------------------------------------------------------
router.get(
  '/', 
  passport.authenticate("jwt" , {session: false}),
  async (req, res) => {
  
    const [rows] = await db.execute("SELECT * FROM prog_iv.usuario");
    //recordar quitar la contraseña en la respuesta de la API
    res.json({success: true, usuarios: rows.map((u) => ({...u, password_hash: undefined }))
  
  });

  
});

// Obtener usuario por ID --------------------------------------------------------------------
router.get('/:id', 

  passport.authenticate("jwt" , {session: false}),
  validarID,
  verificarValidaciones, 
  
  async (req, res) => {

    const { id } = Number(req.params.id);
    const [rows] = await db.execute('SELECT id, username, nombre, apellido, activo FROM prog_iv.usuario WHERE id=?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({success: false, message: 'Usuario no encontrado'});
    }
    res.json({success: true, data: rows[0]});
  
    res.status(500).json({success: false, message: 'Error del servidor'});
  
});

// Crear usuario con contraseña HASHEADA --------------------------------------------------------------------

router.post('/', 

passport.authenticate("jwt" , {session: false}),
body('username').isAlphanumeric().isLength({min:3 , max: 30}) ,
body('nombre').isString().isLength({min:1 , max: 50}) ,
body('apellido').isString().isLength({min:1 , max: 50}) ,
body('password').isStrongPassword({
  minLength:8 , // Longitud mínima de 8 caracteres
  minLowercase: 1, // Al menos una letra minúscula
  minUppercase: 1, // Al menos una letra mayúscula
  minNumbers:1 , // Al menos un número
  minSymbols:0}) // Al menos un símbolo
, verificarValidaciones, async (req, res) => {
 const {username , nombre , apellido , password , activo} = req.body;

 // crear el hash de la contraseña
 const hashedPassword = await bcrypt.hash(password , 12); // 12 es el costo de hash

  const [result] = await db.execute(
    'INSERT INTO prog_iv.usuario (username, nombre, apellido, password_hash, activo) VALUES (?, ?, ?, ?, ?)',
    [username, nombre, apellido, hashedPassword, activo]
  );
  res.status(201).json({success: true, data: {id: result.insertId, username, nombre, apellido, activo}});
});

// Actualizar usuario --------------------------------------------------------------------

router.put('/:id',   
  
  passport.authenticate("jwt" , {session: false}),
  validarID, 
  validarUsuario, 
  verificarValidaciones,

  async (req, res) => {

    const { id } = req.params;
    const { username, nombre, apellido, password_hash, activo } = req.body;
    const [result] = await db.query(
      'UPDATE prog_iv.usuario SET username = ?, nombre = ?, apellido = ?, password_hash = ?, activo = ? WHERE id = ?',
      [username, nombre, apellido, password_hash, activo, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({success: false, message: 'Usuario no encontrado'});
    }
    res.json({success: true, message: 'Usuario actualizado'});
});

// Eliminar usuario --------------------------------------------------------------------

router.delete('/:id', 
  
  passport.authenticate("jwt" , {session: false}),
    validarID, 
    verificarValidaciones,
    
    async (req, res) => {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM prog_iv.usuario WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({success: false, message: 'Usuario no encontrado'});
    }
    res.json({success: true, message: 'Usuario eliminado'});
  
});

// Constultar por roles de usuario

router.get("/:id/roles" , 

  passport.authenticate("jwt" , {session: false}),
  validarID , 
  verificarValidaciones,  
  
async (req, res) => {
  const {id} = req.params
  let sql = "SELECT r.id , r.nombre" + " FROM roles r " + " JOIN prog_iv.usuario_roles ur ON r.id = ur.rol_id " + 
           " WHERE ur.usuario_id = ? " + " ORDER BY r.nombre "
 const [rows] = await db.execute(sql , [id]);
 res.json({success: true, data: rows})
})

// Asignar un rol a un usuario

router.post('/:id/roles' , 
  
  passport.authenticate("jwt" , {session: false}),
  validarID , 
  body("idRol").isInt({min: 1}), verificarValidaciones, async (req , res) => {
  
  const {id} = req.params
  const idRol = req.body.idRol

  let sql = "INSERT INTO prog_iv.usuario_roles (usuario_id , rol_id) VALUES (?,?)";

  await db.execute(sql , [id, idRol])
  
  res.json({success: true})
})

//Eliminar un rol a un usuario 

router.delete('/:id/roles/:idRol' , 
  
  passport.authenticate("jwt" , {session: false}),
  validarID , 
  param("idRol").isInt({min: 1}) , 
  verificarValidaciones , 
  
  async (req , res) => {
  const {id} = req.params
  const idRol = req.params.idRol
  
  let sql = "DELETE FROM usuario_roles WHERE usuario_id = ? AND rol_id = ?"

  await db.execute(sql, [id , idRol])

  res.json({success: true})
})


export default router;
