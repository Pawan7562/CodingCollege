import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiShoppingCart, FiArrowRight, FiShield, FiCreditCard } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, cartTotal, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stripeLoading, setStripeLoading] = useState(false)
  const [razorpayLoading, setRazorpayLoading] = useState(false)

  const handleStripeCheckout = async () => {
    setStripeLoading(true)
    try {
      const { data } = await api.post('/payments/stripe/create-session')
      window.location.href = data.url
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    } finally {
      setStripeLoading(false)
    }
  }

  const handleRazorpayCheckout = async () => {
    setRazorpayLoading(true)
    try {
      const { data } = await api.post('/payments/razorpay/create-order')
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'College',
        description: 'Course Purchase',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post('/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            toast.success('Payment successful! Courses enrolled.')
            navigate('/dashboard')
          } catch {
            toast.error('Payment verification failed')
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#2563eb' },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    } finally {
      setRazorpayLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiShoppingCart className="text-gray-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Browse our courses and add something you'd like to learn!</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses <FiArrowRight />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-5">{cart.length} course{cart.length !== 1 ? 's' : ''} in cart</p>
            <div className="space-y-4">
              {cart.map(item => {
                const id = item._id || item
                const title = item.title || 'Course'
                const price = item.price || 0
                const thumbnail = item.thumbnail

                return (
                  <div key={id} className="card p-4 flex gap-4">
                    <img
                      src={thumbnail || `https://via.placeholder.com/120x80/1f2937/60a5fa?text=${encodeURIComponent(title)}`}
                      alt={title}
                      className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/courses/${id}`} className="font-semibold text-white hover:text-blue-400 transition-colors line-clamp-2 text-sm">
                        {title}
                      </Link>
                      {item.instructor && (
                        <p className="text-xs text-gray-400 mt-1">{item.instructor?.name || item.instructor}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <span className="font-bold text-white text-lg">${price}</span>
                      <button
                        onClick={() => removeFromCart(id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Remove from cart"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <h2 className="font-bold text-white text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cart.map(item => {
                  const id = item._id || item
                  const title = item.title || 'Course'
                  const price = item.price || 0
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-gray-400 truncate mr-2 max-w-[180px]">{title}</span>
                      <span className="text-white font-medium">${price}</span>
                    </div>
                  )
                })}
                <div className="border-t border-gray-800 pt-3 flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-black text-xl text-white">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleStripeCheckout}
                  disabled={stripeLoading}
                  className="btn-primary w-full justify-center py-3"
                >
                  {stripeLoading ? <Loader size="sm" /> : <><FiCreditCard /> Pay with Stripe</>}
                </button>
                <button
                  onClick={handleRazorpayCheckout}
                  disabled={razorpayLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {razorpayLoading ? <Loader size="sm" /> : <><FiCreditCard /> Pay with Razorpay</>}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <FiShield className="text-green-400 flex-shrink-0" />
                <span>Secure payment. 30-day money-back guarantee.</span>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-800">
                <h3 className="text-sm font-semibold text-white mb-3">This course includes:</h3>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>Full lifetime access</li>
                  <li>Certificate of completion</li>
                  <li>Downloadable resources</li>
                  <li>24/7 support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
