const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  size: String,
  condition: String,
  category: String,
  type: String,
  tags: [String],
  featured: { type: Boolean, default: false },
  image: {
    data: Buffer,
    contentType: String,
  },
  status: {
    type: String,
    enum: ['available', 'swapped', 'redeemed'],
    default: 'available',
  },
  approved: {
    type: Boolean,
    default: false,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },pointCost: {
  type: Number,
  required: true,
  min: 0,
  default: 20 // optional default
},
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
