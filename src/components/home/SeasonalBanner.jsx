import Icon from '../common/Icons'
import Button from '../common/Button'

export default function SeasonalBanner() {
  return (
    <section className="seasonal-banner">
      <div className="seasonal-bg-pattern" />
      <div className="container seasonal-content">
        <span className="seasonal-tag">
          <Icon name="gift" size={20} /> Festive Season Special
        </span>
        <h2 className="seasonal-title">
          Diwali & Navratri Mega Sale!
        </h2>
        <p className="seasonal-text">
          Exclusive festival discounts on premium salts. Free shipping on orders above ₹500. Use code <strong className="seasonal-code">FESTIVE20</strong>
        </p>
        <Button className="seasonal-btn">
          <Icon name="arrowRight" size={18} />
          Grab the Deal
        </Button>
      </div>
      <style>{`
        .seasonal-banner {
          background: linear-gradient(135deg, #2e6a40 0%, #3d8b4f 30%, #d4ac69 70%, #c49a52 100%);
          padding: 48px 0;
          position: relative;
          overflow: hidden;
        }
        .seasonal-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.08;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        .seasonal-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }
        .seasonal-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.2);
          padding: 4px 16px;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 16px;
          backdrop-filter: blur(4px);
        }
        .seasonal-title {
          color: #fff;
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          font-weight: 800;
          margin-bottom: 12px;
        }
        .seasonal-text {
          color: rgba(255,255,255,0.9);
          font-size: 1rem;
          margin-bottom: 24px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .seasonal-code {
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .seasonal-btn {
          background: var(--accent) !important;
          color: var(--text-primary) !important;
          border-color: var(--accent) !important;
          font-weight: 700 !important;
        }
        .seasonal-btn:hover {
          background: #c49a52 !important;
          border-color: #c49a52 !important;
        }

        @media (max-width: 480px) {
          .seasonal-banner { padding: 32px 0 !important; }
          .seasonal-title { font-size: clamp(1.125rem, 5vw, 1.5rem) !important; }
          .seasonal-text { font-size: 0.875rem !important; }
        }
      `}</style>
    </section>
  )
}
