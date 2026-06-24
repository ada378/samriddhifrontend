import { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          border: 'none',
          background: isOpen ? 'var(--primary-light)' : 'var(--bg-white)',
          cursor: 'pointer',
          textAlign: 'left',
          fontWeight: 600,
          fontSize: '0.875rem',
          color: 'var(--text-primary)',
          transition: 'background 0.2s',
        }}
      >
        <span>{question}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        style={{
          maxHeight: isOpen ? 300 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.25s ease, padding 0.25s ease',
          padding: isOpen ? '12px 16px 16px' : '0 16px',
        }}
      >
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{answer}</p>
      </div>
    </div>
  )
}

export default function ProductFAQ({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [questionText, setQuestionText] = useState('')

  return (
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: 12 }}>Frequently Asked Questions</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.length > 0 ? faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        )) : (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '12px 0' }}>No FAQs available for this product.</p>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={() => setShowModal(true)} style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 600 }}>
        + Ask a Question
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ask a Question">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Have a question about this product? Ask the vendor directly.</p>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question..."
            rows={4}
            style={{
              width: '100%', padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              resize: 'vertical', outline: 'none', fontSize: '0.875rem',
            }}
          />
        </div>
      </Modal>
    </div>
  )
}
