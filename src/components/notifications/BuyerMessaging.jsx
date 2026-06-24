import { useState, useRef, useEffect } from 'react'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { useApp } from '../../context/AppContext'

const MOCK_CONVERSATIONS = [
  { id: 'conv1', vendorName: 'Tata Salt Premium', lastMessage: 'Your order ORD10001 has been shipped', timestamp: new Date(Date.now() - 600000).toISOString(), unread: 2, vendorInitials: 'TS', vendorColor: '#CC0C2C' },
  { id: 'conv2', vendorName: 'Himalayan Pink Exports', lastMessage: 'Yes, we can offer bulk discount', timestamp: new Date(Date.now() - 86400000).toISOString(), unread: 0, vendorInitials: 'HP', vendorColor: '#E8B830' },
  { id: 'conv3', vendorName: 'Gourmet Salt Studio', lastMessage: 'Thank you for your order!', timestamp: new Date(Date.now() - 172800000).toISOString(), unread: 1, vendorInitials: 'GS', vendorColor: '#CC0C2C' },
  { id: 'conv4', vendorName: 'Sendha Shakti Ayurvedic', lastMessage: 'The sendha namak batch is fresh', timestamp: new Date(Date.now() - 259200000).toISOString(), unread: 0, vendorInitials: 'SSA', vendorColor: '#1D9E75' },
]

const MOCK_MESSAGES = {
  conv1: [
    { id: 'm1', sender: 'vendor', text: 'Hi! Your order for Tata Salt Iodized has been confirmed.', time: new Date(Date.now() - 7200000).toISOString(), status: 'read' },
    { id: 'm2', sender: 'buyer', text: 'Great, when will it be dispatched?', time: new Date(Date.now() - 6000000).toISOString(), status: 'read' },
    { id: 'm3', sender: 'vendor', text: 'We are packing your order. It will be dispatched tomorrow morning.', time: new Date(Date.now() - 5400000).toISOString(), status: 'delivered' },
    { id: 'm4', sender: 'vendor', text: 'Your order ORD10001 has been shipped. Tracking ID: TRK9821TATA', time: new Date(Date.now() - 600000).toISOString(), status: 'delivered' },
  ],
}

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function BuyerMessaging() {
  const { user, showToast } = useApp()
  const [conversations] = useState(MOCK_CONVERSATIONS)
  const [activeConv, setActiveConv] = useState(conversations[0]?.id)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showNewConv, setShowNewConv] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeConv])

  const activeMessages = messages[activeConv] || []
  const activeConvData = conversations.find(c => c.id === activeConv)

  const handleSend = () => {
    if (!input.trim() || !user) return
    const newMsg = {
      id: 'm' + Date.now(),
      sender: 'buyer',
      text: input.trim(),
      time: new Date().toISOString(),
      status: 'sent',
    }
    setMessages({ ...messages, [activeConv]: [...(messages[activeConv] || []), newMsg] })
    setInput('')

    setIsTyping(true)
    setTimeout(() => {
      const reply = {
        id: 'm' + (Date.now() + 1),
        sender: 'vendor',
        text: 'Thank you for your message. We will get back to you shortly.',
        time: new Date().toISOString(),
        status: 'delivered',
      }
      setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), reply] }))
      setIsTyping(false)
    }, 2000)
  }

  const handleFileAttach = () => {
    showToast('File attachment feature coming soon', 'info')
  }

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💬</div>
        <div className="empty-state-title">Login to Message Vendors</div>
        <div className="empty-state-text">Sign in to chat with vendors about products and orders.</div>
        <Button variant="primary">Log In</Button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', height: 'calc(100vh - 200px)', minHeight: 500,
      background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border)', overflow: 'hidden',
    }}>
      <div style={{
        width: 320, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{
          padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Messages</h4>
          <button onClick={() => setShowNewConv(true)} style={{
            width: 32, height: 32, borderRadius: 'var(--radius-full)',
            background: 'var(--primary)', color: '#fff', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '1.125rem', fontWeight: 700,
          }}>+</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map(c => (
            <div key={c.id} onClick={() => setActiveConv(c.id)} style={{
              display: 'flex', gap: 12, padding: 'var(--space-md) var(--space-lg)',
              cursor: 'pointer', borderBottom: '1px solid var(--border-light)',
              background: activeConv === c.id ? 'var(--primary-light)' : 'transparent',
              transition: 'background var(--transition-fast)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: c.vendorColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0,
              }}>{c.vendorInitials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.vendorName}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {formatTime(c.timestamp)}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.lastMessage}
                </p>
              </div>
              {c.unread > 0 && (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.625rem', fontWeight: 700, flexShrink: 0, marginTop: 4,
                }}>{c.unread}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeConvData ? (
          <>
            <div style={{
              padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: activeConvData.vendorColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.75rem',
              }}>{activeConvData.vendorInitials}</div>
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{activeConvData.vendorName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', marginLeft: 8 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', marginRight: 4 }} />
                  Online
                </span>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-lg)' }}>
              {activeMessages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex', justifyContent: msg.sender === 'buyer' ? 'flex-end' : 'flex-start',
                  marginBottom: 'var(--space-md)',
                }}>
                  <div style={{
                    maxWidth: '70%', padding: 'var(--space-md) var(--space-lg)',
                    borderRadius: msg.sender === 'buyer' ? 'var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 0',
                    background: msg.sender === 'buyer' ? 'var(--primary)' : 'var(--bg-gray)',
                    color: msg.sender === 'buyer' ? '#fff' : 'var(--text-primary)',
                    fontSize: '0.875rem', lineHeight: 1.5,
                  }}>
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    <div style={{
                      display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4,
                      marginTop: 4, fontSize: '0.625rem',
                      color: msg.sender === 'buyer' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                    }}>
                      <span>{formatTime(msg.time)}</span>
                      {msg.sender === 'buyer' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={msg.status === 'read' ? 'var(--info)' : 'currentColor'} stroke="none">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: activeConvData.vendorColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700 }}>{activeConvData.vendorInitials}</div>
                  <div style={{ padding: '8px 14px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-gray)', display: 'flex', gap: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite 0.2s' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'typingBounce 1.4s infinite 0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{
              padding: 'var(--space-md) var(--space-lg)', borderTop: '1px solid var(--border)',
              display: 'flex', gap: 8, alignItems: 'flex-end',
            }}>
              <button onClick={handleFileAttach} style={{
                width: 36, height: 36, borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: 'var(--bg-gray)', cursor: 'pointer',
                color: 'var(--text-secondary)', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} placeholder="Type a message..." rows={1} style={{
                flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--border)', fontSize: '0.875rem',
                outline: 'none', resize: 'none', background: 'var(--bg-white)',
                minHeight: 40, maxHeight: 120,
              }} />
              <button onClick={handleSend} disabled={!input.trim()} style={{
                width: 40, height: 40, borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', background: input.trim() ? 'var(--primary)' : 'var(--border)',
                color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0, transition: 'background var(--transition-fast)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ flex: 1 }}>
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-title">Select a conversation</div>
            <div className="empty-state-text">Choose a conversation from the left to start messaging.</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes typingBounce { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
      `}</style>
    </div>
  )
}
