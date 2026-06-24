import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext(null)

const initialState = {
  cart: [],
  wishlist: [],
  compareList: [],
  user: null,
  notifications: [],
  orders: [],
  language: 'hi',
  searchQuery: '',
  filters: {},
  toast: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, vendorId, quantity = 1 } = action.payload
      const existingIndex = state.cart.findIndex(
        item => item.product.id === product.id && item.vendorId === vendorId
      )
      if (existingIndex >= 0) {
        const updated = [...state.cart]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return { ...state, cart: updated }
      }
      return { ...state, cart: [...state.cart, { product, vendorId, quantity }] }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(
          item => !(item.product.id === action.payload.productId && item.vendorId === action.payload.vendorId)
        ),
      }

    case 'UPDATE_QUANTITY': {
      const { productId, vendorId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            item => !(item.product.id === productId && item.vendorId === vendorId)
          ),
        }
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === productId && item.vendorId === vendorId
            ? { ...item, quantity }
            : item
        ),
      }
    }

    case 'TOGGLE_WISHLIST': {
      const productId = action.payload
      const exists = state.wishlist.includes(productId)
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId],
      }
    }

    case 'ADD_TO_COMPARE': {
      if (state.compareList.length >= 3) return state
      const productId = action.payload
      if (state.compareList.includes(productId)) return state
      return { ...state, compareList: [...state.compareList, productId] }
    }

    case 'REMOVE_FROM_COMPARE':
      return {
        ...state,
        compareList: state.compareList.filter(id => id !== action.payload),
      }

    case 'SET_USER':
      return { ...state, user: action.payload }

    case 'LOGOUT':
      return { ...state, user: null, orders: [] }

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) }

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload }

    case 'CLEAR_TOAST':
      return { ...state, toast: null }

    case 'PLACE_ORDER': {
      const order = {
        ...action.payload,
        id: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString(),
        status: 'confirmed',
      }
      const itemsToRemove = order.items.map(item => ({
        productId: item.productId || item.product?.id,
        vendorId: item.vendorId,
      }))
      const updatedCart = state.cart.filter(
        cartItem => !itemsToRemove.some(
          rem => rem.productId === cartItem.product.id && rem.vendorId === cartItem.vendorId
        )
      )
      return {
        ...state,
        orders: [order, ...state.orders],
        cart: updatedCart,
      }
    }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [savedState, setSavedState] = useLocalStorage('samriddhi_state', {
    cart: [],
    wishlist: [],
    compareList: [],
    user: null,
    orders: [],
    language: 'hi',
  })

  const mergedInitial = useMemo(() => ({
    ...initialState,
    ...savedState,
    notifications: [],
    toast: null,
    searchQuery: '',
    filters: {},
  }), [savedState])

  const [state, dispatch] = useReducer(reducer, mergedInitial)

  useEffect(() => {
    const toSave = {
      cart: state.cart,
      wishlist: state.wishlist,
      compareList: state.compareList,
      user: state.user,
      orders: state.orders,
      language: state.language,
    }
    setSavedState(toSave)
  }, [state.cart, state.wishlist, state.compareList, state.user, state.orders, state.language])

  const wrappedDispatch = useCallback((action) => {
    dispatch(action)
  }, [])

  const addToCart = useCallback((product, vendorId, quantity = 1) => {
    wrappedDispatch({ type: 'ADD_TO_CART', payload: { product, vendorId, quantity } })
  }, [wrappedDispatch])

  const removeFromCart = useCallback((productId, vendorId) => {
    wrappedDispatch({ type: 'REMOVE_FROM_CART', payload: { productId, vendorId } })
  }, [wrappedDispatch])

  const updateQuantity = useCallback((productId, vendorId, quantity) => {
    wrappedDispatch({ type: 'UPDATE_QUANTITY', payload: { productId, vendorId, quantity } })
  }, [wrappedDispatch])

  const toggleWishlist = useCallback((productId) => {
    wrappedDispatch({ type: 'TOGGLE_WISHLIST', payload: productId })
  }, [wrappedDispatch])

  const addToCompare = useCallback((productId) => {
    wrappedDispatch({ type: 'ADD_TO_COMPARE', payload: productId })
  }, [wrappedDispatch])

  const removeFromCompare = useCallback((productId) => {
    wrappedDispatch({ type: 'REMOVE_FROM_COMPARE', payload: productId })
  }, [wrappedDispatch])

  const getCartTotal = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [state.cart])

  const getCartCount = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [state.cart])

  const isInWishlist = useCallback((productId) => {
    return state.wishlist.includes(productId)
  }, [state.wishlist])

  const isInCompare = useCallback((productId) => {
    return state.compareList.includes(productId)
  }, [state.compareList])

  const placeOrder = useCallback((orderData) => {
    wrappedDispatch({ type: 'PLACE_ORDER', payload: orderData })
  }, [wrappedDispatch])

  const showToast = useCallback((message, type = 'info', title) => {
    const opts = { position: 'bottom-right', autoClose: 3000 }
    switch (type) {
      case 'success': toast.success(message, opts); break
      case 'error': toast.error(message, opts); break
      case 'warning': toast.warning(message, opts); break
      default: toast.info(message, opts); break
    }
  }, [])

  const setLanguage = useCallback((lang) => {
    wrappedDispatch({ type: 'SET_LANGUAGE', payload: lang })
  }, [wrappedDispatch])

  const setSearch = useCallback((query) => {
    wrappedDispatch({ type: 'SET_SEARCH', payload: query })
  }, [wrappedDispatch])

  const setFilters = useCallback((filters) => {
    wrappedDispatch({ type: 'SET_FILTERS', payload: filters })
  }, [wrappedDispatch])

  const setUser = useCallback((user) => {
    wrappedDispatch({ type: 'SET_USER', payload: user })
  }, [wrappedDispatch])

  const logout = useCallback(() => {
    wrappedDispatch({ type: 'LOGOUT' })
  }, [wrappedDispatch])

  const value = useMemo(() => ({
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    addToCompare,
    removeFromCompare,
    getCartTotal,
    getCartCount,
    isInWishlist,
    isInCompare,
    placeOrder,
    showToast,
    setLanguage,
    setSearch,
    setFilters,
    setUser,
    logout,
  }), [
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    addToCompare,
    removeFromCompare,
    getCartTotal,
    getCartCount,
    isInWishlist,
    isInCompare,
    placeOrder,
    showToast,
    setLanguage,
    setSearch,
    setFilters,
    setUser,
    logout,
  ])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
