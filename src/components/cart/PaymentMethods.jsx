import Icon from '../../components/common/Icons'

const METHODS = [
  {
    id: 'razorpay', label: 'Razorpay (UPI, Card, Net Banking)', icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M9 12l2 2 4-4',
  },
  {
    id: 'cod', label: 'Cash on Delivery', icon: 'M12 2a10 10 0 1 0 10 10h-10V2z',
  },
]

export default function PaymentMethods({ selectedMethod, onSelect }) {
  return (
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>Select Payment Method</h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--success-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
        <Icon name="creditCard" size={16} color="var(--success)" />
        <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>100% Secure Payment · SSL Encrypted</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {METHODS.map(method => {
          const isSelected = selectedMethod === method.id
          return (
            <label key={method.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              background: isSelected ? 'var(--primary-light)' : 'var(--bg-white)',
              transition: 'border-color 0.15s',
            }}>
              <input type="radio" name="payment" value={method.id} checked={isSelected} onChange={() => onSelect && onSelect(method.id)} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isSelected ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round">
                <path d={method.icon} />
              </svg>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '0.875rem' }}>{method.label}</span>
              {isSelected && <Icon name="check" size={18} color="var(--primary)" />}
            </label>
          )
        })}
      </div>
    </div>
  )
}
