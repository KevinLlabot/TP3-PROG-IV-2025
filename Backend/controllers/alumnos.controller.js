import { pool } from '../db.js';

export const listAlumnos = async (req, res, next) => {

try {

const [rows] = await pool.query('SELECT * FROM alumno ORDER BY id DESC');

res.json({ success: true, data: rows });

} catch (e) { next(e); }
};

export const getAlumno = async (req, res, next) => {

try {

const { id } = req.params;
const [rows] = await pool.query('SELECT * FROM alumno WHERE id = ?',
[id]);

if (!rows.length) return res.status(404).json({ success: false, error:
'Alumno no encontrado' });

res.json({ success: true, data: rows[0] });

} catch (e) { next(e); }
};

export const createAlumno = async (req, res, next) => {

try {

const { nombre, apellido, dni } = req.body;
const [existing] = await pool.query('SELECT id FROM alumno WHERE dni=?', [dni]);

if (existing.length) return res.status(409).json({ success: false,
error: 'DNI duplicado' });

const [result] = await pool.query(
'INSERT INTO alumno (nombre, apellido, dni) VALUES (?, ?, ?)',
[nombre, apellido, dni]
);

res.status(201).json({ success: true, data: { id: result.insertId,
nombre, apellido, dni } });

} catch (e) { next(e); }
};

export const updateAlumno = async (req, res, next) => {

try {

const { id } = req.params;
const { nombre, apellido, dni } = req.body;

// evitar colisión de DNI con otros
const [dup] = await pool.query('SELECT id FROM alumno WHERE dni = ? AND id <> ?', [dni, id]);

if (dup.length) return res.status(409).json({ success: false, error:
'DNI ya usado por otro alumno' });

const [result] = await pool.query(
'UPDATE alumno SET nombre=?, apellido=?, dni=? WHERE id=?',
[nombre, apellido, dni, id]
);

if (!result.affectedRows) return res.status(404).json({ success: false,
error: 'Alumno no encontrado' });

res.json({ success: true });

} catch (e) { next(e); }
};

export const deleteAlumno = async (req, res, next) => {

try {

const { id } = req.params;
const [result] = await pool.query('DELETE FROM alumno WHERE id=?', [id]);

if (!result.affectedRows) return res.status(404).json({ success: false,
error: 'Alumno no encontrado' });
res.status(204).send();

} catch (e) { next(e); }
};


