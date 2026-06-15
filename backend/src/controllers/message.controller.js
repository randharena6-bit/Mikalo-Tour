const { Conversation, Message } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const { Op } = require('sequelize')

exports.createConversation = async (req, res, next) => {
  try {
    const { participantIds, title } = req.body
    const allParticipants = [...new Set([req.user.id, ...participantIds])]

    if (allParticipants.length === 2) {
      const existing = await Conversation.findOne({
        where: {
          type: 'direct',
          [Op.and]: [
            { participantIds: { [Op.contains]: [allParticipants[0]] } },
            { participantIds: { [Op.contains]: [allParticipants[1]] } },
          ],
        },
      })
      if (existing) return ApiResponse.success(res, { conversation: existing })
    }

    const conversation = await Conversation.create({
      type: allParticipants.length > 2 ? 'group' : 'direct',
      participantIds: allParticipants,
      title: title || 'Discussion',
    })

    ApiResponse.created(res, { conversation })
  } catch (error) {
    next(error)
  }
}

exports.getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      where: { participantIds: { [Op.contains]: [req.user.id] } },
      order: [['lastMessageAt', 'DESC']],
    })
    ApiResponse.success(res, { conversations })
  } catch (error) {
    next(error)
  }
}

exports.getConversationMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id)
    if (!conversation) return ApiResponse.notFound(res, 'Conversation non trouvée')
    if (!conversation.participantIds.includes(req.user.id)) return ApiResponse.forbidden(res)

    const { page = 1, limit = 50 } = req.query
    const { count, rows } = await Message.findAndCountAll({
      where: { conversationId: conversation.id },
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    })

    ApiResponse.paginated(res, { messages: rows.reverse() }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.sendMessage = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id)
    if (!conversation) return ApiResponse.notFound(res, 'Conversation non trouvée')
    if (!conversation.participantIds.includes(req.user.id)) return ApiResponse.forbidden(res)

    const messageData = {
      conversationId: conversation.id,
      senderId: req.user.id,
      content: req.body.content || '',
      type: req.body.type || 'text',
      replyToId: req.body.replyToId,
    }

    if (req.file) {
      messageData.type = req.file.mimetype.startsWith('image/') ? 'image' : 'document'
      messageData.fileUrl = req.file.path
    }

    if (req.body.type === 'location') {
      messageData.fileMetadata = req.body.coordinates
    }

    const message = await Message.create(messageData)

    await conversation.update({
      lastMessageAt: new Date(),
      lastMessagePreview: message.content?.substring(0, 100) || '[Fichier]',
    })

    const io = require('../socket').getIO()
    conversation.participantIds.forEach(pid => {
      if (pid !== req.user.id) {
        io.to(`user:${pid}`).emit('new_message', {
          conversationId: conversation.id,
          message,
          senderId: req.user.id,
        })
      }
    })

    ApiResponse.created(res, { message }, 'Message envoyé')
  } catch (error) {
    next(error)
  }
}

exports.markAsRead = async (req, res, next) => {
  try {
    await Message.update(
      { readBy: require('sequelize').fn('array_append', require('sequelize').col('read_by'), req.user.id) },
      { where: { conversationId: req.params.id, senderId: { [Op.ne]: req.user.id } } }
    )
    ApiResponse.success(res, null, 'Messages marqués comme lus')
  } catch (error) {
    next(error)
  }
}
