import Icon from '../../components/common/Icons'

const STEPS = [
  { num: 1, label: 'Address', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { num: 2, label: 'Delivery', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
  { num: 3, label: 'Payment', icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M9 12l2 2 4-4' },
  { num: 4, label: 'Review', icon: 'M9 12l2 2 4-4 M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
]

export default function CheckoutSteps({ currentStep = 1 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-2xl) 0', gap: 0,
    }}>
      <div className="checkout-steps" style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 640 }}>
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.num
          const isActive = currentStep === step.num
          const isPending = currentStep < step.num

          return (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.875rem',
                  background: isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--bg-gray)',
                  color: isPending ? 'var(--text-muted)' : 'var(--text-light)',
                  border: isPending ? '2px solid var(--border)' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                }}>
                  {isCompleted ? (
<Icon name="check" size={18} />
                  ) : (
                    step.num
                  )}
                </div>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 600, textAlign: 'center',
                  color: isActive ? 'var(--primary)' : isCompleted ? 'var(--success)' : 'var(--text-muted)',
                  transition: 'color 0.3s ease',
                }}>{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 3, margin: '0 12px', borderRadius: 2, marginBottom: 24,
                  background: isCompleted ? 'var(--success)' : 'var(--border)',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-steps {
            max-width: 100% !important;
            padding: 0 var(--space-md);
          }
          .checkout-steps > div {
            flex-direction: column;
            align-items: center;
          }
          .checkout-steps > div > div:last-child {
            width: 3px !important;
            height: 24px !important;
            margin: 8px 0 !important;
          }
        }
        @media (max-width: 480px) {
          .checkout-steps > div > div:first-child > div:first-child {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  )
}
