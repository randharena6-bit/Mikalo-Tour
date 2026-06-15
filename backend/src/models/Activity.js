const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Activity = sequelize.define('Activity', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  authorId: { type: DataTypes.UUID, allowNull: false },
  authorType: { type: DataTypes.ENUM('guide', 'agency'), allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.ENUM('hiking', 'diving', 'safari', 'cultural', 'water', 'adventure', 'relaxation', 'other'), defaultValue: 'other' },
  location: { type: DataTypes.JSONB },
  region: { type: DataTypes.STRING },
  duration: { type: DataTypes.INTEGER },
  durationUnit: { type: DataTypes.ENUM('hour', 'day'), defaultValue: 'hour' },
  price: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: 'MGA' },
  maxParticipants: { type: DataTypes.INTEGER, defaultValue: 20 },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  includes: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
})

module.exports = Activity
