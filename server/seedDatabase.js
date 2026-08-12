import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://rxignite7_db_user:CAMPUSSHARKS@cluster0.qlx0yd4.mongodb.net/campusshark?retryWrites=true&w=majority';

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
  type: String,
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

async function seedDatabase() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!');

    // 1. Insert Sample Founder Registration
    const sampleRegistration = new Registration({
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@iitb.ac.in',
      phone: '+91 98765 43210',
      city: 'Mumbai, MH',
      startupName: 'NeuroPulse AI Labs',
      sector: 'AI / Machine Learning',
      stage: 'Prototype / MVP',
      website: 'https://neuropulse-ai.com',
      pitchDeckUrl: '/uploads/NeuroPulse_AI_PitchDeck_v1.pdf',
      eventId: 'campusshark-ecell-flagship-2026',
      eventTitle: 'CampusShark E-Cell Flagship Event 2026',
      appliedCoupon: 'ECELL100',
      amountPaid: 150,
      ticketId: 'CSHARK2026-NEURO99',
      createdAt: new Date()
    });

    await sampleRegistration.save();
    console.log('🎉 Sample Registration Document Inserted into "registrations" collection!');

    // 2. Insert Sample Events
    await Event.deleteMany({});
    await Event.insertMany([
      {
        title: 'CampusShark E-Cell Flagship Event 2026',
        tag: 'E-Cell Flagship Track',
        pricePerMember: 250,
        originalPrice: 500,
        date: 'Oct 15 - 17, 2026',
        location: 'CampusShark Main Auditorium & Hybrid',
        description: 'The premier national flagship summit hosted by Entrepreneurship Cell. 36-hour hackathon, startup pitching to top VCs, ₹10 Lakhs prize pool, and 1-on-1 mentorship.',
        highlights: ['₹10 Lakhs Prize Pool', 'VC Pitch Arena', 'Incubation Support', 'E-Cell VIP Pass'],
        isFlagship: true
      },
      {
        title: 'CampusShark National AI & Machine Learning Sprint',
        tag: 'AI & Data Science',
        pricePerMember: 250,
        originalPrice: 500,
        date: 'Nov 02 - 04, 2026',
        location: 'Innovation Tech Labs',
        description: 'Build enterprise AI agents, LLM pipelines, and computer vision prototypes. Guidance from top AI researchers and cloud architects.',
        highlights: ['Free Cloud GPU Credits', 'AI Certificate', 'Hiring Expo Access'],
        isFlagship: false
      }
    ]);
    console.log('🎉 Sample Events Inserted into "events" collection!');

    // 3. Insert Sample Coupons
    await Coupon.deleteMany({});
    await Coupon.insertMany([
      {
        code: 'ECELL100',
        eventId: 'ALL',
        type: 'flat',
        discount: 100,
        description: 'Admin Special: ₹100 Flat Waiver for E-Cell Leaders',
        badge: '₹100 FLAT'
      },
      {
        code: 'ADMIN100',
        eventId: 'ALL',
        type: 'flat',
        discount: 100,
        description: 'Flat ₹100 INR Admin Coupon Discount',
        badge: '₹100 FLAT'
      },
      {
        code: 'FULL100',
        eventId: 'ALL',
        type: 'percentage',
        discount: 100,
        description: 'VIP Admin Grant: 100% Full Pass Discount',
        badge: '100% OFF'
      }
    ]);
    console.log('🎉 Sample Coupons Inserted into "coupons" collection!');

    // 4. Insert Sample Schedule Cards
    await Schedule.deleteMany({});
    await Schedule.insertMany([
      {
        title: 'Flagship Summit Inauguration & VC Keynote',
        time: '09:00 AM - 10:30 AM',
        description: 'Opening remarks by E-Cell President & Keynote address by leading Venture Capital Partners on scaling college startups.',
        tag: 'Keynote Session'
      },
      {
        title: '36-Hour Hackathon & Build Sprint Kickoff',
        time: '11:00 AM - 01:00 PM',
        description: 'Problem statements release, mentor matching, cloud credit distribution, and team workspace allocation.',
        tag: 'Hackathon Track'
      },
      {
        title: 'Live Elevator Pitch & Founder Battle Round 1',
        time: '02:30 PM - 05:30 PM',
        description: 'Top 30 selected student startup teams pitch 3-minute deck presentations live in front of angel investor jury.',
        tag: 'Startup Pitching'
      }
    ]);
    console.log('🎉 Sample Schedule Cards Inserted into "schedules" collection!');

    console.log('✨ All Database collections successfully seeded in MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
