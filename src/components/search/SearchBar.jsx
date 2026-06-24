import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import api from '../../api'
import Icon from '../../components/common/Icons'

export default function SearchBar({ onClose }) {
  const { searchQuery, setSearch } = useApp()
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const wrapperRef = useRef(null)

  useEffect(() => {
    api.products()
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setSearch(val)
    if (val.length >= 1) {
      setSuggestions(products.filter(p =>
        p.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelect = (product) => {
    setSearch('')
    setShowSuggestions(false)
    navigate(`/products/${product.slug}`)
    onClose?.()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSuggestions(false)
      onClose?.()
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <form className="input-group" onSubmit={handleSubmit}>
        <span className="input-icon">
          <Icon name="search" size={18} />
        </span>
        <input
          type="text"
          placeholder="Search salts, vendors..."
          value={searchQuery}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        {searchQuery && (
          <button type="button" onClick={() => { setSearch(''); setSuggestions([]) }} style={{ border: 'none', background: 'none', padding: '0 12px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <Icon name="close" size={18} />
          </button>
        )}
      </form>
      {showSuggestions && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-white)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
          zIndex: 100, maxHeight: 300, overflowY: 'auto', marginTop: 4,
        }}>
          {suggestions.map(p => (
            <button key={p.id} type="button" onClick={() => handleSelect(p)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.875rem', textAlign: 'left', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-gray)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span>{p.name}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: 12, flexShrink: 0 }}>₹{p.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
