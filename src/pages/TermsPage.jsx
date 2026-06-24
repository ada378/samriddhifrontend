import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using Samriddhi ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Platform. These terms may be updated at any time without prior notice.'
  },
  {
    title: '2. Vendor Responsibilities',
    content: 'Vendors listing products on Samriddhi must ensure all product information, pricing, and imagery is accurate and compliant with FSSAI and other applicable regulations. Vendors are responsible for order fulfillment, quality control, and timely dispatch.'
  },
  {
    title: '3. Buyer Responsibilities',
    content: 'Buyers must provide accurate delivery information and ensure someone is available to receive orders. Samriddhi reserves the right to cancel orders found to be fraudulent or in violation of these terms.'
  },
  {
    title: '4. Pricing & Payments',
    content: 'All prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise. Payment must be completed at the time of purchase. Cash on Delivery (COD) orders may be subject to confirmation calls.'
  },
  {
    title: '5. Shipping & Delivery',
    content: 'Estimated delivery times are provided by vendors and are not guaranteed. Samriddhi is not liable for delays caused by third-party logistics partners, natural disasters, or other force majeure events.'
  },
  {
    title: '6. Returns & Refunds',
    content: 'Returns are accepted within 7 days of delivery for defective or incorrect products. Refunds will be processed within 5-7 business days after quality inspection. Custom/bulk orders are non-returnable.'
  },
  {
    title: '7. Intellectual Property',
    content: 'All content on Samriddhi — including logos, text, images, and software — is the property of Samriddhi or its licensors. Unauthorized use, reproduction, or distribution is strictly prohibited.'
  },
  {
    title: '8. Limitation of Liability',
    content: 'Samriddhi acts as a marketplace intermediary and is not liable for any direct, indirect, incidental, or consequential damages arising from the use of the Platform or products purchased through it.'
  },
  {
    title: '9. Governing Law',
    content: 'These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh.'
  },
  {
    title: '10. Contact',
    content: 'For questions regarding these terms, please contact us at support@samriddhi.in or through our Contact page.'
  },
]

export default function TermsPage() {
  return (
    <div className="container" style={{ maxWidth: 780, padding: 'var(--space-4xl) 16px' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Terms & Conditions</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2xl)', fontSize: '0.875rem' }}>
        Last updated: January 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sections.map((s, i) => (
          <div key={i}>
            <h3 style={{ fontSize: '1.0625rem', marginBottom: 8 }}>{s.title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{s.content}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-3xl)', padding: 'var(--space-lg)', background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Have questions? <Link to="/contact" style={{ color: 'var(--text-link)' }}>Contact us</Link>
      </div>
    </div>
  )
}
