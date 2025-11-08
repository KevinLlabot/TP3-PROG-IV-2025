import { db } from "../db.js";  

//Inserta o actualiza las notas según si ya existen o no
export async function upsertNotas(req, res) {
  try {
    const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

    if (!alumno_id || !materia_id) {
      return res.status(400).json({
        success: false,
        error: "Faltan datos obligatorios (alumno_id o materia_id)",
      });
    }

    // Limpia valores vacíos (para que se guarden como NULL)
    const clean = (v) => (v === "" ? null : v);

    await db.query(
      `INSERT INTO nota (alumno_id, materia_id, nota1, nota2, nota3)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         nota1 = VALUES(nota1),
         nota2 = VALUES(nota2),
         nota3 = VALUES(nota3)`,
      [alumno_id, materia_id, clean(nota1), clean(nota2), clean(nota3)]
    );

    res.json({
      success: true,
      message: "Notas guardadas o actualizadas correctamente",
    });
  } catch (err) {
    console.error("Error en upsertNotas:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Error interno del servidor",
    });
  }
}

// Obtiene las notas de un alumno y materia
export const getNotasByAlumnoMateria = async (req, res, next) => {
  try {
    const { alumno_id, materia_id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM nota WHERE alumno_id=? AND materia_id=?",
      [alumno_id, materia_id]
    );

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, error: "Sin notas para ese alumno/materia" });

    res.json({ success: true, data: rows[0] });
  } catch (e) {
    console.error("Error en getNotasByAlumnoMateria:", e);
    next(e);
  }
};

// Calcula los promedios generales
export const getPromedios = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        n.alumno_id,
        a.nombre AS alumno_nombre,
        a.apellido AS alumno_apellido,
        n.materia_id,
        m.nombre AS materia_nombre,
        ROUND(
          (COALESCE(n.nota1,0) + COALESCE(n.nota2,0) + COALESCE(n.nota3,0)) /
          NULLIF(
            ((n.nota1 IS NOT NULL) + (n.nota2 IS NOT NULL) + (n.nota3 IS NOT NULL)),
          0),
        2) AS promedio
      FROM nota n
      JOIN alumno a ON a.id = n.alumno_id
      JOIN materia m ON m.id = n.materia_id
    `);

    res.json({ success: true, data: rows });
  } catch (e) {
    console.error("Error en getPromedios:", e);
    next(e);
  }
};
