const { Router } = require('express')
const ctrl = require('../controllers/post.controller')
const { auth } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

const router = Router()

router.post('/', auth, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 3 },
]), ctrl.createPost)
router.get('/feed', ctrl.getFeed)
router.get('/user/:userId', ctrl.getUserPosts)
router.put('/:id/like', auth, ctrl.likePost)
router.delete('/:id', auth, ctrl.deletePost)

module.exports = router
