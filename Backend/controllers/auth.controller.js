import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";  // 

//Registro de usuario
export const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    //Verificar si el email ya existe
    const [exist] = await db.query("SELECT id FROM usuario WHERE email = ?", [email]);
    if (exist.length)
      return res
        .status(409)
        .json({ success: false, error: "Email ya registrado" });

    //Encriptar contraseña
    const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    const hash = await bcrypt.hash(password, rounds);

    //Insertar nuevo usuario
    const [result] = await db.query(
      "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );

    return res
      .status(201)
      .json({
        success: true,
        data: { id: result.insertId, nombre, email },
      });
  } catch (e) {
    next(e);
  }
};

//Login de usuario
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Buscar usuario por email
    const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [
      email,
    ]);

    if (!rows.length)
      return res
        .status(401)
        .json({ success: false, error: "Usuario o contraseña incorrectos" });

    const user = rows[0];

    // Comparar contraseña
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, error: "Usuario o contraseña incorrectos" });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "4h",
      }
    );

    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (e) {
    next(e);
  }
};



