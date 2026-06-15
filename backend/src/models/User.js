const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const { ROLES, USER_STATUS, LANGUAGES } = require('../config/constants')

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  role: { type: DataTypes.ENUM(Object.values(ROLES)), defaultValue: ROLES.TOURIST },
  status: { type: DataTypes.ENUM(Object.values(USER_STATUS)), defaultValue: USER_STATUS.ACTIVE },
  languages: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  preferences: { type: DataTypes.JSONB, defaultValue: {} },
  emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  phoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  authProvider: { type: DataTypes.STRING, defaultValue: 'email' },
  authProviderId: { type: DataTypes.STRING },
  lastLoginAt: { type: DataTypes.DATE },
  subscriptionTier: { type: DataTypes.STRING, defaultValue: 'free' },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const bcrypt = require('bcryptjs')
        user.password = await bcrypt.hash(user.password, 12)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const bcrypt = require('bcryptjs')
        user.password = await bcrypt.hash(user.password, 12)
      }
    },
  },
})

User.prototype.comparePassword = async function (candidatePassword) {
  const bcrypt = require('bcryptjs')
  return bcrypt.compare(candidatePassword, this.password)
}

User.prototype.toJSON = function () {
  const values = { ...this.get() }
  delete values.password
  return values
}

module.exports = User
