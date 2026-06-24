import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'
import Badge from '../common/Badge'
import Card from '../common/Card'
import OrderTimeline from './OrderTimeline'
import ShipmentDetails from './ShipmentDetails'

const STATUS_BADGE = {
  pending: { variant: 'warning', label: 'Pending' },
  confirmed: { variant: 'info', label: 'Confirmed' },
  packed: { variant: 'warning', label: 'Packed' },
  dispatched: { variant: 'info', label: 'Dispatched' },
  shipped: { variant: 'info', label: 'Shipped' },
  out_for_delivery: { variant: 'accent', label: 'Out for Delivery' },
  delivered: { variant: 'success', label: 'Delivered' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
}

function calculateETA(eventTimestamps = {}) {
  const statusOrder = ['placed', 'confirmed', 'packed', 'dispatched', 'out_for_delivery', 'delivered']
  const activeIndex = statusOrder.findIndex(s => !eventTimestamps[s])
  if (activeIndex < 0) return { countdown: 'Delivered', unit: '' }
  const remainingSteps = statusOrder.length - activeIndex
  const days = Math.max(1, remainingSteps * 1)
  return { countdown: days, unit: days === 1 ? 'day' : 'days' }
}

export default function OrderTracking() {
  const { orderId } = useParams()
  const { orders, showToast } = useApp()

  const order = useMemo(() => orders.find(o => o.id === orderId), [orders, orderId])

  const defaultEvents = [
    { status: 'placed', timestamp: order?.date, note: '' },
  ]

  const events = order?.status === 'confirmed' ? [
    ...defaultEvents,
    { status: 'confirmed', timestamp: new Date(new Date(order.date).getTime() + 3600000).toISOString(), note: 'Vendor confirmed your order' },
  ] : order?.status === 'shipped' ? [
    ...defaultEvents,
    { status: 'confirmed', timestamp: new Date(new Date(order.date).getTime() + 3600000).toISOString(), note: 'Vendor confirmed your order' },
    { status: 'packed', timestamp: new Date(new Date(order.date).getTime() + 7200000).toISOString(), note: 'Items packed and sealed' },
    { status: 'dispatched', timestamp: new Date(new Date(order.date).getTime() + 10800000).toISOString(), note: 'Shipment handed to courier' },
    { status: 'out_for_delivery', timestamp: new Date().toISOString(), note: 'Out for delivery' },
  ] : order?.status === 'delivered' ? [
    { status: 'placed', timestamp: order.date, note: '' },
    { status: 'confirmed', timestamp: new Date(new Date(order.date).getTime() + 3600000).toISOString(), note: 'Vendor confirmed your order' },
    { status: 'packed', timestamp: new Date(new Date(order.date).getTime() + 7200000).toISOString(), note: 'Items packed and sealed' },
    { status: 'dispatched', timestamp: new Date(new Date(order.date).getTime() + 10800000).toISOString(), note: 'Shipment handed to courier' },
    { status: 'out_for_delivery', timestamp: new Date(new Date(order.date).getTime() + 14400000).toISOString(), note: 'Out for delivery' },
    { status: 'delivered', timestamp: new Date(new Date(order.date).getTime() + 18000000).toISOString(), note: 'Delivered successfully' },
  ] : defaultEvents

  const eta = useMemo(() => calculateETA(order?.status === 'delivered' ? { delivered: true } : {}), [order])

  const statusObj = STATUS_BADGE[order?.status] || STATUS_BADGE.pending

  if (!order) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Order not found</div>
        <div className="empty-state-text">We couldn't find an order with ID "{orderId}"</div>
        <Link to="/orders" style={{ textDecoration: 'none' }}>
          <Button variant="primary">View All Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-xl)' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 'var(--space-xl)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        Back to Orders
      </Link>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Order {order.id}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            {order.vendorName && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Vendor: {order.vendorName}
              </p>
            )}
          </div>
          <Badge variant={statusObj.variant}>{statusObj.label}</Badge>
        </div>

        {eta.countdown !== 'Delivered' && (
          <div style={{
            background: 'var(--primary-light)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md) var(--space-lg)', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>
                Estimated Delivery: {eta.countdown} {eta.unit}
              </span>
            </div>
          </div>
        )}

        {order.status !== 'cancelled' && (
          <OrderTimeline status={order.status === 'shipped' ? 'out_for_delivery' : order.status} events={events} />
        )}

        {order.status === 'cancelled' && (
          <div style={{
            background: 'var(--danger-light)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)', textAlign: 'center', marginBottom: 24,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p style={{ fontWeight: 600, color: 'var(--danger)', margin: 0 }}>This order has been cancelled</p>
            {order.paymentStatus === 'refunded' && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Refund has been processed</p>
            )}
          </div>
        )}

        {order.status !== 'cancelled' && order.status !== 'pending' && (
          <ShipmentDetails
            courier={{ name: 'Express Delivery Partner' }}
            trackingId={order.trackingId || 'Not available'}
            dispatchDate={order.status === 'shipped' ? new Date(new Date(order.date).getTime() + 10800000).toISOString() : null}
            expectedDate={new Date(new Date(order.date).getTime() + 3 * 86400000).toISOString()}
            weight="Calculated by courier"
          />
        )}

        {order.status !== 'cancelled' && (
          <div style={{
            background: 'var(--bg-white)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', padding: 'var(--space-xl)', marginTop: 'var(--space-lg)',
          }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Order Summary
            </h4>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.productName}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 8 }}>x{item.quantity}</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-md)' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary)' }}>₹{order.total}</span>
            </div>
            {order.deliveryAddress && (
              <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--bg-gray)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Delivery Address</span>
                <p style={{ fontSize: '0.8125rem', margin: '2px 0 0' }}>{order.deliveryAddress}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
          <Button variant="primary" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          } onClick={() => showToast('Support request sent!', 'success')}>
            Need Help?
          </Button>
          {order.vendorName && (
            <Button variant="secondary" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
            } onClick={() => showToast('Connecting to vendor...', 'info')}>
              Contact Vendor
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
