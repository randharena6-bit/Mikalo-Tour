const { Payment } = require('../models')

class PaymentService {
  async processMobileMoney(payment, phoneNumber, provider) {
    switch (provider) {
      case 'mvola':
        return this.processMVola(payment, phoneNumber)
      case 'orange_money':
        return this.processOrangeMoney(payment, phoneNumber)
      case 'airtel_money':
        return this.processAirtelMoney(payment, phoneNumber)
      default:
        throw new Error('Mode de paiement non supporté')
    }
  }

  async processMVola(payment, phoneNumber) {
    console.log(`[MVola] Paiement ${payment.amount} MGA de ${phoneNumber}`)
    await payment.update({ transactionId: `MV-${Date.now()}`, status: 'success', paidAt: new Date() })
    return { success: true, transactionId: payment.transactionId, message: 'Paiement MVola effectué' }
  }

  async processOrangeMoney(payment, phoneNumber) {
    console.log(`[Orange Money] Paiement ${payment.amount} MGA de ${phoneNumber}`)
    await payment.update({ transactionId: `OM-${Date.now()}`, status: 'success', paidAt: new Date() })
    return { success: true, transactionId: payment.transactionId, message: 'Paiement Orange Money effectué' }
  }

  async processAirtelMoney(payment, phoneNumber) {
    console.log(`[Airtel Money] Paiement ${payment.amount} MGA de ${phoneNumber}`)
    await payment.update({ transactionId: `AM-${Date.now()}`, status: 'success', paidAt: new Date() })
    return { success: true, transactionId: payment.transactionId, message: 'Paiement Airtel Money effectué' }
  }

  async processCardPayment(payment, cardToken) {
    console.log(`[Carte] Paiement ${payment.amount} ${payment.currency}`)
    await payment.update({ transactionId: `CARD-${Date.now()}`, status: 'success', paidAt: new Date() })
    return { success: true, transactionId: payment.transactionId, message: 'Paiement par carte effectué' }
  }

  async processPayPal(payment, paypalOrderId) {
    console.log(`[PayPal] Paiement ${payment.amount} USD`)
    await payment.update({ transactionId: paypalOrderId, status: 'success', paidAt: new Date() })
    return { success: true, transactionId: paypalOrderId, message: 'Paiement PayPal effectué' }
  }

  async processRefund(payment, reason) {
    await payment.update({ status: 'refunded', refundedAt: new Date(), refundReason: reason })
    return { success: true, message: 'Remboursement effectué' }
  }
}

module.exports = new PaymentService()
