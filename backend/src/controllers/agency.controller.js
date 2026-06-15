const { Agency, User } = require('../models')
const ApiResponse = require('../utils/apiResponse')

exports.createAgency = async (req, res, next) => {
  try {
    if (req.user.role !== 'agency') {
      return ApiResponse.badRequest(res, 'Vous devez avoir un rôle agence')
    }
    const existing = await Agency.findOne({ where: { userId: req.user.id } })
    if (existing) return ApiResponse.conflict(res, 'Agence déjà existante')

    const agency = await Agency.create({ userId: req.user.id, ...req.body })
    ApiResponse.created(res, { agency }, 'Agence créée')
  } catch (error) {
    next(error)
  }
}

exports.getMyAgency = async (req, res, next) => {
  try {
    const agency = await Agency.findOne({
      where: { userId: req.user.id },
      include: [{ association: 'guides', include: [{ association: 'user', attributes: { exclude: ['password'] } }] }],
    })
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')
    ApiResponse.success(res, { agency })
  } catch (error) {
    next(error)
  }
}

exports.updateAgency = async (req, res, next) => {
  try {
    const agency = await Agency.findOne({ where: { userId: req.user.id } })
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')

    const allowed = ['name', 'logo', 'description', 'address', 'city', 'region', 'phone', 'website', 'services', 'regions']
    const updates = {}
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    await agency.update(updates)
    ApiResponse.success(res, { agency }, 'Agence mise à jour')
  } catch (error) {
    next(error)
  }
}

exports.getAgency = async (req, res, next) => {
  try {
    const agency = await Agency.findByPk(req.params.id, {
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
    })
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')
    ApiResponse.success(res, { agency })
  } catch (error) {
    next(error)
  }
}

exports.listAgencies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, region, service, minRating, search } = req.query
    const where = {}
    if (region) where.regions = { [require('sequelize').Op.contains]: [region] }
    if (service) where.services = { [require('sequelize').Op.contains]: [service] }
    if (minRating) where.rating = { [require('sequelize').Op.gte]: parseFloat(minRating) }

    const { count, rows } = await Agency.findAndCountAll({
      where,
      include: [{ association: 'user', attributes: { exclude: ['password'] } }],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['rating', 'DESC']],
    })

    ApiResponse.paginated(res, { agencies: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.recruitGuide = async (req, res, next) => {
  try {
    const { GuideAgency, Guide } = require('../models')
    const agency = await Agency.findOne({ where: { userId: req.user.id } })
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')

    const guide = await Guide.findByPk(req.params.guideId)
    if (!guide) return ApiResponse.notFound(res, 'Guide non trouvé')

    const existing = await GuideAgency.findOne({ where: { guideId: guide.id, agencyId: agency.id } })
    if (existing) return ApiResponse.conflict(res, 'Demande déjà existante')

    const partnership = await GuideAgency.create({
      guideId: guide.id,
      agencyId: agency.id,
      commissionRate: req.body.commissionRate || 15,
    })

    const NotificationService = require('../services/notification.service')
    await NotificationService.sendPartnershipRequest(guide.userId, agency.name)

    ApiResponse.created(res, { partnership }, 'Demande de partenariat envoyée')
  } catch (error) {
    next(error)
  }
}

exports.getAgencyQRCode = async (req, res, next) => {
  try {
    const QRCodeService = require('../services/qrcode.service')
    const agency = await Agency.findOne({ where: { userId: req.user.id } })
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')

    const qr = await QRCodeService.generateProfileQR(req.user, agency)
    ApiResponse.success(res, { qrCode: qr })
  } catch (error) {
    next(error)
  }
}
