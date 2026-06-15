const { Guide, Agency, Circuit, Activity, User } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const { Op } = require('sequelize')

exports.searchAll = async (req, res, next) => {
  try {
    const { q, type, region, page = 1, limit = 20 } = req.query
    if (!q) return ApiResponse.badRequest(res, 'Terme de recherche requis')

    const results = {}
    const searchWhere = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${q}%` } },
        { '$user.name$': { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { title: { [Op.iLike]: `%${q}%` } },
      ],
    }

    if (!type || type === 'guides') {
      const guides = await Guide.findAll({
        where: { ...searchWhere, status: 'certified' },
        include: [{ association: 'user', attributes: ['id', 'name', 'avatar'] }],
        limit: parseInt(limit),
      })
      results.guides = guides
    }

    if (!type || type === 'agencies') {
      const agencies = await Agency.findAll({
        where: { ...searchWhere, status: 'verified' },
        include: [{ association: 'user', attributes: ['id', 'name', 'avatar'] }],
        limit: parseInt(limit),
      })
      results.agencies = agencies
    }

    if (!type || type === 'circuits') {
      results.circuits = await Circuit.findAll({
        where: { ...searchWhere, isActive: true },
        limit: parseInt(limit),
      })
    }

    if (!type || type === 'activities') {
      results.activities = await Activity.findAll({
        where: { ...searchWhere, isActive: true },
        limit: parseInt(limit),
      })
    }

    ApiResponse.success(res, results)
  } catch (error) {
    next(error)
  }
}

exports.searchByFilters = async (req, res, next) => {
  try {
    const { type, region, minPrice, maxPrice, language, minRating, availability, certification } = req.query
    const results = {}

    if (!type || type === 'guides') {
      const where = {}
      if (region) where.zones = { [Op.contains]: [region] }
      if (language) where.languages = { [Op.contains]: [language] }
      if (minRating) where.rating = { [Op.gte]: parseFloat(minRating) }
      if (certification) where.status = 'certified'

      results.guides = await Guide.findAll({
        where,
        include: [{ association: 'user', attributes: ['id', 'name', 'avatar'] }],
        order: [['rating', 'DESC']],
      })
    }

    if (!type || type === 'agencies') {
      const where = {}
      if (region) where.regions = { [Op.contains]: [region] }
      if (minRating) where.rating = { [Op.gte]: parseFloat(minRating) }

      results.agencies = await Agency.findAll({
        where,
        include: [{ association: 'user', attributes: ['id', 'name', 'avatar'] }],
        order: [['rating', 'DESC']],
      })
    }

    ApiResponse.success(res, results)
  } catch (error) {
    next(error)
  }
}
