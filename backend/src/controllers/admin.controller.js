const { User, Guide, Agency, Booking, GuideAgency } = require('../models')
const ApiResponse = require('../utils/apiResponse')

exports.listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query
    const where = {}
    if (role) where.role = role
    if (status) where.status = status

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    })

    ApiResponse.paginated(res, { users: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return ApiResponse.notFound(res, 'Utilisateur non trouvé')
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    await user.update({ status: newStatus })
    ApiResponse.success(res, { user }, `Utilisateur ${newStatus === 'active' ? 'activé' : 'suspendu'}`)
  } catch (error) {
    next(error)
  }
}

exports.approveGuide = async (req, res, next) => {
  try {
    const guide = await Guide.findByPk(req.params.id)
    if (!guide) return ApiResponse.notFound(res, 'Guide non trouvé')
    await guide.update({ status: 'certified' })
    ApiResponse.success(res, { guide }, 'Guide certifié')
  } catch (error) {
    next(error)
  }
}

exports.rejectGuide = async (req, res, next) => {
  try {
    const guide = await Guide.findByPk(req.params.id)
    if (!guide) return ApiResponse.notFound(res, 'Guide non trouvé')
    await guide.update({ status: 'rejected' })
    ApiResponse.success(res, { guide }, 'Guide rejeté')
  } catch (error) {
    next(error)
  }
}

exports.approveAgency = async (req, res, next) => {
  try {
    const agency = await Agency.findByPk(req.params.id)
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')
    await agency.update({ status: 'verified' })
    ApiResponse.success(res, { agency }, 'Agence vérifiée')
  } catch (error) {
    next(error)
  }
}

exports.rejectAgency = async (req, res, next) => {
  try {
    const agency = await Agency.findByPk(req.params.id)
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')
    await agency.update({ status: 'rejected' })
    ApiResponse.success(res, { agency }, 'Agence rejetée')
  } catch (error) {
    next(error)
  }
}

exports.getStats = async (req, res, next) => {
  try {
    const now = new Date()
    const thisMonth = { [require('sequelize').Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1) }

    const stats = await Promise.all([
      User.count(),
      User.count({ where: { createdAt: thisMonth } }),
      Guide.count(),
      Agency.count(),
      Booking.count(),
      Booking.count({ where: { status: 'completed' } }),
      Booking.sum('totalAmount'),
      Guide.count({ where: { status: 'pending' } }),
      Agency.count({ where: { status: 'pending' } }),
    ])

    ApiResponse.success(res, {
      stats: {
        totalUsers: stats[0],
        newUsersThisMonth: stats[1],
        totalGuides: stats[2],
        totalAgencies: stats[3],
        totalBookings: stats[4],
        completedBookings: stats[5],
        totalRevenue: stats[6] || 0,
        pendingGuides: stats[7],
        pendingAgencies: stats[8],
      },
    })
  } catch (error) {
    next(error)
  }
}
