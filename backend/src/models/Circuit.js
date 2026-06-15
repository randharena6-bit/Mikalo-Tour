const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Circuit = sequelize.define('Circuit', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  authorId: { type: DataTypes.UUID, allowNull: false },
  authorType: { type: DataTypes.ENUM('guide', 'agency'), allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  region: { type: DataTypes.STRING },
  duration: { type: DataTypes.INTEGER },
  durationUnit: { type: DataTypes.ENUM('hour', 'day', 'week'), defaultValue: 'day' },
  price: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: 'MGA' },
  maxParticipants: { type: DataTypes.INTEGER, defaultValue: 10 },
  inclusions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  exclusions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  itinerary: { type: DataTypes.JSONB, defaultValue: [] },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  difficulty: { type: DataTypes.ENUM('easy', 'moderate', 'hard'), defaultValue: 'moderate' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  bookingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
})

module.exports = Circuit
