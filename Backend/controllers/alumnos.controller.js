import { db } from "../db.js";  

//Listar todos los alumnos
export const listAlumnos = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM alumno ORDER BY id DESC");
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
};

//Obtener un alumno por ID
export const getAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM alumno WHERE id = ?", [id]);

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, error: "Alumno no encontrado" });

    res.json({ success: true, data: rows[0] });
  } catch (e) {
    next(e);
  }
};

//Crear un nuevo alumno
export const createAlumno = async (req, res, next) => {
  try {
    const { nombre, apellido, dni } = req.body;

    // Verificar si ya existe el DNI
    const [existing] = await db.query("SELECT id FROM alumno WHERE dni = ?", [
      dni,
    ]);

    if (existing.length)
      return res
        .status(409)
        .json({ success: false, error: "DNI duplicado" });

    //Insertar nuevo alumno
    const [result] = await db.query(
      "INSERT INTO alumno (nombre, apellido, dni) VALUES (?, ?, ?)",
      [nombre, apellido, dni]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, apellido, dni },
    });
  } catch (e) {
    next(e);
  }
};

//Actualizar datos de un alumno
export const updateAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni } = req.body;

    // Evitar duplicado de DNI en otros alumnos
    const [dup] = await db.query(
      "SELECT id FROM alumno WHERE dni = ? AND id <> ?",
      [dni, id]
    );

    if (dup.length)
      return res
        .status(409)
        .json({ success: false, error: "DNI ya usado por otro alumno" });

    const [result] = await db.query(
      "UPDATE alumno SET nombre=?, apellido=?, dni=? WHERE id=?",
      [nombre, apellido, dni, id]
    );

    if (!result.affectedRows)
      return res
        .status(404)
        .json({ success: false, error: "Alumno no encontrado" });

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

//Eliminar un alumno
export const deleteAlumno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM alumno WHERE id = ?", [id]);

    if (!result.affectedRows)
      return res
        .status(404)
        .json({ success: false, error: "Alumno no encontrado" });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
};



