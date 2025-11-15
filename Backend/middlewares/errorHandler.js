//middleware para manejar errores en las rutas
export function errorHandler(err, req, res, next)  {

console.error('[ERROR]', err);

if (res.headersSent) return next(err);


res.status(500).json({ success: false, error: err.message || 'Error del servidor' });
}

