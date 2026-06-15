const { Router } = require('express')
const ctrl = require('../controllers/guide.controller')
const { auth, authorize } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

const router = Router()

router.post('/profile', auth, authorize('guide'), ctrl.createGuideProfile)
router.get('/profile/me', auth, authorize('guide'), ctrl.getMyGuideProfile)
router.put('/profile', auth, authorize('guide'), ctrl.updateGuideProfile)
router.post('/certifications', auth, authorize('guide'), upload.fields([
  { name: 'certification', maxCount: 1 },
  { name: 'identity', maxCount: 1 },
]), ctrl.uploadCertification)
router.get('/qr-code', auth, authorize('guide'), ctrl.getGuideQRCode)
router.get('/', ctrl.listGuides)
router.get('/:id', ctrl.getGuide)

module.exports = router
