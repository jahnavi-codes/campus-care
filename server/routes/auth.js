const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pack = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, rollNo: u.rollNo, department: u.department });

// Public registration always creates a student. Admins come from the seed script.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNo, department } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email is already registered' });
    const user = await User.create({ name, email, password, rollNo, department, role: 'student' });
    res.status(201).json({ token: sign(user._id), user: pack(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await user.matchPassword(password || ''))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  res.json({ token: sign(user._id), user: pack(user) });
});

router.get('/me', protect, (req, res) => res.json(pack(req.user)));

module.exports = router;
