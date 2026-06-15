const jwt = require('jsonwebtoken')
const ApiResponse = require('../utils/apiResponse')
const { User } = require('../models')

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Token manquant')
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findByPk(decoded.id)
    if (!user || user.status !== 'active') {
      return ApiResponse.unauthorized(res, 'Utilisateur non trouvé ou désactivé')
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expiré')
    }
    return ApiResponse.unauthorized(res, 'Token invalide')
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Vous n\'avez pas les droits nécessaires')
    }
    next()
  }
}

module.exports = { auth, authorize }
