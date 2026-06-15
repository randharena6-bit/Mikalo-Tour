const { Router } = require('express')
const ctrl = require('../controllers/dashboard.controller')
const { auth, authorize } = require('../middleware/auth')

const router = Router()

router.get('/guide', auth, authorize('guide'), ctrl.getGuideDashboard)
router.get('/agency', auth, authorize('agency'), ctrl.getAgencyDashboard)
router.get('/admin', auth, authorize('admin'), ctrl.getAdminDashboard)

module.exports = router
