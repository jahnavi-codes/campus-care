const router = require('express').Router();
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

const populate = (q) =>
  q
    .populate('student', 'name email rollNo department')
    .populate('category', 'name')
    .populate('location', 'name')
    .populate('history.by', 'name role');

// CREATE
router.post('/', async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;
    const c = await Complaint.create({
      title, description, category, location, priority,
      student: req.user._id,
      history: [{ status: 'Pending', remark: 'Complaint submitted', by: req.user._id }],
    });
    res.status(201).json(await populate(Complaint.findById(c._id)));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ list: students see their own, admins see everything. Supports ?status=&category=&location=&priority=&q=
router.get('/', async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin') filter.student = req.user._id;
  ['status', 'category', 'location', 'priority'].forEach((k) => req.query[k] && (filter[k] = req.query[k]));
  if (req.query.q) filter.title = new RegExp(req.query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  res.json(await populate(Complaint.find(filter).sort('-createdAt')));
});

// READ one
router.get('/:id', async (req, res) => {
  const c = await populate(Complaint.findById(req.params.id)).catch(() => null);
  if (!c) return res.status(404).json({ message: 'Complaint not found' });
  if (req.user.role !== 'admin' && String(c.student._id) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not your complaint' });
  }
  res.json(c);
});

// UPDATE details (owner only while Pending, or admin)
router.put('/:id', async (req, res) => {
  const c = await Complaint.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Complaint not found' });
  const isOwner = String(c.student) === String(req.user._id);
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not allowed' });
  if (!isAdmin && c.status !== 'Pending') return res.status(400).json({ message: 'Only pending complaints can be edited' });
  ['title', 'description', 'category', 'location', 'priority'].forEach((k) => req.body[k] && (c[k] = req.body[k]));
  await c.save();
  res.json(await populate(Complaint.findById(c._id)));
});

// UPDATE status (admin) with remark
router.patch('/:id/status', adminOnly, async (req, res) => {
  const { status, remark } = req.body;
  if (!Complaint.STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const c = await Complaint.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Complaint not found' });
  c.status = status;
  c.history.push({ status, remark: remark || '', by: req.user._id });
  await c.save();
  res.json(await populate(Complaint.findById(c._id)));
});

// DELETE (owner while Pending, or admin)
router.delete('/:id', async (req, res) => {
  const c = await Complaint.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Complaint not found' });
  const isOwner = String(c.student) === String(req.user._id);
  if (req.user.role !== 'admin' && !(isOwner && c.status === 'Pending')) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  await c.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;
