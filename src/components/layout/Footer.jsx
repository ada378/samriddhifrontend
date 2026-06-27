import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Icon from '../common/Icons'
import logoImg from '../../assets/logosamriddhi.jpeg'

const t = {
  en: {
    about: 'About Samriddhi',
    aboutText: "India's premier multi-vendor marketplace for high-quality salts. Connecting authentic salt producers with buyers across the nation since 2024.",
    quickLinks: 'Useful Links',
    salesOffice: 'Sales Office',
    home: 'Home',
    vendors: 'All Vendors',
    cart: 'Cart',
    orders: 'Orders',
    account: 'My Account',
    support: 'Support Center',
    contact: 'Contact Us',
    phone: '+91 9151810643',
    email: 'samridhiblacksalt@gmail.com',
    address: 'Mahmudabad, Sitapur, Uttar Pradesh 261203, India',
    copyright: '© 2026 Samriddhi Multi-Vendor Salt Marketplace. All rights reserved.',
    social: 'Follow Us',
    aboutUs: 'About Us',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    faq: 'FAQ',
  },
  hi: {
    about: 'समृद्धि के बारे में',
    aboutText: 'उच्च गुणवत्ता वाले नमक के लिए भारत का प्रमुख मल्टी-वेंडर मार्केटप्लेस। 2024 से प्रामाणिक नमक उत्पादकों को देश भर के खरीदारों से जोड़ रहा है।',
    quickLinks: 'उपयोगी लिंक',
    salesOffice: 'बिक्री कार्यालय',
    home: 'होम',
    vendors: 'सभी विक्रेता',
    cart: 'कार्ट',
    orders: 'ऑर्डर',
    account: 'मेरा खाता',
    support: 'सहायता केंद्र',
    contact: 'संपर्क करें',
    phone: '+91 9151810643',
    email: 'samridhiblacksalt@gmail.com',
    address: 'महमूदाबाद, सीतापुर, उत्तर प्रदेश 261203, भारत',
    copyright: '© 2026 समृद्धि मल्टी-वेंडर साल्ट मार्केटप्लेस। सर्वाधिकार सुरक्षित।',
    social: 'हमें फॉलो करें',
    aboutUs: 'हमारे बारे में',
    terms: 'नियम एवं शर्तें',
    privacy: 'गोपनीयता नीति',
    faq: 'सामान्य प्रश्न',
  },
}

const socialLinks = [
  { name: 'Facebook', icon: 'facebook' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Twitter', icon: 'twitter' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'LinkedIn', icon: 'linkedin' },
]

const quickLinks = [
  { path: '/', labelEn: 'Home', labelHi: 'होम' },
  { path: '/about', labelEn: 'About Us', labelHi: 'हमारे बारे में' },
  { path: '/products', labelEn: 'Products', labelHi: 'उत्पाद' },
  { path: '/vendors', labelEn: 'All Vendors', labelHi: 'सभी विक्रेता' },
  { path: '/contact', labelEn: 'Contact Us', labelHi: 'संपर्क करें' },
  { path: '/faq', labelEn: 'FAQ', labelHi: 'सामान्य प्रश्न' },
]

export default function Footer() {
  const { language } = useApp()
  const l = t[language]

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <div className="footer-logo-wrap">
                <img src={logoImg} alt="Samriddhi" className="footer-logo" />
                <span className="footer-brand-name">Samriddhi</span>
              </div>
              <p className="footer-about-text">{l.aboutText}</p>
              <div className="footer-social">
                <span className="footer-social-label">{l.social}</span>
                <div className="footer-social-icons">
                  {socialLinks.map(social => (
                    <a key={social.name} href="#" aria-label={social.name} className="footer-social-icon">
                      <Icon name={social.icon} size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">{l.quickLinks}</h4>
              <ul className="footer-links">
                {quickLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {language === 'hi' ? link.labelHi : link.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">{l.salesOffice}</h4>
              <ul className="footer-contact-list">
                <li className="footer-contact-item">
                  <Icon name="mapPin" size={16} />
                  <span>{l.address}</span>
                </li>
                <li className="footer-contact-item">
                  <Icon name="phone" size={16} />
                  <a href="tel:+919151810643" className="footer-link">{l.phone}</a>
                </li>
                <li className="footer-contact-item">
                  <Icon name="mail" size={16} />
                  <a href="mailto:samridhiblacksalt@gmail.com" className="footer-link">{l.email}</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Location</h4>
              <div className="footer-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.5!2d80.5!3d27.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEyJzAwLjAiTiA4MMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                  title="Samriddhi Location"
                  loading="lazy"
                  className="footer-map-iframe"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <span>{l.copyright}</span>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">{l.privacy}</Link>
              <Link to="/terms" className="footer-bottom-link">{l.terms}</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--secondary);
          color: var(--text-light);
          margin-top: auto;
        }
        .footer-top {
          padding: 56px 0 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr 1.3fr;
          gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .footer-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .footer-logo {
          height: 52px;
          width: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.15);
        }
        .footer-brand-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-light);
        }
        .footer-about-text {
          font-size: 0.875rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
          max-width: 340px;
        }
        .footer-social-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          margin-bottom: 10px;
        }
        .footer-social-icons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .footer-social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          transition: all 0.25s;
          text-decoration: none;
        }
        .footer-social-icon:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
        }
        .footer-col-title {
          color: var(--text-light);
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        .footer-col-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 3px;
          background: var(--accent);
          border-radius: 2px;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-link {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--accent);
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
        }
        .footer-contact-item svg {
          flex-shrink: 0;
          margin-top: 3px;
          color: var(--accent);
        }
        .footer-map {
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .footer-map-iframe {
          width: 100%;
          height: 160px;
          border: none;
          display: block;
        }
        .footer-bottom {
          padding: 20px 0;
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.5);
        }
        .footer-bottom-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-bottom-links {
          display: flex;
          gap: 20px;
        }
        .footer-bottom-link {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-bottom-link:hover {
          color: var(--accent);
        }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-brand-col { grid-column: 1 / -1; }
          .footer-about-text { max-width: none; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-top { padding-top: 40px !important; }
          .footer-col-title { font-size: 0.9375rem !important; }
          .footer-bottom-inner { flex-direction: column !important; text-align: center !important; }
          .footer-map-iframe { height: 140px !important; }
        }
        @media (max-width: 480px) {
          .footer-top { padding-top: 32px !important; }
          .footer-grid { gap: 24px !important; }
          .footer-logo { height: 44px; width: 44px; }
        }
      `}</style>
    </footer>
  )
}
