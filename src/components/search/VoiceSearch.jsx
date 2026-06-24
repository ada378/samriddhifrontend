import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Icon from '../../components/common/Icons'

export default function VoiceSearch() {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [products, setProducts] = useState([])
  const recognitionRef = useRef(null)
  const navigate = useNavigate()
  const { showToast } = useApp()

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  const isSupported = useCallback(() => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported()) {
      setSupported(false)
      showToast('Voice search is not available in this browser', 'warning')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN, en-IN'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setListening(true)
      setTranscript('')
    }

    recognition.onresult = (event) => {
      const current = event.results[event.results.length - 1]
      const text = current[0].transcript
      setTranscript(text)
    }

    recognition.onerror = () => {
      setListening(false)
      showToast('Voice search failed. Please try again.', 'error')
    }

    recognition.onend = () => {
      setListening(false)
      if (transcript) {
        const match = products.find(p =>
          p.name.toLowerCase().includes(transcript.toLowerCase()) ||
          p.category.toLowerCase().includes(transcript.toLowerCase())
        )
        if (match) {
          navigate(`/products/${match.slug}`)
        } else {
          navigate(`/products?search=${encodeURIComponent(transcript)}`)
        }
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isSupported, navigate, showToast, transcript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setListening(false)
  }, [])

  if (!supported) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={listening ? stopListening : startListening}
        style={{
          width: 44, height: 44, borderRadius: 'var(--radius-full)',
          border: listening ? '2px solid var(--primary)' : '1px solid var(--border)',
          background: listening ? 'var(--primary-light)' : 'var(--bg-white)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', position: 'relative',
        }}
        aria-label={listening ? 'Stop voice search' : 'Start voice search'}
        title="Search by voice in Hindi and English"
      >
        <Icon name="mic" size={20} color={listening ? 'var(--primary)' : 'var(--text-secondary)'} />
      </button>

      {listening && (
        <>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 56, height: 56, borderRadius: '50%',
            border: '2px solid var(--primary)',
            animation: 'voice-pulse 1.2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          {transcript && (
            <div style={{
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--bg-white)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '4px 12px',
              fontSize: '0.75rem', whiteSpace: 'nowrap', marginTop: 8,
              boxShadow: 'var(--shadow-md)',
            }}>
              {transcript}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes voice-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.2; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
