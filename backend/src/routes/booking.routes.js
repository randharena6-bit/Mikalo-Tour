const { Router } = require('express')
const ctrl = require('../controllers/booking.controller')
const { auth, authorize } = require('../middleware/auth')

const router = Router()

router.post('/', auth, ctrl.createBooking)
router.get('/my', auth, ctrl.getMyBookings)
router.get('/guide', auth, authorize('guide'), ctrl.getGuideBookings)
router.get('/agency', auth, authorize('agency'), ctrl.getAgencyBookings)
router.put('/:id/status', auth, ctrl.updateBookingStatus)
router.put('/:id/cancel', auth, ctrl.cancelBooking)
router.get('/:id', auth, ctrl.getBooking)

module.exports = router
