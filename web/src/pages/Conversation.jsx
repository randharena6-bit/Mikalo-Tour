import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { messageService } from '../services/message.service'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Conversation() {
  const { id } = useParams()
  const { user } = useAuth()
  const socket = useSocket()
  const [messages, setMessages] = useState([])
  const [conversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    Promise.all([
      messageService.getConversationMessages(id),
      messageService.markAsRead(id),
    ])
      .then(([msgRes]) => {
        setMessages(msgRes.data.data?.messages || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!socket) return

    socket.emit('join_conversation', id)

    socket.on('new_message', (data) => {
      if (data.conversationId === id) {
        setMessages((prev) => [...prev, data.message])
      }
    })

    socket.on('user_typing', (data) => {
      if (data.userId !== user?.id) setTyping(data.isTyping)
    })

    return () => {
      socket.emit('leave_conversation', id)
      socket.off('new_message')
      socket.off('user_typing')
    }
  }, [socket, id, user?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    try {
      await messageService.sendMessage(id, { content: content.trim() })
      setContent('')
    } catch (err) {
      console.error('Erreur envoi:', err)
    } finally {
      setSending(false)
    }
  }

  const handleTyping = (value) => {
    setContent(value)
    if (socket) {
      socket.emit('typing', { conversationId: id, isTyping: value.length > 0 })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4">
        <Link to="/messages" className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
            {(conversation?.participants?.find(p => p.id !== user?.id)?.name?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {conversation?.participants?.find(p => p.id !== user?.id)?.name || 'Conversation'}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-h-[calc(100vh-200px)]">
        {loading ? (
          <LoadingSpinner text="Chargement des messages..." />
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>Aucun message. Envoyez le premier message !</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] md:max-w-[60%] px-4 py-2.5 rounded-2xl ${
                msg.senderId === user?.id ? 'bg-primary-500 text-white rounded-br-md' : 'bg-white border border-gray-200 rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-primary-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        {typing && (
          <div className="flex items-center gap-2 text-sm text-gray-500 italic">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            Quelqu'un écrit...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="hidden md:inline">Envoyer</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
