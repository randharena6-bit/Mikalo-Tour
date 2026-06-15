const { Guide, Agency, Booking, Review, Circuit, Activity } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const { Op } = require('sequelize')

exports.getGuideDashboard = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ where: { userId: req.user.id } })
    if (!guide) return ApiResponse.notFound(res, 'Profil guide non trouvé')

    const now = new Date()
    const thisMonth = { [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1) }

    const [upcomingBookings, monthlyBookings, monthlyReviews, circuits] = await Promise.all([
      Booking.count({ where: { guideId: guide.id, status: { [Op.in]: ['confirmed', 'in_progress'] }, startDate: { [Op.gte]: now } } }),
      Booking.count({ where: { guideId: guide.id, createdAt: thisMonth } }),
      Review.count({ where: { targetType: 'guide', targetId: guide.id, createdAt: thisMonth } }),
      Circuit.count({ where: { authorId: req.user.id, isActive: true } }),
    ])

    ApiResponse.success(res, {
      stats: {
        totalBookings: guide.totalBookings,
        rating: guide.rating,
        reviewCount: guide.reviewCount,
        upcomingBookings,
        monthlyBookings,
        monthlyReviews,
        activeCircuits: circuits,
        totalEarnings: 0,
      },
      status: guide.status,
      isPremium: guide.isPremium,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAgencyDashboard = async (req, res, next) => {
  try {
    const agency = await Agency.findOne({ where: { userId: req.user.id } })
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')

    const now = new Date()
    const thisMonth = { [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1) }

    const [activeBookings, monthlyBookings, partnerGuides, circuits, activities] = await Promise.all([
      Booking.count({ where: { agencyId: agency.id, status: { [Op.in]: ['confirmed', 'in_progress'] } } }),
      Booking.count({ where: { agencyId: agency.id, createdAt: thisMonth } }),
      (require('../models').GuideAgency).count({ where: { agencyId: agency.id, status: 'active' } }),
      Circuit.count({ where: { authorId: req.user.id, isActive: true } }),
      Activity.count({ where: { authorId: req.user.id, isActive: true } }),
    ])

    ApiResponse.success(res, {
      stats: {
        totalBookings: agency.totalBookings,
        rating: agency.rating,
        reviewCount: agency.reviewCount,
        activeBookings,
        monthlyBookings,
        partnerGuides,
        activeCircuits: circuits,
        activeActivities: activities,
        totalEarnings: 0,
      },
      status: agency.status,
      isPremium: agency.isPremium,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalGuides, totalAgencies, totalBookings, totalRevenue, pendingGuides, pendingAgencies] = await Promise.all([
      require('../models/User').count(),
      Guide.count(),
      Agency.count(),
      Booking.count(),
      Booking.sum('totalAmount'),
      Guide.count({ where: { status: 'pending' } }),
      Agency.count({ where: { status: 'pending' } }),
    ])

    ApiResponse.success(res, {
      stats: {
        totalUsers,
        totalGuides,
        totalAgencies,
        totalBookings,
        totalRevenue: totalRevenue || 0,
        pendingGuides,
        pendingAgencies,
      },
    })
  } catch (error) {
    next(error)
  }
}
