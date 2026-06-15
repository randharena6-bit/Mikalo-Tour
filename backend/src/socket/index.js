const { Server } = require('socket.io')
let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  const jwt = require('jsonwebtoken')
  const { User } = require('../models')

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) return next(new Error('Token manquant'))

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findByPk(decoded.id)
      if (!user) return next(new Error('Utilisateur non trouvé'))

      socket.user = user
      next()
    } catch (error) {
      next(new Error('Token invalide'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`[Socket] ${socket.user.name} connecté (${socket.id})`)

    socket.join(`user:${socket.user.id}`)

    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`)
    })

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`)
    })

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.user.id,
        name: socket.user.name,
        isTyping,
      })
    })

    socket.on('send_message', async (data) => {
      const { Conversation, Message } = require('../models')
      const conversation = await Conversation.findByPk(data.conversationId)
      if (!conversation) return

      const message = await Message.create({
        conversationId: conversation.id,
        senderId: socket.user.id,
        content: data.content,
        type: data.type || 'text',
      })

      await conversation.update({
        lastMessageAt: new Date(),
        lastMessagePreview: message.content?.substring(0, 100) || '[Fichier]',
      })

      io.to(`conversation:${conversation.id}`).emit('new_message', {
        conversationId: conversation.id,
        message,
        senderId: socket.user.id,
        senderName: socket.user.name,
      })

      conversation.participantIds.forEach(pid => {
        if (pid !== socket.user.id) {
          io.to(`user:${pid}`).emit('notification', {
            type: 'new_message',
            title: `Message de ${socket.user.name}`,
            body: data.content?.substring(0, 100) || '[Fichier]',
            data: { conversationId: conversation.id },
          })
        }
      })
    })

    socket.on('disconnect', () => {
      console.log(`[Socket] ${socket.user.name} déconnecté`)
    })
  })

  return io
}

function getIO() {
  if (!io) throw new Error('Socket.io non initialisé')
  return io
}

module.exports = { initSocket, getIO }
