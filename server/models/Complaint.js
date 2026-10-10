const mongoose = require('mongoose');

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: STATUSES, default: 'Pending' },
    history: [
      {
        status: String,
        remark: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
Complaint.STATUSES = STATUSES;
module.exports = Complaint;
