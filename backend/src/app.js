const path = require('path')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

const uploadsDir = path.resolve(__dirname, '../uploads')
if (require('fs').existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir))
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Trop de requêtes, réessayez plus tard' },
})
app.use('/api', limiter)

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Mikalo Tour API opérationnelle', timestamp: new Date().toISOString() })
})

app.use('/api/v1', routes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' })
})

app.use(errorHandler)

module.exports = app
