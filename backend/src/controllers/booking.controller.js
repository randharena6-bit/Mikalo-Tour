const { Booking, Payment, User, Guide, Agency } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const { BOOKING_STATUS, COMMISSION_RATES } = require('../config/constants')
const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')

function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'MT-'
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length))
  return ref
}

exports.createBooking = async (req, res, next) => {
  try {
    const { guideId, agencyId, type, startDate, endDate, duration, durationUnit, adults, children, totalAmount, currency, notes, specialRequests, meetingPoint, items } = req.body

    const amount = parseFloat(totalAmount)
    const commissionRate = agencyId ? COMMISSION_RATES.AGENCY : COMMISSION_RATES.GUIDE
    const commission = amount * commissionRate
    const netAmount = amount - commission

    const booking = await Booking.create({
      reference: generateReference(),
      touristId: req.user.id,
      guideId,
      agencyId,
      type,
      status: BOOKING_STATUS.PENDING,
      startDate,
      endDate,
      duration,
      durationUnit,
      adults,
      children,
      totalAmount: amount,
      commissionAmount: commission,
      netAmount,
      currency: currency || 'MGA',
      notes,
      specialRequests,
      meetingPoint,
      items: items || [],
    })

    if (req.body.isCombo) {
      const comboItems = req.body.comboItems || []
      booking.items = comboItems
      booking.type = 'combo'
      await booking.save()
    }

    ApiResponse.created(res, { booking }, 'Réservation créée')
  } catch (error) {
    next(error)
  }
}

exports.getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const where = { touristId: req.user.id }
    if (status) where.status = status

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { association: 'guide', include: [{ association: 'user', attributes: ['name', 'avatar'] }] },
        { association: 'agency', include: [{ association: 'user', attributes: ['name', 'avatar'] }] },
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    })

    ApiResponse.paginated(res, { bookings: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.getGuideBookings = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ where: { userId: req.user.id } })
    if (!guide) return ApiResponse.notFound(res, 'Profil guide non trouvé')

    const { page = 1, limit = 20, status } = req.query
    const where = { guideId: guide.id }
    if (status) where.status = status

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { association: 'tourist', attributes: ['id', 'name', 'avatar', 'email'] },
        { association: 'agency', include: [{ association: 'user', attributes: ['name'] }] },
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['startDate', 'ASC']],
    })

    ApiResponse.paginated(res, { bookings: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.getAgencyBookings = async (req, res, next) => {
  try {
    const agency = await Agency.findOne({ where: { userId: req.user.id } })
    if (!agency) return ApiResponse.notFound(res, 'Agence non trouvée')

    const { page = 1, limit = 20, status } = req.query
    const where = { agencyId: agency.id }
    if (status) where.status = status

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { association: 'tourist', attributes: ['id', 'name', 'avatar', 'email'] },
        { association: 'guide', include: [{ association: 'user', attributes: ['name'] }] },
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['startDate', 'DESC']],
    })

    ApiResponse.paginated(res, { bookings: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { association: 'tourist', attributes: ['id', 'name', 'avatar', 'email'] },
        { association: 'guide', include: [{ association: 'user', attributes: ['name', 'avatar'] }] },
        { association: 'agency', include: [{ association: 'user', attributes: ['name', 'avatar'] }] },
        { association: 'payments' },
      ],
    })
    if (!booking) return ApiResponse.notFound(res, 'Réservation non trouvée')

    if (booking.touristId !== req.user.id && req.user.role !== 'admin') {
      const guide = await Guide.findOne({ where: { userId: req.user.id } })
      const agency = await Agency.findOne({ where: { userId: req.user.id } })
      if (!guide || booking.guideId !== guide?.id) {
        if (!agency || booking.agencyId !== agency?.id) {
          return ApiResponse.forbidden(res)
        }
      }
    }

    ApiResponse.success(res, { booking })
  } catch (error) {
    next(error)
  }
}

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id)
    if (!booking) return ApiResponse.notFound(res, 'Réservation non trouvée')

    const { status, reason } = req.body
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in_progress', 'cancelled'],
      in_progress: ['completed'],
      completed: [],
      cancelled: ['refunded'],
    }

    if (!validTransitions[booking.status]?.includes(status)) {
      return ApiResponse.badRequest(res, `Transition de ${booking.status} à ${status} non valide`)
    }

    const updates = { status }
    if (status === 'cancelled') { updates.cancelledAt = new Date(); updates.cancellationReason = reason }
    if (status === 'completed') updates.completedAt = new Date()

    await booking.update(updates)

    const NotificationService = require('../services/notification.service')
    await NotificationService.sendBookingConfirmation(booking.touristId, booking)

    ApiResponse.success(res, { booking }, 'Statut mis à jour')
  } catch (error) {
    next(error)
  }
}

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id)
    if (!booking) return ApiResponse.notFound(res, 'Réservation non trouvée')
    if (booking.touristId !== req.user.id) return ApiResponse.forbidden(res)
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return ApiResponse.badRequest(res, 'Impossible d\'annuler cette réservation')
    }

    await booking.update({ status: 'cancelled', cancelledAt: new Date(), cancellationReason: req.body.reason })
    ApiResponse.success(res, { booking }, 'Réservation annulée')
  } catch (error) {
    next(error)
  }
}
