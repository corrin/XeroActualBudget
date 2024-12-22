export function errorHandler(err, req, res, next) {
  console.error('Error occurred:', err);

  // Handle specific error types
  if (err.name === 'NgrokError') {
    return res.status(500).json({
      error: 'Failed to setup secure tunnel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}