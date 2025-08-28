const helmet = require("helmet");
const cors = require("cors");

// Logger simple (ya lo tienes más custom, puedes elegir cuál usar)
const logger = (req, res, next) => {
  console.log(`➤ [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Manejo de errores centralizado
const errorHandler = (err, req, res, next) => {
  console.error("✖ ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Error en el servidor",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
};

// 404
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};

module.exports = {
  helmet,
  cors,
  logger,
  errorHandler,
  notFoundHandler,
};
