import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Icon, { CategoryIcon } from '../common/Icons'
import logoImg from '../../assets/logosamriddhi.jpeg'

const t = {
  en: {
    about: 'About Samriddhi',
    aboutText: "India's premier multi-vendor marketplace for high-quality salts. Connecting authentic salt producers with buyers across the nation since 2024.",
    categories: 'Categories',
    quickLinks: 'Quick Links',
    home: 'Home',
    vendors: 'All Vendors',
    cart: 'Cart',
    orders: 'Orders',
    account: 'My Account',
    support: 'Support Center',
    newsletter: 'Subscribe to our Newsletter',
    newsletterText: 'Get updates on new products, offers, and industry insights.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    contact: 'Contact Us',
    phone: '+91 9151810643',
    email: 'samridhiblacksalt@gmail.com',
    copyright: '© 2026 Samriddhi. All rights reserved.',
    download: 'Download App',
    social: 'Follow Us',
  },
  hi: {
    about: 'समृद्धि के बारे में',
    aboutText: 'उच्च गुणवत्ता वाले नमक के लिए भारत का प्रमुख मल्टी-वेंडर मार्केटप्लेस। 2024 से प्रामाणिक नमक उत्पादकों को देश भर के खरीदारों से जोड़ रहा है।',
    categories: 'श्रेणियाँ',
    quickLinks: 'त्वरित लिंक',
    home: 'होम',
    vendors: 'सभी विक्रेता',
    cart: 'कार्ट',
    orders: 'ऑर्डर',
    account: 'मेरा खाता',
    support: 'सहायता केंद्र',
    newsletter: 'हमारे न्यूज़लेटर की सदस्यता लें',
    newsletterText: 'नए उत्पादों, ऑफ़र और उद्योग अंतर्दृष्टि पर अपडेट प्राप्त करें।',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    subscribe: 'सदस्यता लें',
    contact: 'संपर्क करें',
    phone: '+91 9151810643',
    email: 'samridhiblacksalt@gmail.com',
    copyright: '© 2026 समृद्धि। सर्वाधिकार सुरक्षित।',
    download: 'ऐप डाउनलोड करें',
    social: 'हमें फॉलो करें',
  },
}

const quickLinks = [
  { path: '/', labelEn: 'Home', labelHi: 'होम' },
  { path: '/vendors', labelEn: 'All Vendors', labelHi: 'सभी विक्रेता' },
  { path: '/cart', labelEn: 'Cart', labelHi: 'कार्ट' },
  { path: '/orders', labelEn: 'Orders', labelHi: 'ऑर्डर' },
  { path: '/account', labelEn: 'My Account', labelHi: 'मेरा खाता' },
  { path: '/support', labelEn: 'Support Center', labelHi: 'सहायता केंद्र' },
]

const socialLinks = [
  { name: 'Facebook', icon: 'facebook' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Twitter', icon: 'twitter' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'LinkedIn', icon: 'linkedin' },
]

function SocialIcon({ name }) {
  return <Icon name={name} size={20} />
}

export default function Footer() {
  const { language } = useApp()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.categories()
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
  }, [])
  const l = t[language]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer style={{ background: 'var(--secondary)', color: 'var(--text-light)', marginTop: 'auto' }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 0 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: 32, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)',
        }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <img src={logoImg} alt="Samriddhi" style={{ height: 48, width: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: 16, maxWidth: 320 }}>
              {l.aboutText}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {socialLinks.map(social => (
                <a key={social.name} href="#" aria-label={social.name} style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)', transition: 'all 0.25s', textDecoration: 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: 16, fontWeight: 600 }}>{l.about}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link to="/about" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>About Us</Link></li>
              <li><Link to="/contact" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Contact Us</Link></li>
              <li><Link to="/terms" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Terms & Conditions</Link></li>
              <li><Link to="/privacy" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Privacy Policy</Link></li>
              <li><Link to="/faq" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: 16, fontWeight: 600 }}>{l.categories}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} style={{
                    fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    <CategoryIcon name={cat.name} size={14} />
                    <span>{language === 'hi' ? cat.nameHi : cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: 16, fontWeight: 600 }}>{l.quickLinks}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  >{language === 'hi' ? link.labelHi : link.labelEn}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
          padding: '32px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
        }} className="footer-bottom-grid">
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: 12, fontWeight: 600 }}>{l.newsletter}</h4>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>{l.newsletterText}</p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 0, maxWidth: 400 }}>
              <input
                type="email"
                placeholder={l.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  flex: 1, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', background: 'rgba(255,255,255,0.08)',
                  color: 'white', outline: 'none', fontSize: '0.875rem',
                }}
              />
              <button type="submit" style={{
                padding: '10px 20px', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
              >
                {subscribed ? <Icon name="check" size={16} /> : l.subscribe}
              </button>
            </form>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: 12, fontWeight: 600 }}>{l.contact}</h4>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="phone" size={16} />
                {l.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="mail" size={16} />
                {l.email}
              </span>
            </div>

          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)',
          flexWrap: 'wrap', gap: 12,
        }} className="footer-copyright">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={logoImg} alt="Samriddhi" style={{ height: 28, width: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />
            <span>{l.copyright}</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="phone" size={14} />
              {l.phone}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="mail" size={14} />
              {l.email}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >Privacy</Link>
            <Link to="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >Terms</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .footer-bottom-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .footer-copyright { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          .footer-copyright > div:last-child { flex-wrap: wrap !important; justify-content: center !important; }
          footer .container > div:first-child { gap: 20px !important; }
          footer h4 { font-size: 0.875rem !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          footer .container { padding-top: 24px !important; }
          footer .container > div:first-child { padding-bottom: 24px !important; }
        }
        @media (max-width: 360px) {
          footer form { flex-direction: column !important; gap: 8px !important; }
          footer form input { border-radius: var(--radius-md) !important; }
          footer form button { border-radius: var(--radius-md) !important; width: 100% !important; }
        }
      `}</style>
    </footer>
  )
}
