import { useState, useMemo } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import Badge from '../common/Badge'
import { useApp } from '../../context/AppContext'

const CATEGORIES = [
  'Order Issue', 'Payment', 'Vendor Complaint', 'Product Quality',
  'Return/Refund', 'Account Access', 'Others',
]

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'var(--success)' },
  { value: 'medium', label: 'Medium', color: 'var(--warning)' },
  { value: 'high', label: 'High', color: 'var(--danger)' },
  { value: 'urgent', label: 'Urgent', color: 'var(--primary)' },
]

const STATUS_BADGE = {
  open: { variant: 'warning', label: 'Open' },
  in_progress: { variant: 'info', label: 'In Progress' },
  resolved: { variant: 'success', label: 'Resolved' },
  closed: { variant: 'soft-danger', label: 'Closed' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function TicketManagement() {
  const { user, showToast } = useApp()
  const [tickets, setTickets] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [viewingTicket, setViewingTicket] = useState(null)
  const [reply, setReply] = useState('')
  const [form, setForm] = useState({ subject: '', category: '', description: '', priority: 'medium', attachment: null })
  const [errors, setErrors] = useState({})

  const handleCreate = () => {
    const errs = {}
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.category) errs.category = 'Select a category'
    if (!form.description.trim()) errs.description = 'Description is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const ticket = {
      id: 'TCK' + Date.now(),
      subject: form.subject.trim(),
      category: form.category,
      description: form.description.trim(),
      priority: form.priority,
      status: 'open',
      date: new Date().toISOString(),
      messages: [
        { id: 'msg1', sender: 'buyer', text: form.description.trim(), time: new Date().toISOString() },
      ],
      assignedAgent: null,
      slaDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    }
    setTickets([ticket, ...tickets])
    setShowCreate(false)
    setForm({ subject: '', category: '', description: '', priority: 'medium', attachment: null })
    showToast('Ticket created successfully', 'success')
  }

  const handleReply = () => {
    if (!reply.trim() || !viewingTicket) return
    const updated = tickets.map(t => {
      if (t.id === viewingTicket.id) {
        return {
          ...t,
          status: t.status === 'open' ? 'in_progress' : t.status,
          messages: [...t.messages, { id: 'msg' + Date.now(), sender: 'buyer', text: reply.trim(), time: new Date().toISOString() }],
        }
      }
      return t
    })
    setTickets(updated)
    setViewingTicket(updated.find(t => t.id === viewingTicket.id))
    setReply('')
    showToast('Reply added', 'success')
  }

  const handleCloseTicket = (ticketId) => {
    const updated = tickets.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t)
    setTickets(updated)
    if (viewingTicket?.id === ticketId) {
      setViewingTicket(updated.find(t => t.id === ticketId))
    }
    showToast('Ticket closed', 'info')
  }

  const getSlaStatus = (ticket) => {
    if (ticket.status === 'resolved' || ticket.status === 'closed') return 'done'
    const deadline = new Date(ticket.slaDeadline)
    const now = new Date()
    const diff = deadline - now
    if (diff < 0) return 'overdue'
    if (diff < 86400000) return 'warning'
    return 'ok'
  }

  const activeTickets = tickets.filter(t => t.status !== 'closed')
  const closedTickets = tickets.filter(t => t.status === 'closed')

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎫</div>
        <div className="empty-state-title">Login to Manage Tickets</div>
        <div className="empty-state-text">Sign in to create and track support tickets.</div>
        <Button variant="primary">Log In</Button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Support Tickets</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {tickets.length} total tickets ({activeTickets.length} active)
          </p>
        </div>
        <Button variant="primary" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        } onClick={() => setShowCreate(true)}>
          Create Ticket
        </Button>
      </div>

      {tickets.length === 0 && (
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">🎫</div>
            <div className="empty-state-title">No support tickets</div>
            <div className="empty-state-text">Create a ticket and we'll get back to you within 24 hours.</div>
          </div>
        </Card>
      )}

      {viewingTicket ? (
        <Card>
          <button onClick={() => setViewingTicket(null)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.8125rem', color: 'var(--text-secondary)',
            border: 'none', background: 'none', cursor: 'pointer', marginBottom: 'var(--space-lg)', padding: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back to tickets
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{viewingTicket.subject}</h4>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                <Badge variant={STATUS_BADGE[viewingTicket.status]?.variant || 'primary'}>{STATUS_BADGE[viewingTicket.status]?.label || viewingTicket.status}</Badge>
                <Badge variant="soft-primary">{viewingTicket.category}</Badge>
                <Badge variant={viewingTicket.priority === 'urgent' ? 'danger' : viewingTicket.priority === 'high' ? 'warning' : 'info'}>
                  {viewingTicket.priority}
                </Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {viewingTicket.id} | {formatDate(viewingTicket.date)}
                </span>
              </div>
            </div>
            {viewingTicket.status !== 'closed' && viewingTicket.status !== 'resolved' && (
              <Button variant="ghost" size="sm" icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              } onClick={() => handleCloseTicket(viewingTicket.id)}>
                Close Ticket
              </Button>
            )}
          </div>

          {viewingTicket.slaDeadline && getSlaStatus(viewingTicket) !== 'done' && (
            <div style={{
              padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)',
              background: getSlaStatus(viewingTicket) === 'overdue' ? 'var(--danger-light)' : 'var(--warning-light)',
              display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-lg)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={getSlaStatus(viewingTicket) === 'overdue' ? 'var(--danger)' : 'var(--warning)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: getSlaStatus(viewingTicket) === 'overdue' ? 'var(--danger)' : 'var(--warning)' }}>
                {getSlaStatus(viewingTicket) === 'overdue' ? 'SLA Overdue' : 'SLA Warning - Response needed soon'}
              </span>
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-xl)' }}>
            {viewingTicket.messages.map((msg, i) => (
              <div key={msg.id} style={{
                display: 'flex', gap: 12, marginBottom: 'var(--space-md)',
                justifyContent: msg.sender === 'buyer' ? 'flex-end' : 'flex-start',
              }}>
                {msg.sender !== 'buyer' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--info-light)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, flexShrink: 0 }}>AG</div>
                )}
                <div style={{
                  maxWidth: '70%', padding: 'var(--space-md) var(--space-lg)',
                  borderRadius: msg.sender === 'buyer' ? 'var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 0',
                  background: msg.sender === 'buyer' ? 'var(--primary)' : 'var(--bg-gray)',
                  color: msg.sender === 'buyer' ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.875rem',
                }}>
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <span style={{ fontSize: '0.625rem', opacity: 0.7, marginTop: 4, display: 'block', textAlign: 'right' }}>
                    {formatDate(msg.time)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {viewingTicket.status !== 'closed' && viewingTicket.status !== 'resolved' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2} placeholder="Type your reply..." style={{
                flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border)', fontSize: '0.875rem', outline: 'none',
                resize: 'vertical', background: 'var(--bg-white)',
              }} />
              <Button variant="primary" onClick={handleReply} disabled={!reply.trim()}>Send</Button>
            </div>
          )}
        </Card>
      ) : (
        <>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Active Tickets ({activeTickets.length})</h4>
          {activeTickets.map(ticket => (
            <div key={ticket.id} onClick={() => setViewingTicket(ticket)} style={{
              padding: 'var(--space-lg)', marginBottom: 'var(--space-md)',
              background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)', cursor: 'pointer',
              transition: 'all var(--transition-base)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{ticket.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>{ticket.id}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Badge variant={STATUS_BADGE[ticket.status]?.variant || 'primary'}>{STATUS_BADGE[ticket.status]?.label || ticket.status}</Badge>
                  {getSlaStatus(ticket) === 'overdue' && <Badge variant="danger">Overdue</Badge>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                <Badge variant="soft-primary" style={{ fontSize: '0.625rem' }}>{ticket.category}</Badge>
                <Badge variant={ticket.priority === 'urgent' ? 'danger' : ticket.priority === 'high' ? 'warning' : 'info'} style={{ fontSize: '0.625rem', textTransform: 'capitalize' }}>{ticket.priority}</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{formatDate(ticket.date)}</span>
                <span>{ticket.messages.length} messages</span>
              </div>
            </div>
          ))}

          {closedTickets.length > 0 && (
            <>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-md)', marginTop: 'var(--space-2xl)' }}>Closed Tickets ({closedTickets.length})</h4>
              {closedTickets.map(ticket => (
                <div key={ticket.id} onClick={() => setViewingTicket(ticket)} style={{
                  padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-sm)',
                  background: 'var(--bg-gray)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)', cursor: 'pointer',
                  opacity: 0.7,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 500, fontSize: '0.8125rem' }}>{ticket.subject}</span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: 6 }}>{ticket.id}</span>
                    </div>
                    <Badge variant="soft-danger">Closed</Badge>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false) }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3>Create Support Ticket</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Subject *</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary of your issue" style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '2px solid ' + (errors.subject ? 'var(--danger)' : 'var(--border)'),
                  fontSize: '0.875rem', outline: 'none', color: 'var(--text-primary)',
                }} />
                {errors.subject && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 2 }}>{errors.subject}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 'var(--space-lg)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{
                    width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    border: '2px solid ' + (errors.category ? 'var(--danger)' : 'var(--border)'),
                    fontSize: '0.875rem', outline: 'none', background: 'var(--bg-white)',
                  }}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 2 }}>{errors.category}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{
                    width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border)', fontSize: '0.875rem', outline: 'none', background: 'var(--bg-white)',
                  }}>
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe your issue in detail..." style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '2px solid ' + (errors.description ? 'var(--danger)' : 'var(--border)'),
                  fontSize: '0.875rem', outline: 'none', resize: 'vertical',
                }} />
                {errors.description && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 2 }}>{errors.description}</p>}
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Attachment (optional)</label>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                  borderRadius: 'var(--radius-md)', border: '2px dashed var(--border)',
                  cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--text-secondary)',
                }}>
                  <input type="file" onChange={e => setForm({ ...form, attachment: e.target.files[0] })} style={{ display: 'none' }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
                  {form.attachment ? form.attachment.name : 'Attach file'}
                </label>
              </div>

              <Button variant="primary" block onClick={handleCreate}>Create Ticket</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
