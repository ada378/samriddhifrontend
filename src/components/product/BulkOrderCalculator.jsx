import { useState, useMemo } from 'react'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

const GST_RATE = 0.05
const RETAIL_PRICE_MULTIPLIER = 1.3

export default function BulkOrderCalculator({ basePrice, unit = 'kg', moq = 10 }) {
  const [quantity, setQuantity] = useState(moq)

  const calculation = useMemo(() => {
    const qty = Math.max(quantity, moq)
    const subtotal = basePrice * qty
    const gst = subtotal * GST_RATE
    const total = subtotal + gst
    const retailPrice = basePrice * RETAIL_PRICE_MULTIPLIER
    const savings = (retailPrice - basePrice) * qty
    const deliveryEstimate = qty <= 50 ? '2-3 days' : qty <= 200 ? '3-5 days' : '5-7 days'
    return { subtotal, gst, total, retailPrice, savings, deliveryEstimate, qty }
  }, [quantity, basePrice, moq])

  return (
    <div style={{ background: 'var(--bg-gray)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
      <h4 style={{ fontSize: '1rem', marginBottom: 16 }}>Bulk Order Calculator</h4>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
          Quantity ({unit})
        </label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="range"
            min={moq}
            max={1000}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--primary)' }}
          />
          <div className="quantity-stepper">
            <button onClick={() => setQuantity(q => Math.max(moq, q - 10))} disabled={quantity <= moq}>−</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(moq, Number(e.target.value) || moq))}
              min={moq}
              style={{ width: 64 }}
            />
            <button onClick={() => setQuantity(q => q + 10)}>+</button>
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MOQ: {moq} {unit}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Subtotal', value: `₹${calculation.subtotal.toFixed(2)}` },
          { label: 'GST (5%)', value: `₹${calculation.gst.toFixed(2)}` },
          { label: 'Total Amount', value: `₹${calculation.total.toFixed(2)}`, highlight: true },
          { label: 'Savings vs Retail', value: `₹${calculation.savings.toFixed(2)}`, highlight: true },
        ].map((item, i) => (
          <div key={i} style={{
            padding: 12,
            background: item.highlight ? 'var(--primary-light)' : 'var(--bg-white)',
            borderRadius: 'var(--radius-md)',
            border: item.highlight ? '1px solid var(--primary)' : '1px solid var(--border)',
          }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>{item.label}</span>
            <span style={{
              fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
              color: item.highlight ? 'var(--primary)' : 'var(--text-primary)',
            }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Estimated Delivery: <strong>{calculation.deliveryEstimate}</strong>
        </span>
        <Button size="sm">
          <Icon name="cart" size={14} />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
