import { useState, useRef, useEffect } from 'react'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { useApp } from '../../context/AppContext'

const MOCK_QUOTE = {
  id: 'QTE001',
  productName: 'Himalayan Pink Salt Fine - 1kg',
  quantity: 500,
  initialPrice: 45,
  status: 'negotiating',
  initiatedBy: 'buyer',
  date: new Date(Date.now() - 86400000 * 2).toISOString(),
}

const MOCK_MESSAGES = [
  { id: 'n1', sender: 'buyer', type: 'message', text: 'Hi, I am interested in bulk purchase of Himalayan Pink Salt Fine.', time: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'n2', sender: 'buyer', type: 'proposal', price: 38, moq: 500, delivery: '7 days', text: 'I need 500 kg at Rs. 38 per kg. Can you do this?', time: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString() },
  { id: 'n3', sender: 'vendor', type: 'message', text: 'Thank you for your interest. Let me check our current pricing for bulk orders.', time: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n4', sender: 'vendor', type: 'counter', price: 42, moq: 500, delivery: '5 days', text: 'We can offer Rs. 42 per kg for 500 kg order. Delivery within 5 working days.', time: new Date(Date.now() - 43200000).toISOString() },
  { id: 'n5', sender: 'buyer', type: 'message', text: 'Can you match Rs. 40? That is my budget.', time: new Date(Date.now() - 21600000).toISOString() },
]

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function QuoteNegotiation({ quoteId }) {
  const { user, showToast } = useApp()
  const [quote] = useState(MOCK_QUOTE)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const [showProposal, setShowProposal] = useState(false)
  const [proposal, setProposal] = useState({ price: '', moq: '', delivery: '' })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg = { id: 'n' + Date.now(), sender: 'buyer', type: 'message', text: input.trim(), time: new Date().toISOString() }
    setMessages([...messages, newMsg])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { id: 'n' + (Date.now() + 1), sender: 'vendor', type: 'message', text: 'We have received your message and will respond shortly.', time: new Date().toISOString() }])
    }, 1500)
  }

  const handleSubmitProposal = () => {
    const { price, moq, delivery } = proposal
    if (!price || !moq || !delivery) return
    const newProposal = {
      id: 'n' + Date.now(), sender: 'buyer', type: 'proposal',
      price: Number(price), moq: Number(moq), delivery,
      text: 'New proposal submitted.',
      time: new Date().toISOString(),
    }
    setMessages([...messages, newProposal])
    setShowProposal(false)
    setProposal({ price: '', moq: '', delivery: '' })
    showToast('Proposal sent to vendor', 'success')
  }

  const handleAccept = (msgId) => {
    showToast('Proposal accepted! Converting to order...', 'success')
    setTimeout(() => {
      showToast('Order placed successfully!', 'success')
    }, 1500)
  }

  const handleDecline = (msgId) => {
    showToast('Proposal declined', 'info')
  }

  const handleCounter = (msgId) => {
    setShowProposal(true)
    const existingMsg = messages.find(m => m.id === msgId)
    if (existingMsg) {
      setProposal({ price: existingMsg.price || '', moq: existingMsg.moq || '', delivery: existingMsg.delivery || '' })
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-xl)' }}>
      <div style={{
        background: 'var(--bg-white)', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 550,
      }}>
        <div style={{
          padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-gray)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>Quote {quote.id}</h4>
                <Badge variant={quote.status === 'accepted' ? 'success' : quote.status === 'declined' ? 'danger' : 'warning'}>
                  {quote.status === 'negotiating' ? 'Negotiating' : quote.status}
                </Badge>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Product: {quote.productName} | Qty: {quote.quantity} units
              </p>
              {quote.status !== 'accepted' && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Initial price: Rs. {quote.initialPrice}/kg
                </p>
              )}
            </div>
            <Button variant="secondary" size="sm" icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            } onClick={() => setShowProposal(true)}>
              New Proposal
            </Button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-xl)' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{
                display: 'flex', justifyContent: msg.sender === 'buyer' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '75%', padding: msg.type === 'proposal' || msg.type === 'counter' ? 'var(--space-lg)' : 'var(--space-md) var(--space-lg)',
                  borderRadius: msg.sender === 'buyer' ? 'var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 0',
                  background: msg.sender === 'buyer' ? 'var(--primary)' : 'var(--bg-gray)',
                  color: msg.sender === 'buyer' ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.875rem', lineHeight: 1.5,
                }}>
                  {msg.type === 'message' && <p style={{ margin: 0 }}>{msg.text}</p>}

                  {(msg.type === 'proposal' || msg.type === 'counter') && (
                    <div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                        color: msg.type === 'counter' ? 'var(--accent)' : 'var(--info)',
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                          {msg.type === 'counter' ? 'Counter Offer' : 'Proposal'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                        <div style={{ background: 'rgba(0,0,0,0.05)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', opacity: 0.7 }}>Price</div>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Rs. {msg.price}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.05)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', opacity: 0.7 }}>MOQ</div>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{msg.moq}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.05)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.625rem', textTransform: 'uppercase', opacity: 0.7 }}>Delivery</div>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{msg.delivery}</div>
                        </div>
                      </div>
                      {msg.text && <p style={{ margin: '0 0 8px', fontSize: '0.8125rem' }}>{msg.text}</p>}

                      {msg.sender !== 'buyer' && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <button onClick={() => handleAccept(msg.id)} style={{
                            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--success)', color: '#fff', border: 'none',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                          }}>Accept</button>
                          <button onClick={() => handleCounter(msg.id)} style={{
                            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--accent)', color: 'var(--text-primary)', border: 'none',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                          }}>Counter</button>
                          <button onClick={() => handleDecline(msg.id)} style={{
                            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-gray)', color: 'var(--text-secondary)', border: 'none',
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                          }}>Decline</button>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4,
                    marginTop: 4, fontSize: '0.625rem',
                    color: msg.sender === 'buyer' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                  }}>
                    <span>{formatTime(msg.time)}</span>
                    {msg.sender === 'buyer' && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {msg.sender === 'vendor' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, marginLeft: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--info)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700 }}>
                    HP
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Himalayan Pink Exports</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: 'var(--space-md) var(--space-xl)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} placeholder="Type a message or proposal..." rows={1} style={{
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
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {showProposal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowProposal(false); setProposal({ price: '', moq: '', delivery: '' }) } }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Proposal</h3>
              <button className="modal-close" onClick={() => { setShowProposal(false); setProposal({ price: '', moq: '', delivery: '' }) }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Price (per kg)</label>
                <input type="number" value={proposal.price} onChange={e => setProposal({ ...proposal, price: e.target.value })} placeholder="Enter price" style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border)', fontSize: '0.875rem', outline: 'none',
                }} />
              </div>
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Minimum Order Quantity</label>
                <input type="number" value={proposal.moq} onChange={e => setProposal({ ...proposal, moq: e.target.value })} placeholder="Enter MOQ" style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border)', fontSize: '0.875rem', outline: 'none',
                }} />
              </div>
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Delivery Timeline</label>
                <input value={proposal.delivery} onChange={e => setProposal({ ...proposal, delivery: e.target.value })} placeholder="e.g. 5-7 days" style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border)', fontSize: '0.875rem', outline: 'none',
                }} />
              </div>
              <Button variant="primary" block onClick={handleSubmitProposal} disabled={!proposal.price || !proposal.moq || !proposal.delivery}>
                Submit Proposal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
