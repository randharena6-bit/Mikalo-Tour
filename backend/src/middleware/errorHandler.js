const ApiResponse = require('../utils/apiResponse')

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors?.map(e => e.message) || ['Erreur de validation']
    return ApiResponse.badRequest(res, 'Erreur de validation', messages)
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ApiResponse.badRequest(res, 'Référence invalide')
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token invalide ou expiré')
  }

  if (err.status) {
    return ApiResponse.error(res, err.message, err.status)
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return ApiResponse.badRequest(res, 'Fichier trop volumineux')
  }

  return ApiResponse.error(res, 'Erreur interne du serveur')
}

module.exports = errorHandler
