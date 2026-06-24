import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/common/Icons'

const faqs = [
  {
    q: 'What is Samriddhi?',
    a: 'Samriddhi is India\'s premier multi-vendor marketplace for high-quality salts. We connect authentic salt producers directly with buyers, offering a wide range of products from Himalayan pink salt to industrial-grade salts.'
  },
  {
    q: 'How do I place an order?',
    a: 'Simply browse products, add items to your cart, proceed to checkout, enter your delivery address, choose a payment method (including Cash on Delivery), and place your order. You\'ll receive a confirmation with an order ID.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept Cash on Delivery (COD), UPI, Net Banking, Credit/Debit Cards, EMI, NEFT/RTGS, and BNPL options. All payments are processed securely.'
  },
  {
    q: 'How are products delivered?',
    a: 'Products are shipped directly by vendors through trusted logistics partners. Delivery times vary by location and vendor, typically ranging from 3-7 business days.'
  },
  {
    q: 'What is the return policy?',
    a: 'Returns are accepted within 7 days of delivery for defective or incorrect products. Refunds are processed within 5-7 business days after quality inspection. Custom and bulk orders are non-returnable.'
  },
  {
    q: 'How do I track my order?',
    a: 'You can track your order from the "My Orders" section in your account. Order updates are also sent via email and SMS.'
  },
  {
    q: 'Can I sell on Samriddhi?',
    a: 'Yes! We welcome salt producers, distributors, and artisans to join our platform. Register as a vendor from the Sign Up page or contact our partnerships team.'
  },
  {
    q: 'Is there a minimum order quantity?',
    a: 'MOQ (Minimum Order Quantity) varies by product and vendor. Each product listing clearly specifies its MOQ. Some products are available for single-unit purchase.'
  },
  {
    q: 'How do I contact customer support?',
    a: 'You can reach us via phone at +91 1800-123-4567, email at support@samriddhi.in, or visit our Support Center for live chat and ticket-based assistance.'
  },
  {
    q: 'Are the salts certified?',
    a: 'Yes, all products on Samriddhi meet quality standards. Many vendors hold FSSAI, ISO, and organic certifications. Certification details are listed on each product page.'
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className="container" style={{ maxWidth: 780, padding: 'var(--space-4xl) 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
          Everything you need to know about Samriddhi. Can't find what you're looking for? Contact us.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            overflow: 'hidden', transition: 'box-shadow 0.15s',
            boxShadow: openIndex === i ? 'var(--shadow-sm)' : 'none',
          }}>
            <button onClick={() => toggle(i)} style={{
              width: '100%', padding: '16px 20px', border: 'none', background: openIndex === i ? 'var(--bg-gray)' : 'var(--bg-white)',
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left',
              transition: 'background 0.15s',
            }}>
              <span>{faq.q}</span>
              <Icon name={openIndex === i ? 'chevron-up' : 'chevron-down'} size={18} color="var(--text-muted)" />
            </button>
            {openIndex === i && (
              <div style={{
                padding: '0 20px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)',
                lineHeight: 1.7, borderTop: '1px solid var(--border-light)', paddingTop: 16,
              }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'var(--space-3xl)', padding: 'var(--space-xl)',
        background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 4 }}>Still have questions?</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          Our support team is here to help you.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/contact" className="btn btn-primary" style={{ textDecoration: 'none' }}>Contact Us</Link>
          <Link to="/support" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Support Center</Link>
        </div>
      </div>
    </div>
  )
}
