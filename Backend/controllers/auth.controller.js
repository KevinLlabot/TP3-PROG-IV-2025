import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';


export const register = async (req, res, next) => {
try {

const { nombre, email, password } = req.body;
const [exist] = await pool.query('SELECT id FROM usuario WHERE email=?', [email]);

if (exist.length) return res.status(409).json({ success: false, error: 'Email ya registrado' });

const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
const hash = await bcrypt.hash(password, rounds);

const [result] = await pool.query('INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)',
[nombre, email, hash]
);

return res.status(201).json({ success: true, data: { id:
result.insertId, nombre, email } });

} catch (e) { next(e); }
};

export const login = async (req, res, next) => {

try {

const { email, password } = req.body;
const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?',

[email]);

if (!rows.length) return res.status(401).json({ success: false, error:
'Usuario o contraseña incorrectos' });

const user = rows[0];

const ok = await bcrypt.compare(password, user.password);

if (!ok) return res.status(401).json({ success: false, error:
'Usuario o contraseña incorrectos' });

const token = jwt.sign({ id: user.id, email: user.email },
process.env.JWT_SECRET, {
expiresIn: process.env.JWT_EXPIRES || '4h'
});


res.json({ success: true, token, user: { id: user.id, nombre:
user.nombre, email: user.email } });
} catch (e) { next(e); }
};



