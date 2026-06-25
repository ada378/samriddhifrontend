import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Icon, { CategoryIcon } from '../common/Icons'
import SearchBar from '../search/SearchBar'
import logoImg from '../../assets/logosamriddhi2.png'

const t = {
  en: { login: 'Login', signup: 'Sign Up', categories: 'Categories', lang: 'हिन्दी', notifs: 'Notifications', noNotifs: 'No new notifications', viewAll: 'View all' },
  hi: { login: 'लॉग इन', signup: 'साइन अप', categories: 'श्रेणियाँ', lang: 'English', notifs: 'सूचनाएँ', noNotifs: 'कोई नई सूचना नहीं', viewAll: 'सभी देखें' },
}

export default function Header() {
  const { user, language, setLanguage, getCartCount, notifications, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.categories()
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
  }, [])
  const [catOpen, setCatOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
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
        <div style={{
          background: 'var(--secondary)', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem',
          padding: '6px 0', display: 'flex', alignItems: 'center',
        }}>
          <div className="container top-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <span className="top-bar-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="phone" size={12} /> +91 9151810643
            </span>
            <span className="top-bar-item top-bar-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="mail" size={12} /> samridhiblacksalt@gmail.com
            </span>
            <span className="top-bar-item top-bar-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="location" size={12} /> Mahmudabad, Sitapur, UP
            </span>
          </div>
        </div>
        <header style={{
          background: 'var(--bg-white)',
          borderBottom: '2px solid var(--primary)', boxShadow: 'var(--shadow-sm)',
        }}>
          <div className="container header-row" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 'var(--header-height)' }}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-btn" aria-label="Menu">
              <Icon name="menu" size={24} />
            </button>

            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <img src={logoImg} alt="Samriddhi" className="header-logo" style={{ height: 56, width: 56, borderRadius: '50%', objectFit: 'cover' }} />
            </Link>

            <div className="search-desktop" style={{ flex: 1, maxWidth: 440 }}>
              <SearchBar />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>

              <div ref={notifRef} style={{ position: 'relative' }}>
                <button onClick={() => setNotifOpen(!notifOpen)} className="btn btn-ghost btn-sm btn-icon" style={{ position: 'relative' }}>
                  <Icon name="bell" size={20} />
                  {notifCount > 0 && <span style={badgeStyle}>{notifCount > 9 ? '9+' : notifCount}</span>}
                </button>
                {notifOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, background: 'var(--bg-white)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)', zIndex: 100, minWidth: 300, marginTop: 4,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: '0.875rem' }}>{l.notifs}</div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{l.noNotifs}</div>
                    ) : (
                      notifications.slice(0, 5).map((n, i) => (
                        <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-light)', fontSize: '0.8125rem' }}>{n.message}</div>
                      ))
                    )}
                    {notifications.length > 5 && (
                      <button onClick={() => { navigate('/support'); setNotifOpen(false) }} style={{
                        width: '100%', padding: 10, border: 'none', background: 'var(--bg-gray)',
                        cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600,
                      }}>{l.viewAll}</button>
                    )}
                  </div>
                )}
              </div>

              <Link to="/cart" className="btn btn-ghost btn-sm btn-icon" style={{ position: 'relative', textDecoration: 'none' }}>
                <Icon name="cart" size={20} />
                {cartCount > 0 && <span style={{ ...badgeStyle, background: 'var(--primary)' }}>{cartCount > 99 ? '99+' : cartCount}</span>}
              </Link>

              <button onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')} className="btn btn-ghost btn-sm" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                {l.lang}
              </button>

              {user ? (
                <div ref={userRef} style={{ position: 'relative' }}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="user-name">{user.name || 'User'}</span>
                  </button>
                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, background: 'var(--bg-white)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)', zIndex: 100, minWidth: 180, marginTop: 4, padding: 8,
                    }}>
                      {[
                        { label: 'My Account', path: '/account' },
                        { label: 'My Orders', path: '/orders' },
                        { label: 'Wishlist', path: '/wishlist' },
                        ...(user.role === 'admin' ? [{ label: '⚙️ Admin Panel', path: '/admin' }] : []),
                        ...(user.role === 'vendor' ? [{ label: '📦 Vendor Panel', path: '/vendor' }] : []),
                      ].map(item => (
                        <Link key={item.path} to={item.path} onClick={() => setUserMenuOpen(false)} style={{
                          display: 'block', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-gray)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >{item.label}</Link>
                      ))}
                      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                      <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/') }} style={{
                        width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                        border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem',
                        color: 'var(--danger)', textAlign: 'left', transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-light)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => navigate('/login')} className="btn btn-secondary btn-sm">{l.login}</button>
                  <button onClick={() => navigate('/register')} className="btn btn-primary btn-sm auth-signup">{l.signup}</button>
                </div>
              )}
            </div>
          </div>

          <div className="search-mobile" style={{ padding: '0 16px 12px' }}>
            <SearchBar />
          </div>
        </header>
      </div>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)' }} className="mobile-overlay" onClick={() => setMenuOpen(false)}>
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, background: 'var(--bg-white)',
            boxShadow: 'var(--shadow-xl)', padding: 24, overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="mdSalt" size={22} color="var(--primary)" /> Samriddhi</span>
              <button onClick={() => setMenuOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}><Icon name="close" size={20} color="var(--text-muted)" /></button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>
              <MobileLink to="/vendors" onClick={() => setMenuOpen(false)}>Vendors</MobileLink>
              <MobileLink to="/cart" onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 ? `(${cartCount})` : ''}</MobileLink>
              <MobileLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</MobileLink>
              <MobileLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</MobileLink>
              <MobileLink to="/account" onClick={() => setMenuOpen(false)}>Account</MobileLink>
              <div style={{ marginTop: 16, fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l.categories}</div>
              {categories.map(cat => (
                <MobileLink key={cat.id} to={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)} style={{ paddingLeft: 24, fontSize: '0.875rem' }}>
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
        .hamburger-btn { display: none; background: none; border: none; padding: 6px; cursor: pointer; color: var(--text-primary); }
        .search-mobile { display: none; }
        @media (max-width: 1024px) {
          .header-logo { height: 48px !important; width: 48px !important; }
          .header-row { gap: 6px !important; }
        }
        @media (max-width: 768px) {
          :root { --header-height: 60px !important; }
          .header-fixed-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 1000 !important; }
          .header-fixed-wrapper header { position: static !important; }
          .hamburger-btn { display: flex; }
          .search-desktop { display: none !important; }
          .search-mobile { display: block; }
          .cat-label, .user-name, .auth-signup { display: none; }
          .top-bar { font-size: 0.7rem !important; justify-content: center !important; padding: 4px 12px !important; }
          .top-bar-hide-mobile { display: none !important; }
          .header-row { height: 52px !important; padding: 0 8px !important; gap: 4px !important; }
          header .btn { padding: 4px 6px !important; font-size: 0.75rem !important; }
          header .btn-icon { width: 32px !important; height: 32px !important; }
          .search-mobile { padding: 0 8px 8px !important; }
        }
        @media (max-width: 480px) {
          .header-row > div:last-child { gap: 2px !important; }
          header .btn-secondary, header .btn-primary { padding: 4px 8px !important; font-size: 0.6875rem !important; }
        }
        @media (max-width: 360px) {
          .header-logo { height: 36px !important; width: 36px !important; }
        }
        @media (min-width: 769px) {
          .search-desktop { display: block !important; }
          .search-mobile { display: none !important; }
          .mobile-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}

function MobileLink({ to, onClick, children, style }) {
  return (
    <Link to={to} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
      color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500,
      transition: 'background 0.15s', ...style,
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-gray)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{children}</Link>
  )
}
