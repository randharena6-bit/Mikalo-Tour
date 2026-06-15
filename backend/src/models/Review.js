const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  reviewerId: { type: DataTypes.UUID, allowNull: false },
  targetType: { type: DataTypes.ENUM('guide', 'agency', 'activity', 'circuit'), allowNull: false },
  targetId: { type: DataTypes.UUID, allowNull: false },
  bookingId: { type: DataTypes.UUID },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  responseFromOwner: { type: DataTypes.TEXT },
  responseAt: { type: DataTypes.DATE },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  helpfulCount: { type: DataTypes.INTEGER, defaultValue: 0 },
})

module.exports = Review
