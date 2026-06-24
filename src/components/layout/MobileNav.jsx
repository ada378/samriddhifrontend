import { useLocation, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Icon from '../common/Icons'

const tabs = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/vendors', label: 'Vendors', icon: 'vendors' },
  { path: '/cart', label: 'Cart', icon: 'cart' },
  { path: '/orders', label: 'Orders', icon: 'orders' },
  { path: '/account', label: 'Account', icon: 'account' },
]

function TabIcon({ name, active }) {
  const color = active ? 'var(--primary)' : 'var(--text-muted)'
  const iconName = { home: 'home', vendors: 'users', cart: 'cart', orders: 'package', account: 'user' }[name]
  return iconName ? <Icon name={iconName} size={22} color={color} /> : null
}

export default function MobileNav() {
  const { pathname } = useLocation()
  const { getCartCount } = useApp()
  const cartCount = getCartCount()

  return (
    <nav className="mobile-nav" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 950,
      background: 'var(--bg-white)', borderTop: '1px solid var(--border)',
      display: 'none', justifyContent: 'space-around', alignItems: 'center',
      padding: '6px 0', paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
    }}>
      {tabs.map(tab => {
        const isActive = tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path)
        return (
          <Link key={tab.path} to={tab.path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            textDecoration: 'none', padding: '4px 12px', position: 'relative',
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          }}>
            <div style={{ position: 'relative' }}>
              <TabIcon name={tab.icon} active={isActive} />
              {tab.path === '/cart' && cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -8, background: 'var(--primary)', color: 'white',
                  fontSize: '0.5625rem', fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
                }}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 600, lineHeight: 1 }}>{tab.label}</span>
            {isActive && (
              <span style={{
                position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
                width: 20, height: 3, background: 'var(--primary)', borderRadius: 'var(--radius-full)',
              }} />
            )}
          </Link>
        )
      })}
      <style>{`
        @media (max-width: 768px) {
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
