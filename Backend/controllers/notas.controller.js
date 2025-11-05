import { pool } from '../db.js';

export const upsertNotas = async (req, res, next) => {

try {

const { alumno_id, materia_id, nota1=null, nota2=null, nota3=null } =
req.body;

const [exist] = await pool.query(
'SELECT id FROM nota WHERE alumno_id=? AND materia_id=?',
[alumno_id, materia_id]
);

if (exist.length) {

const [result] = await pool.query(
'UPDATE nota SET nota1=?, nota2=?, nota3=? WHERE alumno_id=? AND materia_id=?',
[nota1, nota2, nota3, alumno_id, materia_id]
);

return res.json({ success: true, updated: result.affectedRows });
} else {

const [result] = await pool.query(
'INSERT INTO nota (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)' ,
[alumno_id, materia_id, nota1, nota2, nota3]
);

return res.status(201).json({ success: true, id: result.insertId });
}
} catch (e) { next(e); }
};

export const getNotasByAlumnoMateria = async (req, res, next) => {

try {

const { alumno_id, materia_id } = req.params;

const [rows] = await pool.query(
'SELECT * FROM nota WHERE alumno_id=? AND materia_id=?',
[alumno_id, materia_id]
);

if (!rows.length) return res.status(404).json({ success: false, error:
'Sin notas para ese alumno/materia' });

res.json({ success: true, data: rows[0] });

} catch (e) { next(e); }
};

export const getPromedios = async (req, res, next) => {

try {
// promedio simple ignorando nulls
const [rows] = await pool.query(`
 SELECT
 n.alumno_id,
 a.nombre AS alumno_nombre,
 a.apellido AS alumno_apellido,
 n.materia_id,
 m.nombre AS materia_nombre,
 ROUND((COALESCE(n.nota1,0) + COALESCE(n.nota2,0) +
COALESCE(n.nota3,0)) /
 NULLIF( ( (n.nota1 IS NOT NULL) + (n.nota2 IS NOT NULL) +
(n.nota3 IS NOT NULL) ), 0 ), 2) AS promedio
 FROM nota n
 JOIN alumno a ON a.id = n.alumno_id
 JOIN materia m ON m.id = n.materia_id
 `);

res.json({ success: true, data: rows });

} catch (e) { next(e); }
}
