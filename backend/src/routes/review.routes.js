const { Router } = require('express')
const ctrl = require('../controllers/review.controller')
const { auth } = require('../middleware/auth')

const router = Router()

router.post('/', auth, ctrl.createReview)
router.get('/', ctrl.getReviews)
router.put('/:id/respond', auth, ctrl.respondToReview)
router.put('/:id/helpful', auth, ctrl.markHelpful)

module.exports = router
