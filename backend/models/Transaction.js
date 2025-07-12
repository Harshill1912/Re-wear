// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },
  type: {
    type: String,
    enum: ['swap_earned', 'redeem_spent'],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
