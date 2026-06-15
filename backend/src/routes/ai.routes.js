const { Router } = require('express')
const ctrl = require('../controllers/ai.controller')
const { auth } = require('../middleware/auth')

const router = Router()

router.post('/plan', auth, ctrl.planTrip)
router.post('/translate', auth, ctrl.translate)
router.post('/detect-language', auth, ctrl.detectLanguage)
router.get('/trends', auth, ctrl.analyzeTrends)
router.post('/suggest-price', auth, ctrl.suggestPrice)

module.exports = router
