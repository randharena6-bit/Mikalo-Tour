const { Router } = require('express')
const ctrl = require('../controllers/message.controller')
const { auth } = require('../middleware/auth')
const { upload } = require('../middleware/upload')

const router = Router()

router.post('/conversations', auth, ctrl.createConversation)
router.get('/conversations', auth, ctrl.getMyConversations)
router.get('/conversations/:id', auth, ctrl.getConversationMessages)
router.post('/conversations/:id/messages', auth, upload.single('file'), ctrl.sendMessage)
router.put('/conversations/:id/read', auth, ctrl.markAsRead)

module.exports = router
