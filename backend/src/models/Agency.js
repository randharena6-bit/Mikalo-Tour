const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { AGENCY_STATUS } = require('../config/constants')

const Agency = sequelize.define('Agency', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING, defaultValue: 'Madagascar' },
  phone: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  registrationNumber: { type: DataTypes.STRING },
  businessLicense: { type: DataTypes.STRING },
  operatingPermit: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM(Object.values(AGENCY_STATUS)), defaultValue: AGENCY_STATUS.PENDING },
  services: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  regions: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalBookings: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
})

module.exports = Agency
