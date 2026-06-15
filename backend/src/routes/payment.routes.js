const { Router } = require('express')
const ctrl = require('../controllers/payment.controller')
const { auth } = require('../middleware/auth')

const router = Router()

router.post('/', auth, ctrl.createPayment)
router.get('/:id', auth, ctrl.getPaymentStatus)
router.post('/:id/refund', auth, ctrl.refundPayment)

module.exports = router
