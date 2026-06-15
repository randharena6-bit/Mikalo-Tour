const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const GuideAgency = sequelize.define('GuideAgency', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  guideId: { type: DataTypes.UUID, allowNull: false },
  agencyId: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'active', 'suspended', 'terminated'), defaultValue: 'pending' },
  commissionRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 15.00 },
  startedAt: { type: DataTypes.DATE },
  endedAt: { type: DataTypes.DATE },
})

module.exports = GuideAgency
