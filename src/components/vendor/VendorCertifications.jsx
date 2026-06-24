import Badge from '../common/Badge'
import Icon, { vendorCertIcons } from '../../components/common/Icons'

export default function VendorCertifications({ certifications = [] }) {
  if (certifications.length === 0) return null

  return (
    <div>
      <h4 style={{ fontSize: '1rem', marginBottom: 12 }}>Certifications</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {certifications.map((cert, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-white)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: 'var(--success-light)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0,
            }}>
              {(() => { const CertIcon = vendorCertIcons[cert]; return CertIcon ? <CertIcon size={16} /> : <Icon name="fileText" size={16} /> })()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: 600, fontSize: '0.8125rem', display: 'block' }}>{cert}</span>
              <Badge variant="soft-success" style={{ fontSize: '0.625rem', marginTop: 2 }}>
                <Icon name="check" size={10} />
                Verified
              </Badge>
            </div>
            <button style={{
              padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-gray)', cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 500,
              color: 'var(--text-secondary)', whiteSpace: 'nowrap',
            }}>
              View Doc
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
