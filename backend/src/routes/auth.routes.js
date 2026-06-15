const { Router } = require('express')
const ctrl = require('../controllers/auth.controller')
const { auth } = require('../middleware/auth')
const { uploadImage } = require('../middleware/upload')

const router = Router()

router.post('/register', ctrl.register)
router.post('/login', ctrl.login)
router.post('/social', ctrl.socialAuth)
router.get('/me', auth, ctrl.me)
router.put('/profile', auth, uploadImage.single('avatar'), ctrl.updateProfile)
router.get('/:id', ctrl.getUser)

module.exports = router
