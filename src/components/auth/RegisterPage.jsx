import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'
import api from '../../api'

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']

export default function RegisterPage() {
  const { setUser, showToast } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState('form')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(0)

  const [form, setForm] = useState({
    name: '', mobile: '', email: '', password: '', confirmPassword: '',
    businessName: '', state: '', role: 'buyer', agreeTerms: false,
  })
  const [errors, setErrors] = useState({})

  const passwordStrength = useMemo(() => {
    const p = form.password
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
  }, [form.password])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await api.sendOtp(form.email)
      setStep('otp')
      setCountdown(30)
      const timer = setInterval(() => {
        setCountdown(prev => { if (prev <= 1) { clearInterval(timer); return 0 } return prev - 1 })
      }, 1000)
      showToast('OTP sent to ' + form.email, 'info')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length !== 6) return
    try {
      const res = await api.verifyOtp(form.email, code, {
        name: form.name, phone: form.mobile,
        role: form.role, businessName: form.businessName, state: form.state,
      })
      setUser(res.data.user)
      showToast('Account created successfully! Welcome to Samriddhi!', 'success')
      navigate('/')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.9375rem',
    transition: 'border-color 0.15s',
  }

  if (step === 'otp') {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 440, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h3>Verify Your Email</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Enter the OTP sent to <strong>{form.email}</strong>
          </p>
        </div>
        <div className="otp-input" style={{ marginBottom: 'var(--space-lg)' }}>
          {otp.map((d, i) => (
            <input key={i} type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '')
                const newOtp = [...otp]; newOtp[i] = v; setOtp(newOtp)
                if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
              }}
              onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) document.getElementById(`otp-${i - 1}`)?.focus() }}
              id={`otp-${i}`} className={d ? 'filled' : ''} />
          ))}
        </div>
        {countdown > 0 ? (
          <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
            Resend in <strong>{countdown}s</strong>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            <button onClick={() => { showToast('OTP resent!', 'info'); setCountdown(30) }} style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Resend OTP
            </button>
          </div>
        )}
        <Button block size="lg" onClick={handleVerifyOtp} disabled={otp.some(d => !d)}>Verify & Create Account</Button>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <button onClick={() => setStep('form')} style={{ fontSize: '0.8125rem', color: 'var(--text-link)', background: 'none', border: 'none', cursor: 'pointer' }}>Back to form</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-5xl)', paddingBottom: 'var(--space-5xl)', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <Icon name="mdSalt" size={40} color="var(--primary)" />
        <h2 style={{ marginTop: 8 }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Join the Samriddhi marketplace</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name *</label>
          <input style={inputStyle} placeholder="Rajesh Kumar" value={form.name} onChange={e => handleChange('name', e.target.value)} />
          {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.name}</span>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Mobile Number *</label>
          <div style={{ display: 'flex' }}>
            <span style={{ ...inputStyle, width: 'auto', borderRight: 'none', background: 'var(--bg-gray)', display: 'flex', alignItems: 'center', paddingRight: 8, fontWeight: 600, color: 'var(--text-secondary)' }}>+91</span>
            <input type="tel" style={{ ...inputStyle, borderLeft: 'none', flex: 1 }} placeholder="98765 43210" value={form.mobile} onChange={e => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
          </div>
          {errors.mobile && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.mobile}</span>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address *</label>
          <input type="email" style={inputStyle} placeholder="rajesh@example.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
          {errors.email && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.email}</span>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Password *</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 44 }} placeholder="Create a strong password" value={form.password} onChange={e => handleChange('password', e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showPassword ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>}
              </svg>
            </button>
          </div>
          {form.password && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= passwordStrength.level ? passwordStrength.color : 'var(--border)', transition: 'all 0.3s' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: passwordStrength.color, fontWeight: 600 }}>{passwordStrength.label}</span>
            </div>
          )}
          {errors.password && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.password}</span>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm Password *</label>
          <div style={{ position: 'relative' }}>
            <input type={showConfirm ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 44 }} placeholder="Re-enter password" value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showConfirm ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>}
              </svg>
            </button>
          </div>
          {errors.confirmPassword && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errors.confirmPassword}</span>}
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Business Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <input style={inputStyle} placeholder="Your business name" value={form.businessName} onChange={e => handleChange('businessName', e.target.value)} />
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>State <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <select style={inputStyle} value={form.state} onChange={e => handleChange('state', e.target.value)}>
            <option value="">Select State</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Register as</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `2px solid ${form.role === 'buyer' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: form.role === 'buyer' ? 'var(--primary-light)' : 'transparent', transition: 'all 0.15s' }}>
              <input type="radio" name="role" value="buyer" checked={form.role === 'buyer'} onChange={() => handleChange('role', 'buyer')} style={{ accentColor: 'var(--primary)' }} />
              <div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Buyer</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shop for salt products</div></div>
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: `2px solid ${form.role === 'vendor' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: form.role === 'vendor' ? 'var(--primary-light)' : 'transparent', transition: 'all 0.15s' }}>
              <input type="radio" name="role" value="vendor" checked={form.role === 'vendor'} onChange={() => handleChange('role', 'vendor')} style={{ accentColor: 'var(--primary)' }} />
              <div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Vendor</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sell your products</div></div>
            </label>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 'var(--space-lg)', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <input type="checkbox" checked={form.agreeTerms} onChange={e => handleChange('agreeTerms', e.target.checked)} style={{ marginTop: 2 }} />
          <span>I agree to the <a href="#" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--text-link)', textDecoration: 'underline' }}>Privacy Policy</a></span>
        </label>
        {errors.agreeTerms && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', marginBottom: 'var(--space-lg)' }}>{errors.agreeTerms}</span>}

        <Button block size="lg" type="submit">Create Account</Button>
      </form>

      <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
