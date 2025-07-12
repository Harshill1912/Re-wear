// routes/admin.js
const express = require('express');
const router = express.Router();
const Item = require('../models/items');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all pending items (not approved yet)
router.get('/pending', auth, admin, async (req, res) => {
  const items = await Item.find({ approved: false });
  res.json(items);
});

// Approve an item
router.post('/approve/:id', auth, admin, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.approved = true;
  await item.save();
  res.json({ message: 'Item approved', item });
});

//  Reject/Delete an item
router.delete('/reject/:id', auth, admin, async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ message: 'Item rejected and deleted', item });
});

module.exports = router;
