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

      <div className="cart-layout">
        <div className="cart-items">
          {grouped.map(group => {
            const vendor = group.vendor
            return (
              <div key={vendor?.id || 'unknown'} className="cart-vendor-group">
                <div className="cart-vendor-header">
                  <div className="cart-vendor-avatar">{vendor?.logo || '?'}</div>
                  <div>
                    <Link to={`/vendors/${vendor?.slug}`} className="cart-vendor-name">
                      {vendor?.name || 'Unknown Vendor'}
                    </Link>
                    <div className="cart-vendor-location">{vendor?.city}, {vendor?.state}</div>
                  </div>
                  <span className="cart-vendor-subtotal">
                    Subtotal: ₹{totals.vendorSubtotals[vendor?.id]?.toLocaleString() || 0}
                  </span>
                </div>

                {group.items.map(item => (
                  <div key={`${item.product.id}-${item.vendorId}`} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.product.images?.[0]} alt={item.product.name} />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.product.name}</div>
                      <div className="cart-item-seller">Sold by {vendor?.name}</div>
                      <div className="cart-item-price">Unit Price: <span>₹{item.product.price}</span></div>
                    </div>
                    <div className="cart-item-actions">
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.product.id, item.vendorId)}>
                        <Icon name="trash" size={16} />
                      </button>
                      <div className="quantity-stepper">
                        <button onClick={() => handleQuantity(item, -1)} disabled={item.quantity <= 1}>−</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={() => handleQuantity(item, 1)}>+</button>
                      </div>
                      <div className="cart-item-total">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}

          <div className="cart-actions">
            <Button variant="secondary" icon={<Icon name="bookmark" size={16} />}>Save for Later</Button>
            <Button variant="secondary" onClick={handleShareCart} icon={<Icon name="share" size={16} />}>Share Cart</Button>
          </div>
        </div>

        <div className="cart-summary">
          <div className="card cart-summary-card">
            <h4>Cart Summary</h4>

            <div className="cart-coupon">
              <div className="cart-coupon-row">
                <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon code" className="cart-coupon-input"
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <Button size="sm" onClick={handleApplyCoupon} disabled={!coupon.trim()}>Apply</Button>
              </div>
              {couponApplied && (
                <div className="cart-coupon-applied">
                  <Icon name="check" size={14} color="var(--success)" /> SALT10 applied - 10% off
                </div>
              )}
            </div>

            <div className="cart-summary-rows">
              {grouped.map(group => (
                <div key={group.vendor?.id} className="cart-summary-row">
                  <span>{group.vendor?.name}:</span>
                  <span>₹{totals.vendorSubtotals[group.vendor?.id]?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>

            <hr className="cart-divider" />

            <div className="cart-summary-row"><span>Subtotal</span><span>₹{totals.subtotal.toLocaleString()}</span></div>
            <div className="cart-summary-row"><span>GST (5%)</span><span>₹{totals.gst.toLocaleString()}</span></div>
            <div className="cart-summary-row"><span>Platform Fee</span><span>₹{totals.platformFee}</span></div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span className={totals.delivery === 0 ? 'cart-free' : ''}>
                {totals.delivery === 0 ? 'FREE' : `₹${totals.delivery}`}
              </span>
            </div>
            {couponApplied && (
              <div className="cart-summary-row cart-discount-row">
                <span>Discount (10%)</span>
                <span>-₹{totals.discount.toLocaleString()}</span>
              </div>
            )}

            <hr className="cart-divider cart-divider-thick" />

            <div className="cart-grand-total">
              <span>Grand Total</span>
              <span>₹{totals.grand.toLocaleString()}</span>
            </div>

            <Button block size="lg" onClick={() => { if (!user) { showToast('Please login first to checkout', 'warning'); navigate('/login'); return }; navigate('/checkout') }} icon={<Icon name="chevronRight" size={18} />}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: var(--space-2xl);
          align-items: start;
        }
        .cart-vendor-group { margin-bottom: var(--space-xl); }
        .cart-vendor-header {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; background: var(--bg-gray);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          border-bottom: 2px solid var(--primary);
        }
        .cart-vendor-avatar {
          width: 36px; height: 36px; border-radius: var(--radius-sm);
          background: var(--primary); color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.75rem; flex-shrink: 0;
        }
        .cart-vendor-name { font-weight: 600; color: var(--text-primary); text-decoration: none; font-size: 0.9375rem; }
        .cart-vendor-location { font-size: 0.75rem; color: var(--text-muted); }
        .cart-vendor-subtotal { margin-left: auto; font-size: 0.8125rem; color: var(--text-secondary); font-weight: 600; white-space: nowrap; }
        .cart-item {
          display: flex; gap: 16px; padding: 16px;
          background: var(--bg-white); border-bottom: 1px solid var(--border-light);
        }
        .cart-item-image {
          width: 80px; height: 80px; border-radius: var(--radius-md);
          overflow: hidden; flex-shrink: 0; background: var(--bg-gray);
        }
        .cart-item-image img { width: 100%; height: 100%; object-fit: cover; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name { font-weight: 600; font-size: 0.9375rem; margin-bottom: 4px; }
        .cart-item-seller { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 8px; }
        .cart-item-price { font-size: 0.875rem; color: var(--text-muted); }
        .cart-item-price span { font-weight: 600; color: var(--text-primary); }
        .cart-item-actions {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 8px; flex-shrink: 0;
        }
        .cart-item-remove {
          background: none; border: none; cursor: pointer; color: var(--text-muted);
          padding: 4px; border-radius: var(--radius-full); transition: all 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .cart-item-remove:hover { color: var(--danger); background: var(--danger-light); }
        .cart-item-total { font-weight: 700; font-size: 1rem; color: var(--primary); white-space: nowrap; }
        .cart-actions { display: flex; gap: 12px; margin-top: var(--space-xl); flex-wrap: wrap; }
        .cart-summary { position: sticky; top: calc(var(--header-height) + 24px); }
        .cart-summary-card { padding: var(--space-xl); }
        .cart-summary-card h4 { margin-bottom: var(--space-lg); font-size: 1.125rem; }
        .cart-coupon { margin-bottom: var(--space-lg); }
        .cart-coupon-row { display: flex; gap: 8px; }
        .cart-coupon-input {
          flex: 1; padding: 8px 12px; border: 2px solid var(--border);
          border-radius: var(--radius-md); outline: none; font-size: 0.875rem;
        }
        .cart-coupon-applied { font-size: 0.8125rem; color: var(--success); margin-top: 6px; font-weight: 600; }
        .cart-summary-rows { margin-bottom: 4px; }
        .cart-summary-row {
          font-size: 0.8125rem; color: var(--text-muted);
          display: flex; justify-content: space-between; margin-bottom: 4px;
        }
        .cart-summary-row span:last-child { font-weight: 600; color: var(--text-primary); }
        .cart-free { color: var(--success) !important; }
        .cart-discount-row span { color: var(--success) !important; }
        .cart-divider { border: none; border-top: 1px solid var(--border); margin: 12px 0; }
        .cart-divider-thick { border-top: 2px solid var(--primary); }
        .cart-grand-total {
          display: flex; justify-content: space-between;
          font-size: 1.125rem; margin-bottom: var(--space-lg);
        }
        .cart-grand-total span:first-child { font-weight: 700; }
        .cart-grand-total span:last-child { font-weight: 700; color: var(--primary); }

        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
        @media (max-width: 768px) {
          .cart-vendor-subtotal { font-size: 0.75rem; }
          .cart-item { gap: 12px; padding: 12px; }
          .cart-item-image { width: 64px; height: 64px; }
          .cart-item-name { font-size: 0.875rem; }
        }
        @media (max-width: 480px) {
          .cart-item { flex-wrap: wrap; gap: 10px; }
          .cart-item-image { width: 100%; height: auto; max-height: 180px; aspect-ratio: 1/1; }
          .cart-item-info { width: calc(100% - 74px); }
          .cart-item-actions { flex-direction: row; width: 100%; justify-content: space-between; align-items: center; }
          .cart-item-remove { order: 3; }
          .cart-item-total { order: 2; }
          .cart-vendor-header { flex-wrap: wrap; gap: 8px; }
          .cart-vendor-subtotal { margin-left: 0; width: 100%; text-align: right; }
          .cart-summary-card { padding: var(--space-lg); }
          .cart-grand-total { font-size: 1rem; }
        }
        @media (max-width: 360px) {
          .cart-item-info { width: 100%; }
          .cart-coupon-row { flex-direction: column; }
          .cart-coupon-input { width: 100%; }
        }
      `}</style>
    </div>
  )
}
