const { Guide, User } = require('../models')
const ApiResponse = require('../utils/apiResponse')

exports.createGuideProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'guide') {
      return ApiResponse.badRequest(res, 'Vous devez avoir un rôle guide')
    }
    const existing = await Guide.findOne({ where: { userId: req.user.id } })
    if (existing) return ApiResponse.conflict(res, 'Profil guide déjà existant')

    const guide = await Guide.create({ userId: req.user.id, ...req.body })
    ApiResponse.created(res, { guide }, 'Profil guide créé')
  } catch (error) {
    next(error)
  }
}

exports.getMyGuideProfile = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({
      where: { userId: req.user.id },
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
    })
    if (!guide) return ApiResponse.notFound(res, 'Profil guide non trouvé')
    ApiResponse.success(res, { guide })
  } catch (error) {
    next(error)
  }
}

exports.updateGuideProfile = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ where: { userId: req.user.id } })
    if (!guide) return ApiResponse.notFound(res, 'Profil guide non trouvé')

    const allowed = ['certification', 'experience', 'specialties', 'zones', 'languages', 'hourlyRate', 'dailyRate', 'currency', 'availability', 'bio']
    const updates = {}
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    await guide.update(updates)
    ApiResponse.success(res, { guide }, 'Profil mis à jour')
  } catch (error) {
    next(error)
  }
}

exports.getGuide = async (req, res, next) => {
  try {
    const guide = await Guide.findByPk(req.params.id, {
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
    })
    if (!guide) return ApiResponse.notFound(res, 'Guide non trouvé')
    ApiResponse.success(res, { guide })
  } catch (error) {
    next(error)
  }
}

exports.listGuides = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, region, specialty, language, minRating, search } = req.query
    const offset = (page - 1) * limit
    const where = {}

    if (region) where.zones = { [require('sequelize').Op.contains]: [region] }
    if (specialty) where.specialties = { [require('sequelize').Op.contains]: [specialty] }
    if (language) where.languages = { [require('sequelize').Op.contains]: [language] }
    if (minRating) where.rating = { [require('sequelize').Op.gte]: parseFloat(minRating) }

    const { count, rows } = await Guide.findAndCountAll({
      where,
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['rating', 'DESC'], ['totalBookings', 'DESC']],
    })

    ApiResponse.paginated(res, { guides: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.uploadCertification = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ where: { userId: req.user.id } })
    if (!guide) return ApiResponse.notFound(res, 'Profil guide non trouvé')

    if (req.files?.certification) {
      guide.certificationDocument = req.files.certification[0].path
    }
    if (req.files?.identity) {
      guide.identityDocument = req.files.identity[0].path
    }
    await guide.save()
    ApiResponse.success(res, { guide }, 'Documents uploadés')
  } catch (error) {
    next(error)
  }
}

exports.getGuideQRCode = async (req, res, next) => {
  try {
    const QRCodeService = require('../services/qrcode.service')
    const guide = await Guide.findOne({ where: { userId: req.user.id } })
    if (!guide) return ApiResponse.notFound(res, 'Guide non trouvé')

    const qr = await QRCodeService.generateProfileQR(req.user, guide)
    ApiResponse.success(res, { qrCode: qr })
  } catch (error) {
    next(error)
  }
}
