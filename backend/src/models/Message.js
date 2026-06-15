const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Message = sequelize.define('Message', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  conversationId: { type: DataTypes.UUID, allowNull: false },
  senderId: { type: DataTypes.UUID, allowNull: false },
  content: { type: DataTypes.TEXT },
  type: { type: DataTypes.ENUM('text', 'image', 'document', 'audio', 'video', 'location'), defaultValue: 'text' },
  fileUrl: { type: DataTypes.STRING },
  fileMetadata: { type: DataTypes.JSONB, defaultValue: {} },
  translation: { type: DataTypes.JSONB, defaultValue: {} },
  readBy: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  readAt: { type: DataTypes.DATE },
  isEdited: { type: DataTypes.BOOLEAN, defaultValue: false },
  editedAt: { type: DataTypes.DATE },
  deletedFor: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  replyToId: { type: DataTypes.UUID },
})

module.exports = Message
