const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Post = sequelize.define('Post', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  authorId: { type: DataTypes.UUID, allowNull: false },
  authorType: { type: DataTypes.ENUM('tourist', 'guide', 'agency'), allowNull: false },
  content: { type: DataTypes.TEXT },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  videos: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  location: { type: DataTypes.JSONB },
  likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  commentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  shareCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPinned: { type: DataTypes.BOOLEAN, defaultValue: false },
})

module.exports = Post
