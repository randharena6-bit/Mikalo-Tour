const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM(
    'booking_confirmed', 'booking_cancelled', 'booking_reminder',
    'new_message', 'new_review', 'review_response',
    'payment_received', 'payout_processed',
    'guide_request', 'agency_invitation',
    'partnership_request', 'partnership_accepted',
    'promotion', 'system'
  ), allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT },
  data: { type: DataTypes.JSONB, defaultValue: {} },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: { type: DataTypes.DATE },
})

module.exports = Notification
