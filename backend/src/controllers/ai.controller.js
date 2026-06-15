const AIService = require('../services/ai.service')
const TranslationService = require('../services/translation.service')
const ApiResponse = require('../utils/apiResponse')

exports.planTrip = async (req, res, next) => {
  try {
    const { description } = req.body
    if (!description) return ApiResponse.badRequest(res, 'Description du voyage requise')

    const plan = await AIService.planTrip(description)
    ApiResponse.success(res, { plan }, 'Itinéraire généré')
  } catch (error) {
    next(error)
  }
}

exports.translate = async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body
    if (!text || !targetLanguage) return ApiResponse.badRequest(res, 'Texte et langue cible requis')

    const result = await TranslationService.translate(text, targetLanguage)
    ApiResponse.success(res, { translation: result })
  } catch (error) {
    next(error)
  }
}

exports.detectLanguage = async (req, res, next) => {
  try {
    const { text } = req.body
    if (!text) return ApiResponse.badRequest(res, 'Texte requis')

    const language = await TranslationService.detectLanguage(text)
    ApiResponse.success(res, { language })
  } catch (error) {
    next(error)
  }
}

exports.analyzeTrends = async (req, res, next) => {
  try {
    const { Booking } = require('../models')
    const bookings = await Booking.findAll({ limit: 100, order: [['createdAt', 'DESC']] })
    const trends = await AIService.analyzeTrends(bookings)
    ApiResponse.success(res, { trends })
  } catch (error) {
    next(error)
  }
}

exports.suggestPrice = async (req, res, next) => {
  try {
    const { experience, specialties, rating, region } = req.body
    const suggestion = await AIService.suggestPrice({ experience, specialties, rating, region })
    ApiResponse.success(res, { suggestion })
  } catch (error) {
    next(error)
  }
}
