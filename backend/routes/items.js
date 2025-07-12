const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/items');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ➕ Add New Item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      size,
      condition,
      category,
      type,
      tags,
      pointCost
    } = req.body;

    const item = await Item.create({
      title,
      description,
      size,
      condition,
      category,
      type,
      tags: tags?.split(',') || [],
      pointCost: parseInt(pointCost) || 20,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      uploadedBy: req.user.id,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Available items
router.get('/available', async (req, res) => {
  try {
    const items = await Item.find({ approved: true, status: 'available' }).populate('uploadedBy', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch available items' });
  }
});

// ✅ Search items
router.get('/search', async (req, res) => {
  const { category, type, tag, size, condition } = req.query;
  const query = {
    approved: true,
    ...(category && { category }),
    ...(type && { type }),
    ...(tag && { tags: tag }),
    ...(size && { size }),
    ...(condition && { condition }),
  };
  const items = await Item.find(query).populate('uploadedBy', 'name');
  res.json(items);
});

// ✅ Tag/type suggestions
router.get('/suggest', async (req, res) => {
  const { type, query } = req.query;

  if (!type || !query) return res.status(400).json({ message: 'Missing type or query' });

  try {
    const regex = new RegExp(query, 'i');
    let suggestions = [];

    if (type === 'tag') {
      const items = await Item.find({ tags: regex }).limit(10).select('tags -_id');
      suggestions = [...new Set(items.flatMap(item => item.tags.filter(tag => regex.test(tag))))];
    }

    res.json(suggestions.slice(0, 5));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch suggestions' });
  }
});

// ✅ Get all approved items
router.get('/', async (req, res) => {
  const items = await Item.find({ approved: true }).populate('uploadedBy', 'name');
  res.json(items);
});

// ✅ My uploads
router.get('/me', auth, async (req, res) => {
  const items = await Item.find({ uploadedBy: req.user.id });
  res.json(items);
});

// redeem
router.post('/redeem/:id', auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  const buyer = await User.findById(req.user.id);
  const seller = await User.findById(item.uploadedBy);

  if (!item || item.status !== 'available') {
    return res.status(400).json({ message: 'Item is not available' });
  }

  const cost = item.pointCost || 20;

  if (buyer.points < cost) {
    return res.status(400).json({ message: 'Not enough points' });
  }

  // 1. Subtract from buyer
  buyer.points -= cost;

  // 2. Add to seller
  seller.points += cost;

  // 3. Update item status
  item.status = 'redeemed';

  await buyer.save();
  await seller.save();
  await item.save();

  // 4. Record transaction
  await Transaction.create({
    user: buyer._id,
    item: item._id,
    type: 'redeem_spent',
    points: -cost,
  });

  await Transaction.create({
    user: seller._id,
    item: item._id,
    type: 'redeem_earned',
    points: cost,
  });

  res.json({ message: 'Item redeemed successfully', item });
});


// ✅ Swap item
router.post('/swap/:id', auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item || item.status !== 'available') {
    return res.status(400).json({ message: 'Item is not available for swapping' });
  }

  const owner = await User.findById(item.uploadedBy);
  const reward = item.pointCost || 20;
  owner.points += reward;
  await owner.save();

  item.status = 'swapped';
  await item.save();

  res.json({
    message: `Item marked as swapped. Owner earned ${reward} points.`,
    item
  });
});

// ✅ Item image
router.get('/image/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item || !item.image || !item.image.data) {
    return res.status(404).send('No image found');
  }
  res.contentType(item.image.contentType);
  res.send(item.image.data);
});

// ✅ Featured items
router.get('/featured/all', async (req, res) => {
  const items = await Item.find({ approved: true, featured: true }).populate('uploadedBy', 'name');
  res.json(items);
});

// ✅ Admin: approve item
router.post('/approve/:id', auth, isAdmin, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.approved = true;
  await item.save();
  res.json({ message: 'Item approved' });
});

// ✅ Admin: reject/delete item
router.delete('/reject/:id', auth, isAdmin, async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ message: 'Item rejected and deleted' });
});

// ✅ Admin: feature item
router.post('/feature/:id', auth, isAdmin, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.featured = true;
  await item.save();
  res.json({ message: 'Item marked as featured' });
});

// ✅ Dashboard: points
router.get('/dashboard/points', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ points: user.points });
});

// ✅ Dashboard: swaps
router.get('/dashboard/swaps', auth, async (req, res) => {
  const items = await Item.find({
    uploadedBy: req.user.id,
    status: { $in: ['swapped', 'redeemed'] },
  });
  res.json(items);
});

//  Dashboard: transactions
router.get('/transactions/history', auth, async (req, res) => {
  const history = await Transaction.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate('item', 'title image');

  res.json(history);
});

//Get item detail
router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id).populate('uploadedBy', 'name email');
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
});

module.exports = router;
