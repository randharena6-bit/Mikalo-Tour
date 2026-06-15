require('dotenv').config()
const http = require('http')
const app = require('./app')
const sequelize = require('./config/database')
const { initSocket } = require('./socket')
const { User } = require('./models')
const { ROLES } = require('./config/constants')

const PORT = process.env.PORT || 5000

async function seedAdmin() {
  try {
    const admin = await User.findOne({ where: { email: 'admin@mikalo.mg' } })
    if (!admin) {
      await User.create({
        email: 'admin@mikalo.mg',
        password: 'Admin@2026',
        name: 'Admin Mikalo',
        role: ROLES.ADMIN,
        emailVerified: true,
      })
      console.log('[Seed] Admin créé: admin@mikalo.mg / Admin@2026')
    }
  } catch (error) {
    console.error('[Seed] Erreur:', error.message)
  }
}

async function start() {
  try {
    await sequelize.authenticate()
    console.log('[DB] PostgreSQL connecté')

    await sequelize.sync({ alter: true })
    console.log('[DB] Modèles synchronisés')

    await seedAdmin()

    const server = http.createServer(app)
    initSocket(server)

    server.listen(PORT, () => {
      console.log(`\n🚀 Mikalo Tour API démarrée sur http://localhost:${PORT}`)
      console.log(`📋 Santé: http://localhost:${PORT}/api/health`)
      console.log(`📚 API: http://localhost:${PORT}/api/v1`)
    })
  } catch (error) {
    console.error('[FATAL] Démarrage échoué:', error)
    process.exit(1)
  }
}

start()
