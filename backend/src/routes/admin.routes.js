const { Router } = require('express')
const ctrl = require('../controllers/admin.controller')
const { auth, authorize } = require('../middleware/auth')

const router = Router()

router.use(auth, authorize('admin'))

router.get('/users', ctrl.listUsers)
router.put('/users/:id/toggle-status', ctrl.toggleUserStatus)
router.put('/guides/:id/approve', ctrl.approveGuide)
router.put('/guides/:id/reject', ctrl.rejectGuide)
router.put('/agencies/:id/approve', ctrl.approveAgency)
router.put('/agencies/:id/reject', ctrl.rejectAgency)
router.get('/stats', ctrl.getStats)

module.exports = router
