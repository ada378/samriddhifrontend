import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

const GST_RATE = 0.05
const PLATFORM_FEE = 10

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, showToast, user } = useApp()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    api.vendors()
      .then(res => setVendors(res.data || []))
      .catch(() => setVendors([]))
  }, [])

  const vendorMap = useMemo(() => {
    const map = {}
    vendors.forEach(v => { map[v.id] = v })
    return map
  }, [])

  const grouped = useMemo(() => {
    const groups = {}
    cart.forEach(item => {
      const vid = item.vendorId
      if (!groups[vid]) groups[vid] = { vendor: vendorMap[vid], items: [] }
      groups[vid].items.push(item)
    })
    return Object.values(groups)
  }, [cart, vendorMap])

  const totals = useMemo(() => {
    let subtotal = 0
    const vendorSubtotals = {}
    grouped.forEach(group => {
      const vs = group.items.reduce((s, item) => s + item.product.price * item.quantity, 0)
      vendorSubtotals[group.vendor?.id || 'unknown'] = vs
      subtotal += vs
    })
    const gst = subtotal * GST_RATE
    const discount = couponApplied ? subtotal * 0.1 : 0
    const delivery = subtotal > 500 ? 0 : 40
    const grand = subtotal + gst + PLATFORM_FEE + delivery - discount
    return { subtotal, gst, platformFee: PLATFORM_FEE, delivery, discount, grand, vendorSubtotals }
  }, [grouped, couponApplied])

  const handleQuantity = (item, delta) => {
    const newQty = item.quantity + delta
    if (newQty < 1) return
    updateQuantity(item.product.id, item.vendorId, newQty)
  }

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SALT10') {
      setCouponApplied(true)
      showToast('Coupon SALT10 applied! 10% off', 'success')
    } else {
      showToast('Invalid coupon code', 'error')
    }
  }

  const handleShareCart = () => {
    if (navigator.share) {
      navigator.share({ title: 'My Samriddhi Cart', text: `Check out my cart with ${cart.length} items!` })
    } else {
      navigator.clipboard.writeText(window.location.origin + '/cart')
      showToast('Cart link copied!', 'success')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
<Icon name="cart" size={64} color="var(--text-muted)" />
          </div>
          <div className="empty-state-title">Your cart is empty</div>
          <div className="empty-state-text">Looks like you haven't added any salt to your cart yet. Explore our vendors and find the perfect salt for your needs!</div>
          <Link to="/">
            <Button size="lg" icon={
<Icon name="arrowLeft" size={18} />
            }>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-5xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-2xl)' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Shopping Cart</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>({cart.length} item{cart.length > 1 ? 's' : ''})</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
        <div>
          {grouped.map(group => {
            const vendor = group.vendor
            return (
              <div key={vendor?.id || 'unknown'} style={{ marginBottom: 'var(--space-xl)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: 'var(--bg-gray)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                  borderBottom: '2px solid var(--primary)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    background: vendor?.banner || 'var(--primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.75rem',
                  }}>{vendor?.logo || '?'}</div>
                  <div>
                    <Link to={`/vendors/${vendor?.slug}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9375rem' }}>
                      {vendor?.name || 'Unknown Vendor'}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vendor?.city}, {vendor?.state}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Subtotal: ₹{totals.vendorSubtotals[vendor?.id]?.toLocaleString() || 0}
                  </span>
                </div>

                {group.items.map(item => (
                  <div key={`${item.product.id}-${item.vendorId}`} style={{
                    display: 'flex', gap: 16, padding: '16px',
                    background: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)',
                  }}>
                    <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-gray)' }}>
                      <img src={item.product.images?.[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: 4 }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 8 }}>Sold by {vendor?.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Unit Price: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{item.product.price}</span></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => removeFromCart(item.product.id, item.vendorId)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                        padding: 4, borderRadius: 'var(--radius-full)', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-light)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                      >
<Icon name="trash" size={16} />
                      </button>
                      <div className="quantity-stepper">
                        <button onClick={() => handleQuantity(item, -1)} disabled={item.quantity <= 1}>−</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={() => handleQuantity(item, 1)}>+</button>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}

          <div style={{ display: 'flex', gap: 12, marginTop: 'var(--space-xl)' }}>
            <Button variant="secondary" icon={
<Icon name="bookmark" size={16} />
            }>Save for Later</Button>
            <Button variant="secondary" onClick={handleShareCart} icon={
<Icon name="share" size={16} />
            }>Share Cart</Button>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 'calc(var(--header-height) + 24px)' }}>
          <div className="card" style={{ padding: 'var(--space-xl)' }}>
            <h4 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.125rem' }}>Cart Summary</h4>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  style={{
                    flex: 1, padding: '8px 12px', border: '2px solid var(--border)',
                    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <Button size="sm" onClick={handleApplyCoupon} disabled={!coupon.trim()}>Apply</Button>
              </div>
              {couponApplied && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--success)', marginTop: 6, fontWeight: 600 }}>
                  <Icon name="check" size={14} color="var(--success)" /> SALT10 applied - 10% off
                </div>
              )}
            </div>

            {grouped.map(group => (
              <div key={group.vendor?.id} style={{
                fontSize: '0.8125rem', color: 'var(--text-muted)',
                display: 'flex', justifyContent: 'space-between', marginBottom: 4,
              }}>
                <span>{group.vendor?.name}:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{totals.vendorSubtotals[group.vendor?.id]?.toLocaleString() || 0}</span>
              </div>
            ))}

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{totals.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)' }}>GST (5%)</span>
              <span style={{ fontWeight: 600 }}>₹{totals.gst.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Platform Fee</span>
              <span style={{ fontWeight: 600 }}>₹{totals.platformFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
              <span style={{ fontWeight: 600, color: totals.delivery === 0 ? 'var(--success)' : 'inherit' }}>
                {totals.delivery === 0 ? 'FREE' : `₹${totals.delivery}`}
              </span>
            </div>
            {couponApplied && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--success)' }}>Discount (10%)</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>-₹{totals.discount.toLocaleString()}</span>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '2px solid var(--primary)', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>
              <span style={{ fontWeight: 700 }}>Grand Total</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{totals.grand.toLocaleString()}</span>
            </div>

            <Button block size="lg" onClick={() => { if (!user) { showToast('Please login first to checkout', 'warning'); navigate('/login'); return }; navigate('/checkout') }} icon={
<Icon name="chevronRight" size={18} />
            }>Proceed to Checkout</Button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div:last-child { grid-template-columns: 1fr !important; }
          .container > div:last-child > div:first-child > div > div:last-child > div { flex-wrap: wrap !important; gap: 8px !important; }
          .container > div:last-child > div:first-child > div > div:last-child > div > div:first-child { width: 64px !important; height: 64px !important; }
        }
        @media (max-width: 480px) {
          .container > div:last-child > div:first-child > div > div:last-child > div { flex-direction: column !important; }
          .container > div:last-child > div:first-child > div > div:last-child > div > div:first-child { width: 100% !important; height: auto !important; max-height: 180px !important; }
          .container > div:last-child > div:first-child > div > div:last-child > div > div:nth-child(2) { width: 100% !important; }
          .container > div:last-child > div:first-child > div > div:last-child > div > div:last-child { flex-direction: row !important; width: 100% !important; justify-content: space-between !important; align-items: center !important; }
        }
      `}</style>
    </div>
  )
}
