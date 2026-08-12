import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'campusshark_super_secret_jwt_key_2026';

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TOyqd2U2Wrsk8q',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'campusshark_razorpay_secret_2026'
});

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
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
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
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: { type: String, default: 'PAID' },
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

// 2. Check for Duplicate Registration (By Email or Phone)
app.post('/api/check-duplicate', async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) return res.json({ isDuplicate: false });

    const query = [];
    if (email) query.push({ email: email.trim().toLowerCase() });
    if (phone) query.push({ phone: phone.trim() });

    const existingUser = await Registration.findOne({ $or: query });

    if (existingUser) {
      return res.json({
        isDuplicate: true,
        message: `User already exists! A registration with email "${existingUser.email}" or phone "${existingUser.phone}" is already registered.`,
        existingUser
      });
    }

    res.json({ isDuplicate: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Razorpay Create Payment Order (Prevents duplicates)
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, email, phone } = req.body;

    // Check duplicate before creating order
    if (email || phone) {
      const query = [];
      if (email) query.push({ email: email.trim().toLowerCase() });
      if (phone) query.push({ phone: phone.trim() });

      const existingUser = await Registration.findOne({ $or: query });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          isDuplicate: true,
          error: `User already exists! Email "${existingUser.email}" or phone "${existingUser.phone}" has already completed registration.`
        });
      }
    }

    const options = {
      amount: Math.round((amount || 150) * 100), // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TOyqd2U2Wrsk8q'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Razorpay Verify Payment Signature & Save Registration to MongoDB
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationData } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'campusshark_razorpay_secret_2026';
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    // Check for duplicate prior to inserting
    if (registrationData.email || registrationData.phone) {
      const query = [];
      if (registrationData.email) query.push({ email: registrationData.email.trim().toLowerCase() });
      if (registrationData.phone) query.push({ phone: registrationData.phone.trim() });

      const existingUser = await Registration.findOne({ $or: query });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          isDuplicate: true,
          error: `User already exists! Email "${existingUser.email}" or phone "${existingUser.phone}" is already registered.`
        });
      }
    }

    // Save to MongoDB Atlas
    const ticketId = `CSHARK2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newReg = new Registration({
      ...registrationData,
      email: registrationData.email ? registrationData.email.trim().toLowerCase() : '',
      phone: registrationData.phone ? registrationData.phone.trim() : '',
      ticketId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: isAuthentic ? 'PAID' : 'VERIFIED',
      createdAt: new Date()
    });
    await newReg.save();

    res.json({ success: true, message: 'Payment verified & saved to MongoDB!', registration: newReg, ticketId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Submit Member Registration Direct (Prevents duplicates)
app.post('/api/register', upload.single('pitchDeck'), async (req, res) => {
  try {
    const data = req.body;
    
    // Check duplicate
    if (data.email || data.phone) {
      const query = [];
      if (data.email) query.push({ email: data.email.trim().toLowerCase() });
      if (data.phone) query.push({ phone: data.phone.trim() });

      const existingUser = await Registration.findOne({ $or: query });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          isDuplicate: true,
          error: `User already exists! Email "${existingUser.email}" or phone "${existingUser.phone}" is already registered.`
        });
      }
    }

    const pitchDeckUrl = req.file ? `/uploads/${req.file.filename}` : (data.pitchDeckName || 'Attached');
    const ticketId = `CSHARK2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newReg = new Registration({
      ...data,
      email: data.email ? data.email.trim().toLowerCase() : '',
      phone: data.phone ? data.phone.trim() : '',
      pitchDeckUrl,
      ticketId,
      paymentStatus: 'PAID'
    });
    await newReg.save();

    res.json({ success: true, ticketId, registration: newReg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Admin Fetch Paid Registrations
app.get('/api/admin/registrations', async (req, res) => {
  try {
    const list = await Registration.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Events Endpoints
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

// 8. Coupon Endpoints
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

// 9. Schedule Cards Endpoints
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
  res.send('🚀 CampusShark API Server with Duplicate Validation, Razorpay & MongoDB Atlas is Live!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
