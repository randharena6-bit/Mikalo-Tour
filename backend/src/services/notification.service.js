const { Notification } = require('../models')
const { getIO } = require('../socket')

class NotificationService {
  async send(userId, type, title, body, data = {}) {
    const notification = await Notification.create({ userId, type, title, body, data })

    const io = getIO()
    if (io) {
      io.to(`user:${userId}`).emit('notification', {
        id: notification.id,
        type,
        title,
        body,
        data,
        createdAt: notification.createdAt,
      })
    }

    return notification
  }

  async sendBookingConfirmation(userId, booking) {
    return this.send(userId, 'booking_confirmed', 'Réservation confirmée',
      `Votre réservation #${booking.reference} a été confirmée.`,
      { bookingId: booking.id, reference: booking.reference }
    )
  }

  async sendNewMessage(userId, conversationId, senderName, preview) {
    return this.send(userId, 'new_message', `Nouveau message de ${senderName}`,
      preview, { conversationId }
    )
  }

  async sendNewReview(userId, reviewerName, rating) {
    return this.send(userId, 'new_review', `${rating}⭐ Nouvel avis`,
      `${reviewerName} a laissé un avis.`,
      { rating }
    )
  }

  async sendPaymentReceived(userId, amount, reference) {
    return this.send(userId, 'payment_received', 'Paiement reçu',
      `${amount} MGA reçu pour la réservation #${reference}.`,
      { amount, reference }
    )
  }

  async sendPartnershipRequest(guideId, agencyName) {
    return this.send(guideId, 'partnership_request', 'Demande de partenariat',
      `${agencyName} souhaite travailler avec vous.`,
      { agencyName }
    )
  }
}

module.exports = new NotificationService()
