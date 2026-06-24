import Icon from '../common/Icons'
import Button from '../common/Button'

export default function SeasonalBanner() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #E8B830 0%, #F5D78B 30%, #CC0C2C 70%, #A80923 100%)',
      padding: '48px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\' fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        opacity: 0.5,
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600, color: '#fff', marginBottom: 16, backdropFilter: 'blur(4px)' }}>
          <Icon name="gift" size={20} /> Festive Season Special
        </span>
        <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: 12 }}>
          Diwali & Navratri Mega Sale!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
          Exclusive festival discounts on premium salts. Free shipping on orders above ₹500. Use code <strong style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 4 }}>FESTIVE20</strong>
        </p>
        <Button variant="accent" size="lg">
          <Icon name="arrowRight" size={18} />
          Grab the Deal
        </Button>
      </div>
    </section>
  )
}
