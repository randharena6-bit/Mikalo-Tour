const { Circuit, Activity } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const { Op } = require('sequelize')

exports.createCircuit = async (req, res, next) => {
  try {
    const circuit = await Circuit.create({
      ...req.body,
      authorId: req.user.id,
      authorType: req.user.role,
    })
    ApiResponse.created(res, { circuit }, 'Circuit créé')
  } catch (error) {
    next(error)
  }
}

exports.listCircuits = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, region, minPrice, maxPrice, difficulty, tags } = req.query
    const where = { isActive: true }
    if (region) where.region = region
    if (difficulty) where.difficulty = difficulty
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) }

    const { count, rows } = await Circuit.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['rating', 'DESC']],
    })

    ApiResponse.paginated(res, { circuits: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.getCircuit = async (req, res, next) => {
  try {
    const circuit = await Circuit.findByPk(req.params.id)
    if (!circuit) return ApiResponse.notFound(res, 'Circuit non trouvé')
    ApiResponse.success(res, { circuit })
  } catch (error) {
    next(error)
  }
}

exports.createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create({
      ...req.body,
      authorId: req.user.id,
      authorType: req.user.role,
    })
    ApiResponse.created(res, { activity }, 'Activité créée')
  } catch (error) {
    next(error)
  }
}

exports.listActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, region, minPrice, maxPrice } = req.query
    const where = { isActive: true }
    if (category) where.category = category
    if (region) where.region = region
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) }

    const { count, rows } = await Activity.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['rating', 'DESC']],
    })

    ApiResponse.paginated(res, { activities: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.id)
    if (!activity) return ApiResponse.notFound(res, 'Activité non trouvée')
    ApiResponse.success(res, { activity })
  } catch (error) {
    next(error)
  }
}
