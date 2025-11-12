import { db } from "../db.js";

export const listMaterias = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM materia ORDER BY id DESC");
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
};

export const getMateria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM materia WHERE id = ?", [id]);

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, error: "Materia no encontrada" });

    res.json({ success: true, data: rows[0] });
  } catch (e) {
    next(e);
  }
};

export const createMateria = async (req, res, next) => {
  try {
    const { nombre, codigo, año } = req.body;

    // Verificar si el código de la materia ya existe
    const [dup] = await db.query("SELECT id FROM materia WHERE codigo = ?", [
      codigo,
    ]);

    if (dup.length)
      return res
        .status(409)
        .json({ success: false, error: "Código duplicado" });

    // Agrega nueva materia
    const [result] = await db.query(
      "INSERT INTO materia (nombre, codigo, año) VALUES (?, ?, ?)",
      [nombre, codigo, año]
    );

    res
      .status(201)
      .json({ success: true, data: { id: result.insertId, nombre, codigo, año } });
  } catch (e) {
    next(e);
  }
};

export const updateMateria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, año } = req.body;

    // Verificar si el código ya está en uso por otra materia
    const [dup] = await db.query(
      "SELECT id FROM materia WHERE codigo = ? AND id <> ?",
      [codigo, id]
    );

    if (dup.length)
      return res
        .status(409)
        .json({ success: false, error: "Código ya usado por otra materia" });

    // Editar materia
    const [result] = await db.query(
      "UPDATE materia SET nombre=?, codigo=?, año=? WHERE id=?",
      [nombre, codigo, año, id]
    );

    if (!result.affectedRows)
      return res
        .status(404)
        .json({ success: false, error: "Materia no encontrada" });

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteMateria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM materia WHERE id = ?", [id]);

    if (!result.affectedRows)
      return res
        .status(404)
        .json({ success: false, error: "Materia no encontrada" });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
