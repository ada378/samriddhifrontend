import { useState, useRef, useEffect } from 'react'
import Button from '../common/Button'
import { useApp } from '../../context/AppContext'

const QUICK_REPLIES = [
  'Where is my order?',
  'I want to return a product',
  'Cancel my order',
  'Payment issue',
  'Contact vendor',
]

const AUTO_REPLIES = {
  'Where is my order?': 'Please provide your order ID and I will check the status for you.',
  'I want to return a product': 'Our return policy allows returns within 48 hours of delivery. Please raise a return request from your orders page.',
  'Cancel my order': 'Orders can be cancelled within 1 hour of placing. Please provide your order ID.',
  'Payment issue': 'Please describe the payment issue. You can also check your payment status in your order history.',
  'Contact vendor': 'You can message vendors directly from your order details page or the Messages section.',
}

export default function LiveChat() {
  const { user } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { id: 'bot1', sender: 'bot', text: 'Hi! How can I help you today?', time: new Date().toISOString() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState('bot')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addBotMessage = (text, delay = 500) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { id: 'bot' + Date.now(), sender: 'bot', text, time: new Date().toISOString() }])
      setIsTyping(false)
    }, delay)
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { id: 'u' + Date.now(), sender: 'user', text: input.trim(), time: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    const text = input.trim()
    setInput('')

    const autoReply = AUTO_REPLIES[text]
    if (autoReply && mode === 'bot') {
      addBotMessage(autoReply)
    } else if (mode === 'bot') {
      addBotMessage('I will connect you with a support agent. Please wait a moment.')
      setTimeout(() => setMode('agent'), 1500)
    }
  }

  const handleQuickReply = (text) => {
    setMessages(prev => [...prev, { id: 'u' + Date.now(), sender: 'user', text, time: new Date().toISOString() }])
    const autoReply = AUTO_REPLIES[text]
    if (autoReply && mode === 'bot') {
      addBotMessage(autoReply)
    }
  }

  const handleFileAttach = () => {
    const { showToast } = useApp()
    showToast('File attachment coming soon', 'info')
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--primary)', color: '#fff', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: 'var(--shadow-xl)',
        transition: 'transform var(--transition-fast)',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      width: isMinimized ? 320 : 360, height: isMinimized ? 48 : 520,
      background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: 'slideUp 0.3s ease',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        background: 'var(--primary)', color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer',
      }} onClick={() => setIsMinimized(!isMinimized)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Live Chat</span>
            <span style={{ fontSize: '0.625rem', opacity: 0.8, display: 'block' }}>
              {mode === 'bot' ? 'Chatbot' : 'Agent'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {!isMinimized && (
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true) }} style={{
              color: '#fff', border: 'none', background: 'rgba(255,255,255,0.2)',
              width: 28, height: 28, borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false) }} style={{
            color: '#fff', border: 'none', background: 'rgba(255,255,255,0.2)',
            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-lg)' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 'var(--space-sm)',
              }}>
                {msg.sender !== 'user' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, marginRight: 8, flexShrink: 0 }}>
                    {mode === 'bot' ? 'AI' : 'AG'}
                  </div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '8px 14px',
                  borderRadius: msg.sender === 'user' ? 'var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 0',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-gray)',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.8125rem', lineHeight: 1.5,
                }}>
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <span style={{ fontSize: '0.5625rem', opacity: 0.6, display: 'block', marginTop: 4 }}>
                    {new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-sm)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700 }}>AI</div>
                <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-gray)', display: 'flex', gap: 3 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.4s infinite' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.4s infinite 0.2s' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.4s infinite 0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {mode === 'bot' && (
            <div style={{ padding: '0 var(--space-lg) var(--space-sm)', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {QUICK_REPLIES.map((qr, i) => (
                <button key={i} onClick={() => handleQuickReply(qr)} style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  border: 'none', fontSize: '0.6875rem', fontWeight: 500, cursor: 'pointer',
                }}>{qr}</button>
              ))}
            </div>
          )}

          {mode === 'bot' && (
            <div style={{ padding: '0 var(--space-lg) var(--space-sm)' }}>
              <button onClick={() => setMode('agent')} style={{
                width: '100%', padding: '6px', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-gray)', color: 'var(--text-secondary)',
                border: 'none', fontSize: '0.75rem', cursor: 'pointer',
              }}>
                Talk to a human agent
              </button>
            </div>
          )}

          <div style={{ padding: 'var(--space-sm) var(--space-lg)', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} placeholder="Type a message..." rows={1} style={{
              flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border)', fontSize: '0.8125rem',
              outline: 'none', resize: 'none', minHeight: 36, maxHeight: 80,
            }} />
            <button onClick={handleSend} disabled={!input.trim()} style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: input.trim() ? 'var(--primary)' : 'var(--border)',
              color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </>
      )}
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
      `}</style>
    </div>
  )
}
