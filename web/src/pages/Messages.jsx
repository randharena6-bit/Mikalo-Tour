import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { messageService } from '../services/message.service'
import { useSocket } from '../contexts/SocketContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Footer from '../components/common/Footer'

export default function Messages() {
  const socket = useSocket()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    messageService.getConversations()
      .then((res) => setConversations(res.data.data?.conversations || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!socket) return
    const handler = (data) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === data.conversationId)
        if (!exists) {
          messageService.getConversations().then((res) => setConversations(res.data.data?.conversations || []))
          return prev
        }
        return prev.map((c) =>
          c.id === data.conversationId
            ? { ...c, lastMessagePreview: data.message?.content?.substring(0, 100), lastMessageAt: new Date() }
            : c
        )
      })
    }
    socket.on('notification', handler)
    return () => socket.off('notification', handler)
  }, [socket])

  useEffect(() => {
    const userId = searchParams.get('userId')
    if (!userId) return
    messageService.createConversation({ participantIds: [parseInt(userId)] })
      .then((res) => { window.location.href = `/messages/${res.data.data.conversation.id}` })
      .catch((err) => console.error(err))
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-primary-200 mt-1">{conversations.length} conversation(s)</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg mb-2">Aucune conversation</p>
              <p className="text-sm">Explorez les guides et agences pour commencer à discuter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  to={`/messages/${conv.id}`}
                  className="flex items-center gap-4 p-4 md:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                      {(conv.participants?.[0]?.name?.[0] || '?').toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${conv.lastMessageAt ? 'bg-green-400' : 'bg-gray-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.participants?.map((p) => p.name).join(', ') || 'Conversation'}
                      </h3>
                      {conv.lastMessageAt && (
                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                          {new Date(conv.lastMessageAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{conv.lastMessagePreview || 'Démarrer une conversation'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
