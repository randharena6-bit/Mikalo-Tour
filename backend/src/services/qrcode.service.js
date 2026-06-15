const QRCode = require('qrcode')

class QRCodeService {
  async generateProfileQR(user, profile) {
    const profileUrl = `${process.env.FRONTEND_URL}/profile/${profile?.id || user.id}`
    const data = JSON.stringify({
      type: user.role === 'guide' ? 'guide' : 'agency',
      id: profile?.id || user.id,
      name: user.name,
      rating: profile?.rating || 0,
      url: profileUrl,
      services: profile?.services || profile?.specialties || [],
    })

    const qrDataURL = await QRCode.toDataURL(data, {
      width: 400,
      margin: 2,
      color: { dark: '#0ea5e9', light: '#ffffff' },
    })

    return { qrDataURL, profileUrl, data }
  }

  async generateBookingQR(booking) {
    const data = JSON.stringify({
      reference: booking.reference,
      type: booking.type,
      date: booking.startDate,
      amount: booking.totalAmount,
    })

    return QRCode.toDataURL(data, { width: 300, margin: 1 })
  }
}

module.exports = new QRCodeService()
