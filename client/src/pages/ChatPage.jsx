import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './ChatPage.css'

export default function ChatPage({ user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() => {
    const saved = localStorage.getItem('conversationId')
    return saved || `conv_${user.id}_${Date.now()}`
  })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('conversationId', conversationId)
    
    const loadHistory = async () => {
      try {
        const response = await axios.get(`/api/history/${conversationId}`)
        if (response.data.messages && response.data.messages.length > 0) {
          setMessages(response.data.messages)
        }
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    }
    
    loadHistory()
  }, [conversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        message: userMessage.content,
        conversationId,
        userId: user.id,
        userName: user.name
      })

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    const newConvId = `conv_${user.id}_${Date.now()}`
    localStorage.setItem('conversationId', newConvId)
    window.location.reload()
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="header-left">
          <h1>🤖 Phúc GPT</h1>
          <span className="user-info">Xin chào, {user.name}!</span>
        </div>
        <div className="header-right">
          <button className="new-chat-btn" onClick={handleNewChat}>
            ➕ Cuộc trò chuyện mới
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>👋 Chào mừng bạn đến với Phúc GPT!</h2>
              <p>Tôi là trợ lý AI thông minh, sẵn sàng hỗ trợ bạn.</p>
              <div className="suggestions">
                <button onClick={() => setInput('Bạn có thể giúp gì cho tôi?')}>
                  Bạn có thể giúp gì cho tôi?
                </button>
                <button onClick={() => setInput('Giải thích về AI là gì?')}>
                  Giải thích về AI là gì?
                </button>
                <button onClick={() => setInput('Cho tôi một vài mẹo học lập trình')}>
                  Cho tôi mẹo học lập trình
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                {message.timestamp && (
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </div>
  )
}
