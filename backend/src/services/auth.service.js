const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { User } = require('../models')

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
  }

  generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex')
  }

  async register({ email, password, name, role, authProvider = 'email' }) {
    const existing = await User.findOne({ where: { email } })
    if (existing) throw Object.assign(new Error('Cet email est déjà utilisé'), { status: 409 })

    const user = await User.create({ email, password, name, role, authProvider })
    const token = this.generateToken(user)
    return { user, token }
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } })
    if (!user) throw Object.assign(new Error('Email ou mot de passe incorrect'), { status: 401 })
    if (!user.password) throw Object.assign(new Error('Connectez-vous via ' + user.authProvider), { status: 400 })
    if (user.status !== 'active') throw Object.assign(new Error('Compte désactivé'), { status: 403 })

    const valid = await user.comparePassword(password)
    if (!valid) throw Object.assign(new Error('Email ou mot de passe incorrect'), { status: 401 })

    await user.update({ lastLoginAt: new Date() })
    const token = this.generateToken(user)
    return { user, token }
  }

  async socialAuth({ email, name, authProvider, authProviderId, avatar }) {
    let user = await User.findOne({ where: { email } })
    if (!user) {
      user = await User.create({ email, name, authProvider, authProviderId, avatar, emailVerified: true })
    } else {
      await user.update({ authProviderId, avatar, lastLoginAt: new Date() })
    }
    const token = this.generateToken(user)
    return { user, token }
  }
}

module.exports = new AuthService()
