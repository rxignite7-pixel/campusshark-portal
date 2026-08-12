export const EVENTS_DATA = [
  {
    id: 'campusshark-ecell-flagship-2026',
    title: 'CampusShark E-Cell Flagship Event 2026',
    tag: 'E-Cell Flagship Track',
    pricePerMember: 250,
    originalPrice: 500,
    date: 'Oct 15 - 17, 2026',
    location: 'CampusShark Main Auditorium & Hybrid',
    description: 'The premier national flagship summit hosted by Entrepreneurship Cell. 36-hour hackathon, startup pitching to top VCs, ₹10 Lakhs prize pool, and 1-on-1 mentorship.',
    highlights: ['₹10 Lakhs Prize Pool', 'VC Pitch Arena', 'Incubation Support', 'E-Cell VIP Pass'],
    availableSeats: 50,
    isFlagship: true
  },
  {
    id: 'ai-innovation-sprint',
    title: 'CampusShark National AI & Machine Learning Sprint',
    tag: 'AI & Data Science',
    pricePerMember: 250,
    originalPrice: 500,
    date: 'Nov 02 - 04, 2026',
    location: 'Innovation Tech Labs',
    description: 'Build enterprise AI agents, LLM pipelines, and computer vision prototypes. Guidance from top AI researchers and cloud architects.',
    highlights: ['Free Cloud GPU Credits', 'AI Certificate', 'Hiring Expo Access'],
    availableSeats: 30,
    isFlagship: false
  },
  {
    id: 'fullstack-devcon-2026',
    title: 'CampusShark FullStack World Summit',
    tag: 'Web & Cloud',
    pricePerMember: 250,
    originalPrice: 500,
    date: 'Dec 10 - 12, 2026',
    location: 'Convention Hall & Online',
    description: 'The ultimate web engineering conference for React, Next.js, Node.js, and Distributed Systems. Network with top tech leads.',
    highlights: ['Keynote Workshops', 'Dev Swag Kit', 'Networking Gala Dinner'],
    availableSeats: 25,
    isFlagship: false
  },
  {
    id: 'cybersec-ctf-arena',
    title: 'Zero-Trust CyberSecurity & CTF Arena',
    tag: 'CyberSecurity',
    pricePerMember: 250,
    originalPrice: 500,
    date: 'Jan 20, 2027',
    location: 'Cyber Labs & Virtual',
    description: 'Test your offensive and defensive security skills in live CTF vulnerability challenges.',
    highlights: ['Live CTF Battles', 'Bug Bounty Vouchers', 'Global Rank Badge'],
    availableSeats: 45,
    isFlagship: false
  }
];

export const INITIAL_ADMIN_COUPONS = [
  {
    id: 'c1',
    code: 'ECELL100',
    eventId: 'campusshark-ecell-flagship-2026',
    eventTitle: 'CampusShark E-Cell Flagship Event 2026',
    type: 'flat',
    discount: 100,
    description: 'Admin Special: ₹100 Flat Waiver for E-Cell Leaders',
    badge: '₹100 FLAT'
  },
  {
    id: 'c2',
    code: 'ADMIN100',
    eventId: 'ALL',
    eventTitle: 'All Events (Global Admin Code)',
    type: 'flat',
    discount: 100,
    description: 'Flat ₹100 INR Admin Coupon Discount',
    badge: '₹100 FLAT'
  },
  {
    id: 'c3',
    code: 'FULL100',
    eventId: 'ALL',
    eventTitle: 'All Events (Global Admin Code)',
    type: 'percentage',
    discount: 100,
    description: 'VIP Admin Grant: 100% Full Pass Discount',
    badge: '100% OFF'
  }
];

export const INITIAL_SCHEDULE_DATA = [
  {
    id: 'sch-1',
    title: 'Flagship Summit Inauguration & VC Keynote',
    time: '09:00 AM - 10:30 AM',
    description: 'Opening remarks by E-Cell President & Keynote address by leading Venture Capital Partners on scaling college startups.',
    tag: 'Keynote Session',
    eventId: 'campusshark-ecell-flagship-2026'
  },
  {
    id: 'sch-2',
    title: '36-Hour Hackathon & Build Sprint Kickoff',
    time: '11:00 AM - 01:00 PM',
    description: 'Problem statements release, mentor matching, cloud credit distribution, and team workspace allocation.',
    tag: 'Hackathon Track',
    eventId: 'campusshark-ecell-flagship-2026'
  },
  {
    id: 'sch-3',
    title: 'Live Elevator Pitch & Founder Battle Round 1',
    time: '02:30 PM - 05:30 PM',
    description: 'Top 30 selected student startup teams pitch 3-minute deck presentations live in front of angel investor jury.',
    tag: 'Startup Pitching',
    eventId: 'campusshark-ecell-flagship-2026'
  },
  {
    id: 'sch-4',
    title: 'Grand Finale, ₹10 Lakhs Grants & Networking Gala',
    time: '06:00 PM - 08:30 PM',
    description: 'Final pitch battlefield, announcement of ₹10 Lakhs equity-free grant winners, incubation awards, and dinner gala.',
    tag: 'Grand Finale',
    eventId: 'campusshark-ecell-flagship-2026'
  }
];
