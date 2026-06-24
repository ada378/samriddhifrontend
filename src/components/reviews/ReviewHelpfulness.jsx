import { useState } from 'react'
import Icon from '../../components/common/Icons'

export default function ReviewHelpfulness({ reviewId, initialLikes = 0, onVote }) {
  const [vote, setVote] = useState(null)
  const [likes, setLikes] = useState(initialLikes)

  const handleVote = (type) => {
    if (vote === type) {
      setVote(null)
      setLikes(prev => type === 'up' ? prev - 1 : prev)
    } else {
      if (vote === 'up') setLikes(prev => prev - 1)
      setVote(type)
      setLikes(prev => type === 'up' ? prev + 1 : prev)
    }
    if (onVote) onVote(reviewId, type)
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 4 }}>Was this helpful?</span>
      <button onClick={() => handleVote('up')} style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 8px', borderRadius: 'var(--radius-sm)',
        border: '1px solid', fontSize: '0.75rem', cursor: 'pointer',
        borderColor: vote === 'up' ? 'var(--primary)' : 'var(--border)',
        background: vote === 'up' ? 'var(--primary-light)' : 'transparent',
        color: vote === 'up' ? 'var(--primary)' : 'var(--text-secondary)',
        transition: 'all var(--transition-fast)',
      }}>
        <Icon name="thumbsUp" size={14} />
        Yes
      </button>
      <button onClick={() => handleVote('down')} style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 8px', borderRadius: 'var(--radius-sm)',
        border: '1px solid', fontSize: '0.75rem', cursor: 'pointer',
        borderColor: vote === 'down' ? 'var(--danger)' : 'var(--border)',
        background: vote === 'down' ? 'var(--danger-light)' : 'transparent',
        color: vote === 'down' ? 'var(--danger)' : 'var(--text-secondary)',
        transition: 'all var(--transition-fast)',
      }}>
        <Icon name="thumbsDown" size={14} />
        No
      </button>
      {likes > 0 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({likes})</span>
      )}
    </div>
  )
}
