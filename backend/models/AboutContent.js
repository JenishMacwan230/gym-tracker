const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, default: '🏆 EST. 2018 • METRO CITY' },
    title: { type: String, default: 'About Titan Fitness & Gym' },
    subtitle: { type: String, default: 'Built for champions, dedicated to progress. Discover our world-class facility, meet our visionary founder, and experience fitness redefined.' }
  },
  contactSection: {
    heading: { type: String, default: 'Contact Owner & Schedule a Tour' },
    subheading: { type: String, default: 'Have questions about membership, personal coaching, or facility visits? Send a message directly to Marcus Sterling.' }
  },
  location: {
    gymName: { type: String, default: 'Titan Fitness Headquarters' },
    streetAddress: { type: String, default: '742 Apex Heights Boulevard, West Wing Building' },
    suiteCity: { type: String, default: 'Suite 100 • Metro City, NY 10001' },
    landmark: { type: String, default: 'Opposite Metro Central Station (Free Member Parking in Rear)' },
    phoneFrontDesk: { type: String, default: '+1 (555) 019-2831' },
    phoneWhatsapp: { type: String, default: '+1 (555) 019-2839' },
    email: { type: String, default: 'info@titanfitness.com' },
    googleMapsUrl: { type: String, default: 'https://maps.google.com' },
    hours: {
      weekday: { type: String, default: '5:00 AM – 11:00 PM' },
      saturday: { type: String, default: '6:00 AM – 10:00 PM' },
      sunday: { type: String, default: '7:00 AM – 8:00 PM' },
      vipNote: { type: String, default: '24/7 Access Enabled' }
    }
  },
  founder: {
    name: { type: String, default: 'Marcus Sterling' },
    role: { type: String, default: 'FOUNDER & HEAD PERFORMANCE COACH' },
    bio: { type: String, default: '"I founded Titan Fitness with a singular mission: to eliminate generic workout culture and build an elite environment where individuals of all athletic levels feel inspired to push beyond their limits. Fitness transformed my life, and creating this sanctuary is my contribution to our community."' },
    experienceYears: { type: String, default: '15+' },
    imageUrl: { type: String, default: '/about/owner.png' },
    email: { type: String, default: 'marcus@titanfitness.com' },
    phone: { type: String, default: '+1 (555) 892-4410' },
    credentials: [
      { type: String }
    ]
  },
  photos: [
    {
      id: { type: String },
      title: { type: String },
      category: { type: String },
      src: { type: String },
      desc: { type: String }
    }
  ]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);
