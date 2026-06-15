const OpenAI = require('openai')
const { GoogleGenerativeAI } = require('@google/generative-ai')

class AIService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }

  async planTrip(description) {
    const prompt = `En tant qu'expert en tourisme à Madagascar, génère un itinéraire de voyage détaillé basé sur cette description : "${description}"

    Retourne UNIQUEMENT un JSON valide avec cette structure :
    {
      "itinerary": [{ "day": 1, "title": "...", "description": "...", "activities": [...], "region": "...", "accommodation": "...", "meals": "..." }],
      "budget": { "total": number, "currency": "EUR", "breakdown": { "transport": number, "accommodation": number, "activities": number, "food": number, "other": number } },
      "recommendations": { "guides": ["..."], "agencies": ["..."], "hotels": ["..."], "transport": ["..."] },
      "tips": ["..."]
    }`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      })

      return JSON.parse(response.choices[0].message.content)
    } catch (error) {
      console.error('OpenAI error:', error.message)
      return this.fallbackPlanTrip(description)
    }
  }

  async fallbackPlanTrip(description) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Génère un itinéraire de voyage à Madagascar pour: ${description}. Retourne du JSON valide avec itinerary, budget, recommendations, tips.`

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().replace(/```json|```/g, '').trim()
      return JSON.parse(text)
    } catch {
      return this.defaultItinerary()
    }
  }

  defaultItinerary() {
    return {
      itinerary: [
        { day: 1, title: 'Arrivée à Antananarivo', description: 'Découverte de la capitale', activities: ['Visite de la ville haute', 'Marché d\'Artisanat'], region: 'Antananarivo', accommodation: 'Hôtel en centre-ville', meals: 'Demi-pension' },
        { day: 2, title: 'Route vers Nosy Be', description: 'Vol vers Nosy Be', activities: ['Plage', 'Détente'], region: 'Nosy Be', accommodation: 'Hôtel plage', meals: 'Pension complète' },
        { day: 3, title: 'Exploration', description: 'Journée libre', activities: ['Snorkeling', 'Visite des plantations'], region: 'Nosy Be', accommodation: 'Hôtel plage', meals: 'Pension complète' },
      ],
      budget: { total: 1500, currency: 'EUR', breakdown: { transport: 500, accommodation: 600, activities: 200, food: 150, other: 50 } },
      recommendations: { guides: ['Guide francophone disponible'], agencies: ['Agence locale partenaire'], hotels: ['Hôtels recommandés'], transport: ['Vol intérieur + taxi'] },
      tips: ['Prévoyez de la crème solaire', 'Changez de l\'argent à l\'arrivée'],
    }
  }

  async analyzeTrends(bookings) {
    const prompt = `Analyse ces données de réservations et retourne des tendances: ${JSON.stringify(bookings)}`
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.3,
      })
      return response.choices[0].message.content
    } catch {
      return { trends: [], recommendations: [] }
    }
  }

  async suggestPrice(guideData) {
    const prompt = `Suggère un prix pour ce guide: ${JSON.stringify(guideData)}`
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.3,
      })
      return response.choices[0].message.content
    } catch {
      return { suggestedPrice: 0, reasoning: 'Indisponible' }
    }
  }
}

module.exports = new AIService()
