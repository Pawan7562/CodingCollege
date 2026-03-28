import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { cart, addToCart, removeFromCart, isInCart, user } = useAuth()

  const cartCount = cart.length
  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0)

  const clearCart = () => {
    // handled on server after payment
  }

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartTotal,
      addToCart, removeFromCart, isInCart, clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
