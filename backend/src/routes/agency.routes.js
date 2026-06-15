const { Router } = require('express')
const ctrl = require('../controllers/agency.controller')
const { auth, authorize } = require('../middleware/auth')

const router = Router()

router.post('/', auth, authorize('agency'), ctrl.createAgency)
router.get('/me', auth, authorize('agency'), ctrl.getMyAgency)
router.put('/', auth, authorize('agency'), ctrl.updateAgency)
router.post('/recruit/:guideId', auth, authorize('agency'), ctrl.recruitGuide)
router.get('/qr-code', auth, authorize('agency'), ctrl.getAgencyQRCode)
router.get('/', ctrl.listAgencies)
router.get('/:id', ctrl.getAgency)

module.exports = router
