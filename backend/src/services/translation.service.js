const OpenAI = require('openai')

class TranslationService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.supportedLanguages = [
      'malagasy', 'french', 'english', 'spanish',
      'italian', 'german', 'chinese', 'portuguese',
      'russian', 'arabic', 'japanese', 'korean',
    ]
  }

  async translate(text, targetLang) {
    if (!text || !targetLang) return null
    if (!this.supportedLanguages.includes(targetLang)) return null

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `Traduis le texte suivant en ${targetLang}. Retourne UNIQUEMENT le texte traduit, sans explications.` },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })

      return {
        original: text,
        translated: response.choices[0].message.content.trim(),
        targetLanguage: targetLang,
      }
    } catch (error) {
      console.error('Translation error:', error.message)
      return { original: text, translated: text, targetLanguage: targetLang, error: error.message }
    }
  }

  async detectLanguage(text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Détecte la langue du texte suivant. Retourne UNIQUEMENT le nom de la langue en anglais, en minuscules.' },
          { role: 'user', content: text },
        ],
        temperature: 0.1,
        max_tokens: 50,
      })
      return response.choices[0].message.content.trim().toLowerCase()
    } catch {
      return 'unknown'
    }
  }
}

module.exports = new TranslationService()
