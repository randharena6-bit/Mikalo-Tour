const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { BOOKING_STATUS, BOOKING_TYPE } = require('../config/constants')

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  reference: { type: DataTypes.STRING, unique: true },
  touristId: { type: DataTypes.UUID, allowNull: false },
  guideId: { type: DataTypes.UUID },
  agencyId: { type: DataTypes.UUID },
  type: { type: DataTypes.ENUM(Object.values(BOOKING_TYPE)), allowNull: false },
  status: { type: DataTypes.ENUM(Object.values(BOOKING_STATUS)), defaultValue: BOOKING_STATUS.PENDING },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  duration: { type: DataTypes.INTEGER },
  durationUnit: { type: DataTypes.ENUM('hour', 'day', 'week'), defaultValue: 'day' },
  adults: { type: DataTypes.INTEGER, defaultValue: 1 },
  children: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  commissionAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  netAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: 'MGA' },
  notes: { type: DataTypes.TEXT },
  specialRequests: { type: DataTypes.TEXT },
  meetingPoint: { type: DataTypes.STRING },
  cancellationReason: { type: DataTypes.TEXT },
  cancelledAt: { type: DataTypes.DATE },
  completedAt: { type: DataTypes.DATE },
  items: { type: DataTypes.JSONB, defaultValue: [] },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
})

module.exports = Booking
