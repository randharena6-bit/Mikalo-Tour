const { Router } = require('express')
const ctrl = require('../controllers/marketplace.controller')
const { auth } = require('../middleware/auth')

const router = Router()

router.post('/circuits', auth, ctrl.createCircuit)
router.get('/circuits', ctrl.listCircuits)
router.get('/circuits/:id', ctrl.getCircuit)
router.post('/activities', auth, ctrl.createActivity)
router.get('/activities', ctrl.listActivities)
router.get('/activities/:id', ctrl.getActivity)

module.exports = router
