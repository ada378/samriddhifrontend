import { useState } from 'react'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

const OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', eta: '3-7 business days', price: 0, icon: 'M3 3h18v18H3z M21 9H3 M21 15H3' },
  { id: 'express', label: 'Express Delivery', eta: '1-2 business days', price: 49, icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { id: 'pickup', label: 'Warehouse Pickup', eta: 'Collect from warehouse', price: 0, icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
]

export default function DeliveryOptions({ vendorGroups = [], selectedOptions, onSelect, pincode: initialPincode }) {
  const [pincode, setPincode] = useState(initialPincode || '')
  const [serviceable, setServiceable] = useState(true)
  const [showPincodeInput, setShowPincodeInput] = useState(!initialPincode)

  const handleCheckPincode = () => {
    if (/^\d{6}$/.test(pincode)) {
      setServiceable(true)
      setShowPincodeInput(false)
    } else {
      setServiceable(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h4 style={{ fontSize: '1rem' }}>Delivery Options</h4>
        <button onClick={() => setShowPincodeInput(true)} style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Change pincode
        </button>
      </div>

      {showPincodeInput && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-lg)' }}>
          <input
            type="text"
            value={pincode}
            onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter delivery pincode"
            style={{
              flex: 1, padding: '10px 14px', border: '2px solid var(--border)',
              borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.875rem',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <Button size="sm" onClick={handleCheckPincode}>Check</Button>
        </div>
      )}

      {!serviceable && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
          <Icon name="close" size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          We don't deliver to this pincode yet. Try a different pincode.
        </div>
      )}

      {vendorGroups.map(group => {
        const vendor = group.vendor
        const selected = selectedOptions[group.vendor?.id] || 'standard'
        return (
          <div key={vendor?.id} style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-sm)', background: vendor?.banner || 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>{vendor?.logo?.charAt(0) || '?'}</div>
              {vendor?.name}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {OPTIONS.map(opt => (
                <label key={opt.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  border: `2px solid ${selected === opt.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: selected === opt.id ? 'var(--primary-light)' : 'var(--bg-white)',
                  transition: 'all 0.15s',
                }}>
                  <input type="radio" name={`delivery_${vendor?.id}`} value={opt.id} checked={selected === opt.id} onChange={() => onSelect && onSelect(vendor?.id, opt.id)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selected === opt.id ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round">
                        <path d={opt.icon} />
                      </svg>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{opt.label}</span>
                      {opt.price === 0 && <span className="badge badge-soft-success">Free</span>}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>{opt.eta}</div>
                  </div>
                  {opt.price > 0 && <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>₹{opt.price}</span>}
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
