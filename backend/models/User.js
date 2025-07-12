const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  },
  points: {
    type: Number,
    default: 100,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  swaps: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
      status: {
        type: String,
        enum: ['swapped', 'redeemed'],
      },
    },
  ],
})

module.exports = mongoose.model('User', userSchema)
