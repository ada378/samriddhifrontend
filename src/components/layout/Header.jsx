import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Icon, { CategoryIcon } from '../common/Icons'
import SearchBar from '../search/SearchBar'
import logoImg from '../../assets/logosamriddhi2.png'

const t = {
  en: { login: 'Login', signup: 'Sign Up', categories: 'Categories', lang: 'हिन्दी', notifs: 'Notifications', noNotifs: 'No new notifications', viewAll: 'View all', getQuote: 'Get Quote' },
  hi: { login: 'लॉग इन', signup: 'साइन अप', categories: 'श्रेणियाँ', lang: 'English', notifs: 'सूचनाएँ', noNotifs: 'कोई नई सूचना नहीं', viewAll: 'सभी देखें', getQuote: 'कोटेशन प्राप्त करें' },
}

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Why Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Header() {
  const { user, language, setLanguage, getCartCount, notifications, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    api.categories()
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
  }, [])

  const [catOpen, setCatOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [navDropdown, setNavDropdown] = useState(null)
  const navigate = useNavigate()
  const l = t[language]
  const cartCount = getCartCount()
  const notifCount = notifications.length
  const catRef = useRef(null)
  const notifRef = useRef(null)
  const userRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const badgeStyle = {
    position: 'absolute', top: 2, right: 2, background: 'var(--danger)', color: 'white',
    fontSize: '0.625rem', fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
  }

  return (
    <>
      <div className="header-fixed-wrapper">
        <div className="header-top-bar">
          <div className="container header-top-inner">
            <div className="header-top-contacts">
              <span className="header-contact-item">
                <Icon name="phone" size={12} /> +91 9151810643
              </span>
              <span className="header-contact-item header-contact-hide">
                <Icon name="mail" size={12} /> samridhiblacksalt@gmail.com
              </span>
              <span className="header-contact-item header-contact-hide">
                <Icon name="mapPin" size={12} /> Mahmudabad, Sitapur, UP
              </span>
            </div>
          </div>
        </div>

        <header className="header-main">
          <div className="container header-main-inner">
            <div className="header-left">
              <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-btn" aria-label="Menu">
                <Icon name="menu" size={24} />
              </button>
              <Link to="/" className="header-logo-link">
                <img src={logoImg} alt="Samriddhi" className="header-logo" />
              </Link>
            </div>

            <nav className="header-nav">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="header-nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="header-right">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="header-icon-btn header-search-toggle"
                aria-label="Search"
              >
                <Icon name="search" size={20} />
              </button>

              <div ref={notifRef} className="header-icon-wrapper">
                <button onClick={() => setNotifOpen(!notifOpen)} className="header-icon-btn" aria-label="Notifications">
                  <Icon name="bell" size={20} />
                  {notifCount > 0 && <span style={badgeStyle}>{notifCount > 9 ? '9+' : notifCount}</span>}
                </button>
                {notifOpen && (
                  <div className="header-dropdown header-dropdown-notif">
                    <div className="header-dropdown-header">{l.notifs}</div>
                    {notifications.length === 0 ? (
                      <div className="header-dropdown-empty">{l.noNotifs}</div>
                    ) : (
                      notifications.slice(0, 5).map((n, i) => (
                        <div key={i} className="header-dropdown-item">{n.message}</div>
                      ))
                    )}
                    {notifications.length > 5 && (
                      <button onClick={() => { navigate('/support'); setNotifOpen(false) }} className="header-dropdown-footer">{l.viewAll}</button>
                    )}
                  </div>
                )}
              </div>

              <Link to="/cart" className="header-icon-btn" aria-label="Cart">
                <Icon name="cart" size={20} />
                {cartCount > 0 && <span className="header-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
              </Link>

              <button onClick={() => navigate('/contact')} className="btn btn-accent btn-sm header-quote-btn">
                <Icon name="phone" size={14} /> {l.getQuote}
              </button>

              <button onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')} className="header-icon-btn header-lang-btn">
                {l.lang}
              </button>

              {user ? (
                <div ref={userRef} className="header-user-wrapper">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="header-user-btn">
                    <div className="header-user-avatar">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="header-user-name">{user.name || 'User'}</span>
                    <Icon name="chevronDown" size={14} />
                  </button>
                  {userMenuOpen && (
                    <div className="header-dropdown header-dropdown-user">
                      {[
                        { label: 'My Account', path: '/account' },
                        { label: 'My Orders', path: '/orders' },
                        { label: 'Wishlist', path: '/wishlist' },
                        ...(user.role === 'admin' ? [{ label: '⚙️ Admin Panel', path: '/admin' }] : []),
                        ...(user.role === 'vendor' ? [{ label: '📦 Vendor Panel', path: '/vendor' }] : []),
                      ].map(item => (
                        <Link key={item.path} to={item.path} onClick={() => setUserMenuOpen(false)} className="header-dropdown-link">
                          {item.label}
                        </Link>
                      ))}
                      <div className="header-dropdown-divider" />
                      <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/') }} className="header-dropdown-logout">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="header-auth-btns">
                  <button onClick={() => navigate('/login')} className="btn btn-secondary btn-sm">{l.login}</button>
                  <button onClick={() => navigate('/register')} className="btn btn-primary btn-sm">{l.signup}</button>
                </div>
              )}
            </div>
          </div>

          {searchOpen && (
            <div className="header-search-mobile">
              <div className="container">
                <SearchBar />
              </div>
            </div>
          )}
        </header>
      </div>

      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-brand">
                <Icon name="mdSalt" size={22} color="var(--primary)" /> Samriddhi
              </span>
              <button onClick={() => setMenuOpen(false)} className="mobile-drawer-close">
                <Icon name="close" size={20} />
              </button>
            </div>
            <nav className="mobile-drawer-nav">
              <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
              <MobileLink to="/about" onClick={() => setMenuOpen(false)}>About Us</MobileLink>
              <MobileLink to="/products" onClick={() => setMenuOpen(false)}>Products</MobileLink>
              <MobileLink to="/vendors" onClick={() => setMenuOpen(false)}>Vendors</MobileLink>
              <MobileLink to="/cart" onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 ? `(${cartCount})` : ''}</MobileLink>
              <MobileLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</MobileLink>
              <MobileLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</MobileLink>
              <MobileLink to="/account" onClick={() => setMenuOpen(false)}>Account</MobileLink>
              <MobileLink to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</MobileLink>
              <div className="mobile-drawer-category-label">{l.categories}</div>
              {categories.map(cat => (
                <MobileLink key={cat.id} to={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)} className="mobile-drawer-cat-item">
                  <CategoryIcon name={cat.name} size={16} /> {language === 'hi' ? cat.nameHi : cat.name}
                </MobileLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <style>{`
        .header-fixed-wrapper { position: static; }
        .header-fixed-wrapper header { position: sticky; top: 0; z-index: 1000; }

        .header-top-bar {
          background: var(--primary);
          color: rgba(255,255,255,0.9);
          font-size: 0.8rem;
          padding: 6px 0;
        }

        .header-top-inner {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-top-contacts {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header-main {
          background: var(--bg-white);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .header-main-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          height: var(--header-height);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .header-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .header-logo {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }

        .header-nav-link {
          padding: 8px 16px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          font-family: var(--font-sans);
        }

        .header-nav-link:hover {
          color: var(--primary);
          background: var(--primary-light);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .header-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
          text-decoration: none;
        }

        .header-icon-btn:hover {
          background: var(--bg-gray);
          color: var(--primary);
        }

        .header-icon-wrapper {
          position: relative;
        }

        .header-cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--primary);
          color: white;
          font-size: 0.5625rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
        }

        .header-quote-btn {
          font-size: 0.8125rem;
          padding: 6px 14px;
          margin-left: 4px;
          gap: 6px;
        }

        .header-lang-btn {
          font-weight: 600;
          font-size: 0.75rem;
          min-width: 44px;
        }

        .header-auth-btns {
          display: flex;
          gap: 6px;
          margin-left: 4px;
        }

        .header-user-wrapper {
          position: relative;
        }

        .header-user-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: var(--radius-md);
          border: none;
          background: none;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .header-user-btn:hover {
          background: var(--bg-gray);
        }

        .header-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .header-user-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .header-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 100;
          margin-top: 4px;
          min-width: 200px;
          padding: 8px 0;
        }

        .header-dropdown-header {
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border);
        }

        .header-dropdown-empty {
          padding: 24px 16px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .header-dropdown-item {
          padding: 10px 16px;
          font-size: 0.8125rem;
          border-bottom: 1px solid var(--border-light);
        }

        .header-dropdown-footer {
          width: 100%;
          padding: 10px;
          border: none;
          background: var(--bg-gray);
          cursor: pointer;
          font-size: 0.8125rem;
          color: var(--primary);
          font-weight: 600;
        }

        .header-dropdown-user {
          min-width: 180px;
          padding: 8px;
        }

        .header-dropdown-link {
          display: block;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.875rem;
          transition: background 0.15s;
        }

        .header-dropdown-link:hover {
          background: var(--bg-gray);
        }

        .header-dropdown-divider {
          border-top: 1px solid var(--border);
          margin: 4px 0;
        }

        .header-dropdown-logout {
          width: 100%;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--danger);
          text-align: left;
          transition: background 0.15s;
        }

        .header-dropdown-logout:hover {
          background: var(--danger-light);
        }

        .header-search-mobile {
          padding: 0 0 12px;
        }

        .hamburger-btn {
          display: none;
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.5);
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          background: var(--bg-white);
          box-shadow: var(--shadow-xl);
          padding: 24px;
          overflow-y: auto;
        }

        .mobile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .mobile-drawer-brand {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-drawer-close {
          border: none;
          background: none;
          cursor: pointer;
          padding: 4px;
          color: var(--text-muted);
        }

        .mobile-drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-drawer-category-label {
          margin-top: 16px;
          font-weight: 600;
          font-size: 0.8125rem;
          color: var(--text-muted);
          padding: 8px 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mobile-drawer-cat-item {
          padding-left: 24px;
          font-size: 0.875rem;
        }

        @media (max-width: 1024px) {
          .header-logo { height: 52px; width: 52px; }
          .header-main-inner { gap: 8px; }
          .header-nav-link { padding: 6px 12px; font-size: 0.8125rem; }
          .header-quote-btn { font-size: 0.75rem; padding: 4px 10px; }
          .header-contact-hide { display: none !important; }
        }

        @media (max-width: 768px) {
          :root { --header-height: 60px !important; }
          .header-fixed-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 1000 !important; }
          .header-fixed-wrapper header { position: static !important; }
          .hamburger-btn { display: flex; }
          .header-nav { display: none !important; }
          .header-quote-btn { display: none !important; }
          .header-lang-btn { display: none !important; }
          .header-auth-btns .btn-secondary { display: none !important; }
          .header-search-toggle { display: flex !important; }
          .header-top-bar { font-size: 0.7rem !important; padding: 4px 0 !important; }
          .header-top-inner { justify-content: center !important; }
          .header-main-inner { height: 52px !important; padding: 0 8px !important; gap: 4px !important; }
          .header-logo { height: 46px; width: 46px; }
          .header-left { gap: 4px; }
          .header-icon-btn { width: 32px; height: 32px; }
          .header-user-name { display: none; }
          .header-auth-btns { gap: 4px; }
          .header-auth-btns .btn-primary { padding: 4px 8px !important; font-size: 0.6875rem !important; }
          .header-search-mobile { padding: 0 8px 8px !important; }
        }

        @media (max-width: 480px) {
          .header-right { gap: 2px !important; }
        }

        @media (max-width: 360px) {
          .header-logo { height: 40px; width: 40px; }
        }

        @media (min-width: 769px) {
          .header-search-toggle { display: none !important; }
          .mobile-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}

function MobileLink({ to, onClick, children, className, style }) {
  return (
    <Link to={to} onClick={onClick} className={className} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500,
      transition: 'background 0.15s', ...style,
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-gray)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{children}</Link>
  )
}
