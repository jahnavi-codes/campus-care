require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Location = require('./models/Location');
const Complaint = require('./models/Complaint');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Category.deleteMany(), Location.deleteMany(), Complaint.deleteMany()]);

  const admin = await User.create({ name: 'Campus Admin', email: 'admin@campus.edu', password: 'admin123', role: 'admin' });
  const student = await User.create({
    name: 'Demo Student', email: 'student@campus.edu', password: 'student123',
    rollNo: '22CS101', department: 'Computer Science',
  });

  const cats = await Category.insertMany([
    { name: 'Hostel', description: 'Rooms, mess, laundry' },
    { name: 'Academics', description: 'Classes, labs, exams' },
    { name: 'Infrastructure', description: 'Electricity, water, furniture' },
    { name: 'Internet & IT', description: 'Wi-Fi, lab systems' },
    { name: 'Transport', description: 'Buses and parking' },
  ]);
  const locs = await Location.insertMany([
    { name: 'Boys Hostel' }, { name: 'Girls Hostel' }, { name: 'Main Library' },
    { name: 'CS Block' }, { name: 'Cafeteria' }, { name: 'Sports Ground' },
  ]);

  await Complaint.create([
    {
      title: 'Wi-Fi keeps dropping in library', description: 'Connection drops every few minutes on the second floor.',
      student: student._id, category: cats[3]._id, location: locs[2]._id, priority: 'High',
      history: [{ status: 'Pending', remark: 'Complaint submitted', by: student._id }],
    },
    {
      title: 'Broken fan in lab 3', description: 'Two ceiling fans are not working in CS lab 3.',
      student: student._id, category: cats[2]._id, location: locs[3]._id, status: 'In Progress',
      history: [
        { status: 'Pending', remark: 'Complaint submitted', by: student._id },
        { status: 'In Progress', remark: 'Maintenance team assigned', by: admin._id },
      ],
    },
  ]);

  console.log('Seeded. Admin: admin@campus.edu / admin123 | Student: student@campus.edu / student123');
  process.exit(0);
})();
