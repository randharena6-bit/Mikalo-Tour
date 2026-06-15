const { Review, Booking, Guide, Agency } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const { Op } = require('sequelize')

exports.createReview = async (req, res, next) => {
  try {
    const { targetType, targetId, bookingId, rating, comment, images } = req.body

    if (bookingId) {
      const booking = await Booking.findByPk(bookingId)
      if (!booking || booking.touristId !== req.user.id) {
        return ApiResponse.forbidden(res, 'Vous ne pouvez pas évaluer cette réservation')
      }
      if (booking.status !== 'completed') {
        return ApiResponse.badRequest(res, 'La réservation doit être terminée')
      }
    }

    const existing = await Review.findOne({ where: { reviewerId: req.user.id, targetType, targetId, bookingId } })
    if (existing) return ApiResponse.conflict(res, 'Vous avez déjà évalué')

    const review = await Review.create({
      reviewerId: req.user.id,
      targetType,
      targetId,
      bookingId,
      rating,
      comment,
      images,
    })

    const reviews = await Review.findAll({ where: { targetType, targetId } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    if (targetType === 'guide') {
      await Guide.update({ rating: avgRating.toFixed(1), reviewCount: reviews.length }, { where: { id: targetId } })
    } else if (targetType === 'agency') {
      await Agency.update({ rating: avgRating.toFixed(1), reviewCount: reviews.length }, { where: { id: targetId } })
    }

    ApiResponse.created(res, { review }, 'Avis publié')
  } catch (error) {
    next(error)
  }
}

exports.getReviews = async (req, res, next) => {
  try {
    const { targetType, targetId, page = 1, limit = 20 } = req.query
    const where = {}
    if (targetType) where.targetType = targetType
    if (targetId) where.targetId = targetId

    const { count, rows } = await Review.findAndCountAll({
      where,
      include: [{ association: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    })

    ApiResponse.paginated(res, { reviews: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.respondToReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (!review) return ApiResponse.notFound(res, 'Avis non trouvé')

    const { responseFromOwner } = req.body
    await review.update({ responseFromOwner, responseAt: new Date() })
    ApiResponse.success(res, { review }, 'Réponse publiée')
  } catch (error) {
    next(error)
  }
}

exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (!review) return ApiResponse.notFound(res, 'Avis non trouvé')
    await review.increment('helpfulCount')
    ApiResponse.success(res, { helpfulCount: review.helpfulCount + 1 })
  } catch (error) {
    next(error)
  }
}
