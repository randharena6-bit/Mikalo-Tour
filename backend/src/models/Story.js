const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Story = sequelize.define('Story', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  authorId: { type: DataTypes.UUID, allowNull: false },
  authorType: { type: DataTypes.ENUM('tourist', 'guide', 'agency'), allowNull: false },
  mediaUrl: { type: DataTypes.STRING, allowNull: false },
  mediaType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image' },
  caption: { type: DataTypes.STRING },
  viewedBy: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  expiresAt: { type: DataTypes.DATE },
})

module.exports = Story
