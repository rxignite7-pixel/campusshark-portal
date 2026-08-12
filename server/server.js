import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'campusshark_super_secret_jwt_key_2026';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage engine for pitch deck uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rxignite7_db_user:CAMPUSSHARKS@cluster0.qlx0yd4.mongodb.net/campusshark?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to CampusShark MongoDB Atlas (rxignite7_db_user)'))
  .catch(err => console.log('⚠️ MongoDB connection note:', err.message));

// Schemas & Models
const RegistrationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  city: String,
  startupName: String,
  sector: String,
  stage: String,
  website: String,
  pitchDeckUrl: String,
  eventId: String,
  eventTitle: String,
  appliedCoupon: String,
  amountPaid: Number,
  ticketId: String,
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: String,
  tag: String,
  pricePerMember: Number,
  originalPrice: Number,
  date: String,
  location: String,
  description: String,
  highlights: [String],
  isFlagship: Boolean
});

const CouponSchema = new mongoose.Schema({
  code: String,
  eventId: String,
  type: String, // 'percentage' or 'flat'
  discount: Number,
  description: String,
  badge: String
});

const ScheduleSchema = new mongoose.Schema({
  title: String,
  time: String,
  description: String,
  tag: String
});

const Registration = mongoose.model('Registration', RegistrationSchema);
const Event = mongoose.model('Event', EventSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const Schedule = mongoose.model('Schedule', ScheduleSchema);

// Admin Auth Middleware
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (e) {
    res.status(403).json({ error: 'Invalid or expired admin token' });
  }
};

// API ROUTES

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@campusshark.in' && password === 'admin123') {
    const token = jwt.sign({ email, role: 'SuperAdmin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token, user: { email, role: 'SuperAdmin' } });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// 2. Submit Founder Registration with Pitch Deck
app.post('/api/register', upload.single('pitchDeck'), async (req, res) => {
  try {
    const data = req.body;
    const pitchDeckUrl = req.file ? `/uploads/${req.file.filename}` : data.pitchDeckName;
    const ticketId = `CSHARK2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newReg = new Registration({
      ...data,
      pitchDeckUrl,
      ticketId
    });
    await newReg.save();

    res.json({ success: true, ticketId, registration: newReg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Events Endpoints
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/events', verifyAdminToken, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.json({ success: true, event: newEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/events/:id', verifyAdminToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Coupon Endpoints
app.get('/api/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/coupons', verifyAdminToken, async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.json({ success: true, coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/coupons/:code', verifyAdminToken, async (req, res) => {
  try {
    await Coupon.findOneAndDelete({ code: req.params.code });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Schedule Cards Endpoints
app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await Schedule.find();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/schedule', verifyAdminToken, async (req, res) => {
  try {
    const newSch = new Schedule(req.body);
    await newSch.save();
    res.json({ success: true, schedule: newSch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/schedule/:id', verifyAdminToken, async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root & Health check
app.get('/', (req, res) => {
  res.send('🚀 CampusShark API Server is Live & Healthy!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
