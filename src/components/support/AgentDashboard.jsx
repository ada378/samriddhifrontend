import { useState, useMemo } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import Badge from '../common/Badge'
import { useApp } from '../../context/AppContext'

const MOCK_TICKETS = [
  { id: 'TCK1001', subject: 'Order not delivered yet', category: 'Order Issue', priority: 'high', status: 'open', date: new Date(Date.now() - 3600000).toISOString(), customer: 'Rajesh Kumar', slaDeadline: new Date(Date.now() + 3600000).toISOString() },
  { id: 'TCK1002', subject: 'Wrong product received', category: 'Return/Refund', priority: 'urgent', status: 'open', date: new Date(Date.now() - 7200000).toISOString(), customer: 'Priya Sharma', slaDeadline: new Date(Date.now() - 3600000).toISOString() },
  { id: 'TCK1003', subject: 'Payment not refunded', category: 'Payment', priority: 'high', status: 'in_progress', date: new Date(Date.now() - 86400000).toISOString(), customer: 'Amit Patel', slaDeadline: new Date(Date.now() + 7200000).toISOString() },
  { id: 'TCK1004', subject: 'Quality concern with salt', category: 'Product Quality', priority: 'medium', status: 'open', date: new Date(Date.now() - 172800000).toISOString(), customer: 'Sunita Devi', slaDeadline: new Date(Date.now() + 86400000).toISOString() },
  { id: 'TCK1005', subject: 'Vendor not responding', category: 'Vendor Complaint', priority: 'low', status: 'resolved', date: new Date(Date.now() - 259200000).toISOString(), customer: 'Vikram Singh', slaDeadline: new Date(Date.now() - 86400000).toISOString() },
]

const QUICK_REPLIES = [
  'Thank you for reaching out. We are looking into your issue and will get back to you shortly.',
  'We apologize for the inconvenience. Our team is working on resolving this at the earliest.',
  'Could you please provide your order ID so we can look into this further?',
  'We have escalated your concern to the relevant team. Please allow 24-48 hours for resolution.',
  'Your refund has been processed and should reflect in your account within 3-5 business days.',
]

const PRIORITY_COLORS = {
  urgent: 'var(--danger)', high: 'var(--warning)', medium: 'var(--info)', low: 'var(--success)',
}

export default function AgentDashboard() {
  const { showToast } = useApp()
  const [tickets] = useState(MOCK_TICKETS)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [internalNote, setInternalNote] = useState('')
  const [notes, setNotes] = useState({})

  const filtered = useMemo(() => {
    let result = tickets
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [tickets, statusFilter, searchQuery])

  const overdue = useMemo(() =>
    tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed' && new Date(t.slaDeadline) < new Date()),
    [tickets],
  )

  const handleQuickReply = (text) => {
    showToast('Quick reply template applied', 'info')
  }

  const handleSaveNote = () => {
    if (!internalNote.trim() || !selectedTicket) return
    setNotes({ ...notes, [selectedTicket.id]: internalNote.trim() })
    setInternalNote('')
    showToast('Internal note saved', 'success')
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Agent Dashboard</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {overdue.length > 0 && (
            <Badge variant="danger">{overdue.length} SLA Alerts</Badge>
          )}
          <Badge variant="primary">{tickets.filter(t => t.status === 'open').length} Open</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-xl)' }}>
        <div>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="input-group">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Order ID / Phone / Email" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 'var(--space-lg)' }}>
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 'var(--radius-md)',
                border: 'none', background: statusFilter === s ? 'var(--primary-light)' : 'transparent',
                color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: statusFilter === s ? 600 : 400, fontSize: '0.875rem',
                cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all var(--transition-fast)',
              }}>
                {s === 'all' ? 'All Tickets' : s.replace('_', ' ')}
                <span style={{ float: 'right', fontSize: '0.75rem', opacity: 0.7 }}>
                  {s === 'all' ? tickets.length : tickets.filter(t => t.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {overdue.length > 0 && (
            <Card padding="var(--space-md)">
              <h5 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--danger)', marginBottom: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                SLA Overdue ({overdue.length})
              </h5>
              {overdue.map(t => (
                <div key={t.id} style={{ fontSize: '0.75rem', padding: '4px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: 500 }}>{t.id}</span> - {t.customer}
                </div>
              ))}
            </Card>
          )}
        </div>

        <div>
          {selectedTicket ? (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setSelectedTicket(null)} style={{
                      border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                      color: 'var(--text-secondary)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    </button>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedTicket.subject}</h4>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0', marginLeft: 24 }}>
                    {selectedTicket.id} by {selectedTicket.customer}
                  </p>
                </div>
                <Badge variant={selectedTicket.priority === 'urgent' ? 'danger' : selectedTicket.priority === 'high' ? 'warning' : 'info'}>
                  {selectedTicket.priority}
                </Badge>
              </div>

              <div style={{
                padding: 'var(--space-md)', background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-lg)', fontSize: '0.875rem', color: 'var(--text-secondary)',
              }}>
                Ticket category: {selectedTicket.category} | Status: {selectedTicket.status}
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Quick Reply Templates</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {QUICK_REPLIES.map((r, i) => (
                    <button key={i} onClick={() => handleQuickReply(r)} style={{
                      textAlign: 'left', padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'var(--bg-white)',
                      fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}>
                      {r.slice(0, 60)}...
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Internal Notes <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.75rem' }}>(not visible to customer)</span>
                </label>
                <textarea value={internalNote} onChange={e => setInternalNote(e.target.value)} rows={3} placeholder="Add internal notes..." style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border)', fontSize: '0.875rem', outline: 'none',
                  resize: 'vertical', marginBottom: 8,
                }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="primary" size="sm" onClick={handleSaveNote}>Save Note</Button>
                  {notes[selectedTicket.id] && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center' }}>Note saved</span>
                  )}
                </div>
                {notes[selectedTicket.id] && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600, display: 'block', marginBottom: 2, color: 'var(--warning)' }}>Internal Note:</span>
                    {notes[selectedTicket.id]}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="primary" size="sm" onClick={() => showToast('Status updated to In Progress', 'success')}>Mark In Progress</Button>
                <Button variant="success" size="sm" onClick={() => showToast('Ticket resolved', 'success')}>Resolve</Button>
                <Button variant="ghost" size="sm" onClick={() => showToast('Ticket closed', 'info')}>Close</Button>
              </div>
            </Card>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                  {statusFilter === 'all' ? 'All Tickets' : statusFilter.replace('_', ' ')} ({filtered.length})
                </span>
              </div>

              {filtered.map(ticket => {
                const isOverdue = new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'resolved' && ticket.status !== 'closed'
                return (
                  <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} style={{
                    padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-sm)',
                    background: isOverdue ? 'var(--danger-light)' : 'var(--bg-white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid ' + (isOverdue ? 'var(--danger)' : 'var(--border)'),
                    cursor: 'pointer', transition: 'all var(--transition-base)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: PRIORITY_COLORS[ticket.priority] }} />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{ticket.subject}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {isOverdue && <Badge variant="danger">SLA</Badge>}
                        <Badge variant={ticket.status === 'open' ? 'warning' : ticket.status === 'in_progress' ? 'info' : 'success'}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{ticket.id} - {ticket.customer}</span>
                      <span>{ticket.category}</span>
                    </div>
                  </div>
                )
              })}

              {filtered.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">✅</div>
                  <div className="empty-state-title">All caught up</div>
                  <div className="empty-state-text">No tickets match the current filter.</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
