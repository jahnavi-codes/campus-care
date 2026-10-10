const router = require('express').Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const match = req.user.role === 'admin' ? {} : { student: req.user._id };
  const [byStatus, byCategory, total] = await Promise.all([
    Complaint.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Complaint.aggregate([
      { $match: match },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $project: { name: { $arrayElemAt: ['$cat.name', 0] }, count: 1 } },
    ]),
    Complaint.countDocuments(match),
  ]);
  res.json({ total, byStatus, byCategory });
});

module.exports = router;
