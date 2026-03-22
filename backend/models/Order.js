const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    price: Number,
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'free'], default: 'stripe' },
  paymentId: String,
  orderId: String,
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
