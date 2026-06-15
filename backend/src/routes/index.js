const { Router } = require('express')

const router = Router()

router.use('/auth', require('./auth.routes'))
router.use('/guides', require('./guide.routes'))
router.use('/agencies', require('./agency.routes'))
router.use('/bookings', require('./booking.routes'))
router.use('/reviews', require('./review.routes'))
router.use('/messages', require('./message.routes'))
router.use('/posts', require('./post.routes'))
router.use('/marketplace', require('./marketplace.routes'))
router.use('/payments', require('./payment.routes'))
router.use('/search', require('./search.routes'))
router.use('/ai', require('./ai.routes'))
router.use('/dashboard', require('./dashboard.routes'))
router.use('/admin', require('./admin.routes'))

module.exports = router
