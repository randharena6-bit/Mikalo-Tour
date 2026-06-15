const AuthService = require('../services/auth.service')
const ApiResponse = require('../utils/apiResponse')

exports.register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body)
    ApiResponse.created(res, result, 'Inscription réussie')
  } catch (error) {
    if (error.status) return ApiResponse.error(res, error.message, error.status)
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await AuthService.login(email, password)
    ApiResponse.success(res, result, 'Connexion réussie')
  } catch (error) {
    if (error.status) return ApiResponse.error(res, error.message, error.status)
    next(error)
  }
}

exports.socialAuth = async (req, res, next) => {
  try {
    const result = await AuthService.socialAuth(req.body)
    ApiResponse.success(res, result, 'Authentification réussie')
  } catch (error) {
    next(error)
  }
}

exports.me = async (req, res) => {
  ApiResponse.success(res, { user: req.user })
}

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {}
    const allowed = ['name', 'firstName', 'phone', 'bio', 'avatar', 'languages', 'preferences']
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })
    if (req.file) updates.avatar = req.file.path

    await req.user.update(updates)
    ApiResponse.success(res, { user: req.user }, 'Profil mis à jour')
  } catch (error) {
    next(error)
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const { User } = require('../models')
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { association: 'guide', required: false },
        { association: 'agency', required: false },
      ],
    })
    if (!user) return ApiResponse.notFound(res, 'Utilisateur non trouvé')
    ApiResponse.success(res, { user })
  } catch (error) {
    next(error)
  }
}
