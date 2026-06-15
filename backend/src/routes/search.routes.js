const { Router } = require('express')
const ctrl = require('../controllers/search.controller')

const router = Router()

router.get('/', ctrl.searchAll)
router.get('/filters', ctrl.searchByFilters)

module.exports = router
