import { useState, useRef, useEffect } from 'react'
import Button from '../common/Button'

const FAQ_FLOWS = {
  order_status: {
    title: 'Order Status',
    icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z',
    steps: [
      { id: 'ask_id', type: 'input', question: 'Please enter your Order ID (e.g., ORD10001)', inputLabel: 'Order ID' },
      { id: 'result', type: 'result', getResponse: (orderId) => `Checking status for order ${orderId}... We found your order. It is currently being processed. For detailed tracking, please visit the Order Tracking page.` },
    ],
  },
  return_policy: {
    title: 'Return Policy',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    response: 'Our return policy allows you to raise a return request within 48 hours of delivery. Items must be unused and in original packaging. Once approved, pickup is scheduled within 2-3 business days. Refunds are processed within 5-7 business days after pickup.',
  },
  delivery_timeline: {
    title: 'Delivery Timeline',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    response: 'Standard delivery takes 3-7 business days depending on your location. Express delivery is available for select pincodes with 1-2 day delivery. You will receive tracking details once your order is shipped.',
  },
  contact_vendor: {
    title: 'Contact Vendor',
    icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
    response: 'You can contact vendors directly through the Messages section in your account. Each order has a "Contact Vendor" option. Vendors typically respond within 24 hours during business days.',
  },
  pricing: {
    title: 'Pricing & MOQ',
    icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
    response: 'Prices are listed per unit as shown on each product page. Minimum Order Quantity (MOQ) varies by vendor and product. Bulk orders may qualify for discounts - use the Quote Negotiation feature to discuss pricing with vendors.',
  },
}

export default function FAQBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 'hello', sender: 'bot', text: 'Hello! I am Samriddhi Assistant. How can I help you today?', time: new Date().toISOString() },
  ])
  const [activeFlow, setActiveFlow] = useState(null)
  const [flowData, setFlowData] = useState({})
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(true)
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

  const handleFlowSelect = (flowKey) => {
    const flow = FAQ_FLOWS[flowKey]
    setShowOptions(false)
    setActiveFlow(flowKey)
    setFlowData({})

    setMessages(prev => [...prev,
      { id: 'u' + Date.now(), sender: 'user', text: flow.title, time: new Date().toISOString() },
    ])

    if (flow.steps) {
      addBotMessage(flow.steps[0].question)
    } else if (flow.response) {
      addBotMessage(flow.response)
      setTimeout(() => {
        setShowOptions(true)
        setActiveFlow(null)
        addBotMessage('Is there anything else I can help you with?')
      }, 2000)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userText = input.trim()
    setMessages(prev => [...prev, { id: 'u' + Date.now(), sender: 'user', text: userText, time: new Date().toISOString() }])
    setInput('')

    if (activeFlow && FAQ_FLOWS[activeFlow].steps) {
      const steps = FAQ_FLOWS[activeFlow].steps
      const currentStepIdx = Object.keys(flowData).length

      if (currentStepIdx < steps.length) {
        const newData = { ...flowData }
        if (steps[currentStepIdx].type === 'input') {
          newData[steps[currentStepIdx].id] = userText
          setFlowData(newData)

          if (currentStepIdx + 1 < steps.length) {
            addBotMessage(steps[currentStepIdx + 1].question)
          } else {
            const resultStep = steps[steps.length - 1]
            if (resultStep.type === 'result' && resultStep.getResponse) {
              addBotMessage(resultStep.getResponse(userText))
            }
            setTimeout(() => {
              setShowOptions(true)
              setActiveFlow(null)
              setFlowData({})
              addBotMessage('Anything else I can help with?')
            }, 3000)
          }
        }
      }
    } else {
      addBotMessage('I can help you with order status, returns, delivery, contacting vendors, and pricing. Please select an option below.')
      setTimeout(() => setShowOptions(true), 1000)
    }
  }

  const handleTalkToAgent = () => {
    setMessages(prev => [...prev, { id: 'u' + Date.now(), sender: 'user', text: 'Talk to Agent', time: new Date().toISOString() }])
    addBotMessage('Connecting you to a support agent. Please wait while we find an available agent.')
    setTimeout(() => {
      addBotMessage('An agent will be with you shortly. Thank you for your patience!')
    }, 2000)
  }

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 20px', borderRadius: 'var(--radius-full)',
        background: 'var(--secondary)', color: '#fff', border: 'none',
        cursor: 'pointer', boxShadow: 'var(--shadow-xl)',
        fontSize: '0.875rem', fontWeight: 600,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0110 10c0 2.5-1 5-2.7 6.7L21 22l-4.3-1.7A10 10 0 0112 22 10 10 0 012 12 10 10 0 0112 2z" />
        </svg>
        Help
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 80, left: 24, zIndex: 9999,
          width: 380, height: 520, background: 'var(--bg-white)',
          borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', animation: 'faqSlideUp 0.3s ease',
        }}>
          <div style={{
            padding: 'var(--space-lg)', background: 'var(--secondary)', color: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>Samriddhi Assistant</h4>
              <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>FAQ Chatbot</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              color: '#fff', border: 'none', background: 'rgba(255,255,255,0.2)',
              width: 28, height: 28, borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-lg)' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 'var(--space-sm)',
              }}>
                {msg.sender !== 'user' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--secondary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.5rem', fontWeight: 700, marginRight: 8, flexShrink: 0,
                  }}>AI</div>
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
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700 }}>AI</div>
                <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-gray)', display: 'flex', gap: 3 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'faqBounce 1.4s infinite' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'faqBounce 1.4s infinite 0.2s' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', animation: 'faqBounce 1.4s infinite 0.4s' }} />
                </div>
              </div>
            )}

            {showOptions && !activeFlow && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Quick topics:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {Object.entries(FAQ_FLOWS).map(([key, flow]) => (
                    <button key={key} onClick={() => handleFlowSelect(key)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                      borderRadius: 'var(--radius-md)', background: 'var(--bg-gray)',
                      border: '1px solid var(--border-light)', cursor: 'pointer',
                      textAlign: 'left', transition: 'all var(--transition-fast)',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={flow.icon} />
                      </svg>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>{flow.title}</span>
                    </button>
                  ))}
                </div>
                <button onClick={handleTalkToAgent} style={{
                  width: '100%', marginTop: 8, padding: '8px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-light)', color: 'var(--primary)', border: 'none',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                }}>
                  Talk to a Human Agent
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: 'var(--space-sm) var(--space-lg)', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} placeholder="Type your question..." rows={1} style={{
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
        </div>
      )}
      <style>{`
        @keyframes faqSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes faqBounce { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
      `}</style>
    </div>
  )
}
