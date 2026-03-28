const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
<<<<<<< HEAD
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    discountedPrice: Number
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Please add total amount'],
    min: [0, 'Total amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay', 'other'],
    required: true
  },
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  billingDetails: {
    name: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  couponCode: String,
  discountAmount: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
=======
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
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842

module.exports = mongoose.model('Order', orderSchema);
