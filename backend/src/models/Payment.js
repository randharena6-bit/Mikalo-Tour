const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { PAYMENT_METHOD, PAYMENT_STATUS } = require('../config/constants')

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  bookingId: { type: DataTypes.UUID, allowNull: false },
  payerId: { type: DataTypes.UUID, allowNull: false },
  payeeId: { type: DataTypes.UUID },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  commission: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  netAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: 'MGA' },
  method: { type: DataTypes.ENUM(Object.values(PAYMENT_METHOD)), allowNull: false },
  status: { type: DataTypes.ENUM(Object.values(PAYMENT_STATUS)), defaultValue: PAYMENT_STATUS.PENDING },
  transactionId: { type: DataTypes.STRING },
  receiptUrl: { type: DataTypes.STRING },
  paidAt: { type: DataTypes.DATE },
  refundedAt: { type: DataTypes.DATE },
  refundReason: { type: DataTypes.TEXT },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
})

module.exports = Payment
