import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

export default function OrderReview({ cart, grouped, selectedAddress, deliveryOptions, paymentMethod, totals, vendorMap, onPlaceOrder }) {
  const { showToast, user } = useApp()
  const navigate = useNavigate()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [placing, setPlacing] = useState(false)

  const handlePlaceOrder = () => {
    if (!acceptedTerms) return
    if (!user) { showToast('Please login first', 'error'); navigate('/login'); return }
    setPlacing(true)
    setTimeout(() => {
      if (onPlaceOrder) onPlaceOrder()
      else {
        showToast('Order placed successfully!', 'success')
        navigate('/order-confirmation')
      }
      setPlacing(false)
    }, 1500)
  }

  const sectionStyle = {
    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)',
    marginBottom: 'var(--space-lg)', background: 'var(--bg-white)',
  }
  const editBtnStyle = {
    fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none',
    cursor: 'pointer', fontWeight: 600, padding: 0,
  }

  return (
    <div>
      <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>Review Your Order</h3>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h5 style={{ fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="home" size={16} color="var(--primary)" />
            Delivery Address
          </h5>
          <button style={editBtnStyle}>Edit</button>
        </div>
        {selectedAddress ? (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{selectedAddress.name}</strong> — {selectedAddress.phone}<br />
            {selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}, {selectedAddress.city}, {selectedAddress.district}, {selectedAddress.state} - {selectedAddress.pincode}
            {selectedAddress.gst && <><br />GST: {selectedAddress.gst}</>}
          </div>
        ) : (
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600 }}>No address selected</div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h5 style={{ fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
            Delivery Method
          </h5>
          <button style={editBtnStyle}>Edit</button>
        </div>
        {grouped.map(group => (
          <div key={group.vendor?.id} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{group.vendor?.name}:</span> {deliveryOptions[group.vendor?.id] === 'express' ? 'Express (₹49)' : deliveryOptions[group.vendor?.id] === 'pickup' ? 'Warehouse Pickup' : 'Standard Delivery (Free)'}
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h5 style={{ fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><rect x="1" y="6" width="22" height="12" rx="2" /><line x1="6" y1="10" x2="10" y2="10" /></svg>
            Payment Method
          </h5>
          <button style={editBtnStyle}>Edit</button>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'netbanking' ? 'Net Banking' : paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'emi' ? 'EMI' : paymentMethod === 'neft' ? 'NEFT/RTGS' : paymentMethod === 'bnpl' ? 'Buy Now Pay Later' : paymentMethod}
        </div>
      </div>

      <div style={sectionStyle}>
        <h5 style={{ fontSize: '0.9375rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          Order Summary
        </h5>
        {grouped.map(group => (
          <div key={group.vendor?.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{group.vendor?.name}</div>
            {group.items.map(item => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4, color: 'var(--text-secondary)' }}>
                <span>{item.product.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span><span>₹{totals.subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-secondary)' }}>GST (5%)</span><span>₹{totals.gst.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Delivery</span><span>{totals.delivery === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${totals.delivery}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Platform Fee</span><span>₹{totals.platformFee}</span>
        </div>
        {totals.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
            <span style={{ color: 'var(--success)' }}>Discount</span><span style={{ color: 'var(--success)' }}>-₹{totals.discount.toLocaleString()}</span>
          </div>
        )}
        <hr style={{ border: 'none', borderTop: '2px solid var(--primary)', margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700 }}>
          <span>Grand Total</span><span style={{ color: 'var(--primary)' }}>₹{totals.grand.toLocaleString()}</span>
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 'var(--space-lg)', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} style={{ marginTop: 2 }} />
        <span>
          I agree to the <a href="#" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="#" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>Privacy Policy</a>. I confirm that all order details are correct.
        </span>
      </label>

      <Button block size="lg" onClick={handlePlaceOrder} disabled={!acceptedTerms || placing} loading={placing}>
        {placing ? 'Placing Order...' : `Place Order · ₹${totals.grand.toLocaleString()}`}
      </Button>
    </div>
  )
}
