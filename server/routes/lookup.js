// Generic CRUD router used for both Category and Location.
const express = require('express');
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');

module.exports = (Model, field) => {
  const router = express.Router();
  router.use(protect);

  router.get('/', async (req, res) => res.json(await Model.find().sort('name')));

  router.post('/', adminOnly, async (req, res) => {
    try {
      res.status(201).json(await Model.create(req.body));
    } catch (err) {
      res.status(400).json({ message: err.code === 11000 ? 'That name already exists' : err.message });
    }
  });

  router.put('/:id', adminOnly, async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.delete('/:id', adminOnly, async (req, res) => {
    const used = await Complaint.countDocuments({ [field]: req.params.id });
    if (used) return res.status(400).json({ message: `Cannot delete: ${used} complaint(s) use this` });
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  });

  return router;
};
