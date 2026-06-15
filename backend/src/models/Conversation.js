const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  type: { type: DataTypes.ENUM('direct', 'group'), defaultValue: 'direct' },
  title: { type: DataTypes.STRING },
  lastMessageAt: { type: DataTypes.DATE },
  lastMessagePreview: { type: DataTypes.STRING },
  participantIds: { type: DataTypes.ARRAY(DataTypes.UUID), allowNull: false },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
})

module.exports = Conversation
