const { Payment, Booking, Guide, Agency } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const PaymentService = require('../services/payment.service')

exports.createPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.body.bookingId)
    if (!booking) return ApiResponse.notFound(res, 'Réservation non trouvée')
    if (booking.touristId !== req.user.id) return ApiResponse.forbidden(res)

    const existingPayment = await Payment.findOne({ where: { bookingId: booking.id, status: 'success' } })
    if (existingPayment) return ApiResponse.conflict(res, 'Déjà payé')

    const payment = await Payment.create({
      bookingId: booking.id,
      payerId: req.user.id,
      payeeId: req.body.payeeId,
      amount: booking.totalAmount,
      commission: booking.commissionAmount,
      netAmount: booking.netAmount,
      currency: booking.currency,
      method: req.body.method,
    })

    if (['mvola', 'orange_money', 'airtel_money'].includes(req.body.method)) {
      await PaymentService.processMobileMoney(payment, req.body.phoneNumber, req.body.method)
      await booking.update({ status: 'confirmed' })
    } else if (req.body.method === 'paypal') {
      await PaymentService.processPayPal(payment, req.body.paypalOrderId)
      await booking.update({ status: 'confirmed' })
    } else {
      await PaymentService.processCardPayment(payment, req.body.cardToken)
      await booking.update({ status: 'confirmed' })
    }

    ApiResponse.success(res, { payment }, 'Paiement effectué')
  } catch (error) {
    next(error)
  }
}

exports.getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id)
    if (!payment) return ApiResponse.notFound(res, 'Paiement non trouvé')
    ApiResponse.success(res, { payment })
  } catch (error) {
    next(error)
  }
}

exports.refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id)
    if (!payment) return ApiResponse.notFound(res, 'Paiement non trouvé')
    if (payment.status !== 'success') return ApiResponse.badRequest(res, 'Paiement non remboursable')

    await PaymentService.processRefund(payment, req.body.reason)
    await Booking.update({ status: 'refunded' }, { where: { id: payment.bookingId } })

    ApiResponse.success(res, { payment }, 'Remboursement effectué')
  } catch (error) {
    next(error)
  }
}
