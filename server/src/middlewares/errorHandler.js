const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  // Prisma known request errors (P2002 for unique constraint, etc.)
  if (err.code && err.code.startsWith('P')) {
    if (err.code === 'P2002') {
      const targets = err.meta ? err.meta.target : [];
      return res.status(409).json({
        error: 'Database constraint violation.',
        details: `A record with this value already exists: ${targets.join(', ')}`
      });
    }
    return res.status(400).json({
      error: 'Database operation failed.',
      details: err.message
    });
  }

  // General fallback
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
