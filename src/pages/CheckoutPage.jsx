import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import api from '../api'
import CheckoutSteps from '../components/cart/CheckoutSteps'
import AddressForm from '../components/cart/AddressForm'
import DeliveryOptions from '../components/cart/DeliveryOptions'
import PaymentMethods from '../components/cart/PaymentMethods'
import OrderReview from '../components/cart/OrderReview'

export default function CheckoutPage() {
  const { cart, getCartTotal, placeOrder, showToast, user } = useApp()
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])

  useEffect(() => {
    api.vendors()
      .then(res => setVendors(res.data || []))
      .catch(() => setVendors([]))
  }, [])

  useEffect(() => {
    if (!user) {
      showToast('Please login to checkout', 'warning')
      navigate('/login')
    }
  }, [user, navigate, showToast])

  const [step, setStep] = useState(1)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [paymentForm, setPaymentForm] = useState({})
  const [deliveryOptions, setDeliveryOptions] = useState({})

  if (!user) return null

  const selectedAddress = useMemo(() => {
    return savedAddresses.find(a => a.id === selectedAddressId) || null
  }, [savedAddresses, selectedAddressId])

  const handleSaveAddress = (addr) => {
    setSavedAddresses(prev => {
      const exists = prev.findIndex(a => a.id === addr.id)
      if (exists >= 0) {
        const updated = [...prev]
        updated[exists] = addr
        return updated
      }
      return [...prev, addr]
    })
    setSelectedAddressId(addr.id)
  }

  const handleDeleteAddress = (id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id))
    if (selectedAddressId === id) setSelectedAddressId(null)
  }

  const grouped = useMemo(() => {
    const map = {}
    cart.forEach(item => {
      const v = vendors.find(v => v.id === item.vendorId)
      const key = item.vendorId
      if (!map[key]) map[key] = { vendor: v, items: [] }
      map[key].items.push(item)
    })
    return Object.values(map)
  }, [cart])

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)
    const gst = Math.round(subtotal * 0.05)
    const deliveryFee = Object.values(deliveryOptions).some(d => d === 'express') ? 49 : 0
    const platformFee = 10
    const discount = 0
    return { subtotal, gst, delivery: deliveryFee, platformFee, discount, grand: subtotal + gst + deliveryFee + platformFee - discount }
  }, [cart, deliveryOptions])

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>Add some products before checkout</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    )
  }

  const canProceed = () => {
    if (step === 1) return selectedAddress
    if (step === 2) return true
    if (step === 3) return paymentMethod
    if (step === 4) return true
    return false
  }

  const handlePlaceOrder = () => {
    if (!user) { showToast('Please login first', 'error'); navigate('/login'); return }

    if (paymentMethod === 'razorpay') {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = async () => {
        try {
          const keyRes = await api.razorpay.key()
          const options = {
            key: keyRes.data.keyId,
            amount: totals.grand * 100,
            currency: 'INR',
            name: 'Samriddhi Marketplace',
            description: `Order from ${cart.length} item(s)`,
            image: 'https://samriddhi.in/favicon.png',
            handler: function (response) {
              placeOrder({
                items: cart.map(item => ({ product: item.product, productId: item.product.id, vendorId: item.vendorId, quantity: item.quantity, price: item.product.price })),
                total: totals.grand,
                paymentMethod: 'razorpay',
                paymentStatus: 'paid',
                razorpayPaymentId: response.razorpay_payment_id,
                deliveryAddress: selectedAddress?.line1 + ', ' + selectedAddress?.city + ', ' + selectedAddress?.state + ' - ' + selectedAddress?.pincode,
                status: 'confirmed',
              })
              showToast('Payment successful! Order placed 🎉', 'success')
              navigate('/order-confirmation')
            },
            prefill: { name: user?.name || '', email: user?.email || '', contact: '' },
            theme: { color: '#1A56DB' },
          }
          const rzp = new window.Razorpay(options)
          rzp.on('payment.failed', function (response) {
            showToast('Payment failed: ' + response.error.description, 'error')
          })
          rzp.open()
        } catch (err) {
          showToast('Failed to initialize payment: ' + err.message, 'error')
        }
      }
      script.onerror = () => showToast('Failed to load payment gateway', 'error')
      document.body.appendChild(script)
      return
    }

    const items = cart.map(item => ({
      product: item.product,
      productId: item.product.id,
      vendorId: item.vendorId,
      quantity: item.quantity,
      price: item.product.price,
    }))
    placeOrder({
      items,
      total: totals.grand,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      deliveryAddress: selectedAddress?.line1 + ', ' + selectedAddress?.city + ', ' + selectedAddress?.state + ' - ' + selectedAddress?.pincode,
      status: 'confirmed',
    })
    showToast('Order placed successfully! 🎉', 'success')
    navigate('/order-confirmation')
  }

  const sectionStyle = {
    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)',
    marginBottom: 'var(--space-lg)', background: 'var(--bg-white)',
  }

  return (
    <div className="container" style={{ maxWidth: 780, padding: 'var(--space-xl) 16px' }}>
      <CheckoutSteps currentStep={step} />

      <div style={{ marginTop: 'var(--space-2xl)' }}>
        {step === 1 && (
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>1. Delivery Address</h3>
            <AddressForm
              savedAddresses={savedAddresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onSave={handleSaveAddress}
              onDelete={handleDeleteAddress}
            />
          </div>
        )}

        {step === 2 && (
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>2. Delivery Method</h3>
            <DeliveryOptions grouped={grouped} deliveryOptions={deliveryOptions} onChange={setDeliveryOptions} />
          </div>
        )}

        {step === 3 && (
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>3. Payment Method</h3>
            <PaymentMethods
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>
        )}

        {step === 4 && (
          <OrderReview
            cart={cart}
            grouped={grouped}
            selectedAddress={selectedAddress}
            deliveryOptions={deliveryOptions}
            paymentMethod={paymentMethod}
            totals={totals}
            vendorMap={{}}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>

      {step < 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 'var(--space-lg)' }}>
          <button className="btn btn-secondary" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
