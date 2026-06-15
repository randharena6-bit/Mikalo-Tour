const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { GUIDE_STATUS, LANGUAGES } = require('../config/constants')

const Guide = sequelize.define('Guide', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  certification: { type: DataTypes.STRING },
  certificationDocument: { type: DataTypes.STRING },
  identityDocument: { type: DataTypes.STRING },
  experience: { type: DataTypes.INTEGER, defaultValue: 0 },
  specialties: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  zones: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  languages: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  status: { type: DataTypes.ENUM(Object.values(GUIDE_STATUS)), defaultValue: GUIDE_STATUS.PENDING },
  hourlyRate: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  dailyRate: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: 'MGA' },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalBookings: { type: DataTypes.INTEGER, defaultValue: 0 },
  availability: { type: DataTypes.JSONB, defaultValue: {} },
  isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
})

module.exports = Guide
