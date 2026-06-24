import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'
import Icon from '../../components/common/Icons'
import api from '../../api'

export default function LoginPage() {
  const { setUser, showToast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('email')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [otpEmail, setOtpEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef([])
  const timerRef = useRef(null)

  const validateEmail = () => {
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    if (!validateEmail()) return
    setLoading(true)
    try {
      const res = await api.login(email, password)
      const userData = { ...res.data.user, token: res.data.token }
      setUser(userData)
      showToast(`Welcome back, ${userData.name}!`, 'success')
      if (userData.role === 'admin') navigate('/admin')
      else if (userData.role === 'vendor') navigate('/vendor')
      else navigate('/')
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error')
    }
    setLoading(false)
  }

  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(otpEmail)) {
      setErrors({ otpEmail: 'Enter a valid email address' })
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await api.sendOtp(otpEmail)
      setOtpSent(true)
      setCountdown(30)
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); return 0 }
          return prev - 1
        })
      }, 1000)
      showToast('OTP sent to ' + otpEmail, 'info')
    } catch (err) {
      showToast(err.message || 'Failed to send OTP', 'error')
    }
    setLoading(false)
  }

  const handleOtpChange = useCallback((index, value) => {
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus()
    }
    if (newOtp.every(d => d !== '') && index === 5) {
      handleVerifyOtp(newOtp.join(''))
    }
  }, [otp])

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus()
    }
  }

  const handleVerifyOtp = async (otpValue) => {
    setLoading(true)
    try {
      const res = await api.verifyOtp(otpEmail, otpValue)
      const userData = { ...res.data.user, token: res.data.token }
      setUser(userData)
      showToast('Login successful!', 'success')
      navigate('/')
    } catch (err) {
      showToast(err.message || 'Invalid OTP. Please try again.', 'error')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    }
    setLoading(false)
  }

  const handlePasteOtp = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length === 6) {
      const newOtp = paste.split('')
      setOtp(newOtp)
      otpRefs.current[5]?.focus()
      handleVerifyOtp(paste)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
    fontSize: '0.9375rem', outline: 'none', transition: 'border-color 0.2s', background: 'var(--bg-white)',
  }

  const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }
  const errorStyle = { fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }
  const divider = { display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }
  const socialBtn = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-white)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500, transition: 'background 0.15s' }

  return (
    <div style={{ minHeight: 'calc(100vh - var(--header-height) - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 6px' }}>{tab === 'email' ? 'Welcome Back' : 'Login with OTP'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Sign in to your Samriddhi account</p>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 24 }}>
          {['email', 'email-otp'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErrors({}); setOtp(['', '', '', '', '', '']); setOtpSent(false) }} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
              fontSize: '0.875rem', background: tab === t ? 'var(--bg-white)' : 'transparent',
              color: tab === t ? 'var(--primary)' : 'var(--text-muted)', boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>{t === 'email' ? 'Email & Password' : 'Email OTP'}</button>
          ))}
        </div>

        {tab === 'email' ? (
          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer' }}>
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
              {errors.password && <div style={errorStyle}>{errors.password}</div>}
            </div>
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <Button type="submit" variant="primary" fullWidth disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" value={otpEmail} onChange={e => setOtpEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  {errors.otpEmail && <div style={errorStyle}>{errors.otpEmail}</div>}
                </div>
                <Button onClick={handleSendOtp} variant="primary" fullWidth disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</Button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 20 }}>Enter OTP sent to <strong>{otpEmail}</strong></p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }} onPaste={handlePasteOtp}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={el => otpRefs.current[i] = el} type="text" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)}
                      style={{ width: 44, height: 48, textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', outline: 'none' }}
                    />
                  ))}
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : <button onClick={handleSendOtp} style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>Resend OTP</button>}
                </div>
              </div>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </p>

      </div>
    </div>
  )
}
