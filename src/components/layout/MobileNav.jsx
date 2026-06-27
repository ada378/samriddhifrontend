import { useLocation, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Icon from '../common/Icons'

const tabs = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/vendors', label: 'Vendors', icon: 'users' },
  { path: '/cart', label: 'Cart', icon: 'cart' },
  { path: '/orders', label: 'Orders', icon: 'package' },
  { path: '/account', label: 'Account', icon: 'user' },
]

export default function MobileNav() {
  const { pathname } = useLocation()
  const { getCartCount } = useApp()
  const cartCount = getCartCount()

  return (
    <nav className="mobile-nav">
      {tabs.map(tab => {
        const isActive = tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path)
        return (
          <Link key={tab.path} to={tab.path} className={`mobile-nav-item ${isActive ? 'mobile-nav-item-active' : ''}`}>
            <div className="mobile-nav-icon-wrap">
              <Icon name={tab.icon} size={22} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              {tab.path === '/cart' && cartCount > 0 && (
                <span className="mobile-nav-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </div>
            <span className="mobile-nav-label">{tab.label}</span>
            {isActive && <span className="mobile-nav-indicator" />}
          </Link>
        )
      })}
      <style>{`
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 950;
          background: var(--bg-white);
          border-top: 1px solid var(--border);
          display: none;
          justify-content: space-around;
          align-items: center;
          padding: 6px 0;
          padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
        }
        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          text-decoration: none;
          padding: 4px 12px;
          position: relative;
          color: var(--text-muted);
        }
        .mobile-nav-item-active {
          color: var(--primary);
        }
        .mobile-nav-icon-wrap {
          position: relative;
        }
        .mobile-nav-cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
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
        .mobile-nav-label {
          font-size: 0.625rem;
          font-weight: 600;
          line-height: 1;
        }
        .mobile-nav-indicator {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: var(--primary);
          border-radius: var(--radius-full);
        }
        @media (max-width: 768px) {
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
