import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('email')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const passwordStrength = useMemo(() => {
    const p = newPassword
    if (!p) return { level: 0, label: '', color: 'var(--border)' }
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[a-z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 2) return { level: 1, label: 'Weak', color: 'var(--danger)' }
    if (score <= 3) return { level: 2, label: 'Fair', color: 'var(--warning)' }
    if (score <= 4) return { level: 3, label: 'Good', color: 'var(--info)' }
    return { level: 4, label: 'Strong', color: 'var(--success)' }
  }, [newPassword])

  const handleSend = () => {
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      setErrors({ contact: 'Enter a valid email address' })
      return
    }
    if (method === 'phone' && !/^[6-9]\d{9}$/.test(contact)) {
      setErrors({ contact: 'Enter a valid 10-digit mobile number' })
      return
    }
    setErrors({})
    setStep(2)
  }

  const handleVerifyOtp = () => {
    if (otp.some(d => !d)) return
    if (otp.join('') === '123456') {
      setStep(3)
      setOtp(['', '', '', '', '', ''])
    } else {
      setErrors({ otp: 'Invalid OTP' })
    }
  }

  const handleReset = () => {
    const e = {}
    if (!newPassword) e.newPassword = 'Password is required'
    else if (newPassword.length < 6) e.newPassword = 'Minimum 6 characters'
    else if (!/[A-Z]/.test(newPassword)) e.newPassword = 'Need an uppercase letter'
    else if (!/[0-9]/.test(newPassword)) e.newPassword = 'Need a number'
    if (newPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    if (Object.keys(e).length > 0) return
    setStep(4)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.9375rem',
    transition: 'border-color 0.15s',
  }

  if (step === 4) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon name="check" size={32} color="var(--success)" />
        </div>
        <h3 style={{ marginBottom: 8 }}>Password Reset Successfully!</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: 'var(--space-2xl)' }}>
          Your password has been updated. You can now log in with your new password.
        </p>
        <Link to="/login">
          <Button icon={<Icon name="arrowLeft" size={16} />}>Back to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 440, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <Icon name="lock" size={48} color="var(--primary)" style={{ marginBottom: 12 }} />
        <h3>Forgot Password</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          {step === 1 ? 'Enter your email or phone to reset your password' : step === 2 ? 'Enter the OTP sent to your registered contact' : 'Create a new password'}
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 'var(--space-xl)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              width: 32, height: 4, borderRadius: 2,
              background: i <= step ? 'var(--primary)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-lg)' }}>
            <button onClick={() => setMethod('email')} style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
              border: `2px solid ${method === 'email' ? 'var(--primary)' : 'var(--border)'}`,
              background: method === 'email' ? 'var(--primary-light)' : 'var(--bg-white)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              color: method === 'email' ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>
              <Icon name="mail" size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Email
            </button>
            <button onClick={() => setMethod('phone')} style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
              border: `2px solid ${method === 'phone' ? 'var(--primary)' : 'var(--border)'}`,
              background: method === 'phone' ? 'var(--primary-light)' : 'var(--bg-white)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              color: method === 'phone' ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>
              <Icon name="phone" size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Phone
            </button>
          </div>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              {method === 'email' ? 'Email Address' : 'Mobile Number'}
            </label>
            {method === 'email' ? (
              <input type="email" style={inputStyle} placeholder="you@example.com" value={contact} onChange={e => setContact(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            ) : (
              <div style={{ display: 'flex' }}>
                <span style={{ ...inputStyle, width: 'auto', borderRight: 'none', background: 'var(--bg-gray)', display: 'flex', alignItems: 'center', paddingRight: 8, fontWeight: 600, color: 'var(--text-secondary)' }}>+91</span>
                <input type="tel" style={{ ...inputStyle, borderLeft: 'none', flex: 1 }} placeholder="98765 43210" value={contact} onChange={e => setContact(e.target.value.replace(/\D/g, '').slice(0, 10))} />
              </div>
            )}
            {errors.contact && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.contact}</span>}
          </div>
          <Button block size="lg" onClick={handleSend}>Send Reset {method === 'email' ? 'Link' : 'OTP'}</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            Enter the 6-digit code sent to<br /><strong>{method === 'email' ? contact : `+91 ${contact}`}</strong>
          </p>
          <div className="otp-input" style={{ marginBottom: 'var(--space-lg)' }}>
            {otp.map((d, i) => (
              <input key={i} type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '')
                  const newOtp = [...otp]; newOtp[i] = v; setOtp(newOtp)
                  if (v && i < 5) document.activeElement?.nextElementSibling?.focus()
                }}
                onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) document.activeElement?.previousElementSibling?.focus() }}
                className={d ? 'filled' : ''} />
            ))}
          </div>
          {errors.otp && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>{errors.otp}</span>}
          <Button block size="lg" onClick={handleVerifyOtp} disabled={otp.some(d => !d)}>Verify OTP</Button>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
            <button onClick={() => { setStep(1); setContact('') }} style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer' }}>Change email/phone</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 44 }} placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>}
                </svg>
              </button>
            </div>
            {newPassword && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= passwordStrength.level ? passwordStrength.color : 'var(--border)' }} />)}
                </div>
                <span style={{ fontSize: '0.75rem', color: passwordStrength.color, fontWeight: 600 }}>{passwordStrength.label}</span>
              </div>
            )}
            {errors.newPassword && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.newPassword}</span>}
          </div>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm New Password</label>
            <input type="password" style={inputStyle} placeholder="Re-enter new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            {errors.confirmPassword && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.confirmPassword}</span>}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
            Password must have: minimum 6 characters, at least one uppercase letter, and at least one number.
          </div>
          <Button block size="lg" onClick={handleReset}>Reset Password</Button>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
        <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Back to Login</Link>
      </div>
    </div>
  )
}
