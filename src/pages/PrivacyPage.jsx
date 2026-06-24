import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect personal information you provide during registration (name, email, phone, address), order details, payment information (processed securely through third-party gateways), and browsing behavior data to improve your experience.'
  },
  {
    title: '2. How We Use Your Information',
    content: 'Your information is used to process orders, provide customer support, send order updates, personalize recommendations, improve our platform, and comply with legal obligations. We do not sell your personal data to third parties.'
  },
  {
    title: '3. Data Protection',
    content: 'We implement industry-standard security measures including SSL encryption, firewalls, and regular security audits to protect your data. Access to personal information is restricted to authorized personnel only.'
  },
  {
    title: '4. Cookies',
    content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and serve relevant content. You can control cookie preferences through your browser settings.'
  },
  {
    title: '5. Third-Party Services',
    content: 'We may share necessary information with trusted third parties including payment processors, logistics partners, and analytics providers. These parties are contractually bound to protect your data.'
  },
  {
    title: '6. Your Rights',
    content: 'You have the right to access, correct, or delete your personal data. You can manage your account settings at any time or contact us to request data deletion subject to legal retention requirements.'
  },
  {
    title: '7. Data Retention',
    content: 'We retain your personal information for as long as your account is active or as needed to provide services. After account closure, data is retained for legal and tax purposes as required by applicable laws.'
  },
  {
    title: '8. Contact Us',
    content: 'For privacy-related inquiries, please contact our Data Protection Officer at privacy@samriddhi.in or through our Contact page.'
  },
]

export default function PrivacyPage() {
  return (
    <div className="container" style={{ maxWidth: 780, padding: 'var(--space-4xl) 16px' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Privacy Policy</h1>
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
        For privacy concerns, <Link to="/contact" style={{ color: 'var(--text-link)' }}>contact our team</Link>
      </div>
    </div>
  )
}
