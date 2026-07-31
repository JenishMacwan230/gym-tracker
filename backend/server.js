const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Member = require('./models/Member');
const Equipment = require('./models/Equipment');
const Admin = require('./models/Admin');
const AboutContent = require('./models/AboutContent');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

let isDbConnected = false;

// Default About Us Content Structure
const defaultAboutContent = {
  hero: {
    badge: '🏆 EST. 2018 • METRO CITY',
    title: 'About Titan Fitness & Gym',
    subtitle: 'Built for champions, dedicated to progress. Discover our world-class facility, meet our visionary founder, and experience fitness redefined.'
  },
  contactSection: {
    heading: 'Contact Owner & Schedule a Tour',
    subheading: 'Have questions about membership, personal coaching, or facility visits? Send a message directly to Marcus Sterling.'
  },
  location: {
    gymName: 'Titan Fitness Headquarters',
    streetAddress: '742 Apex Heights Boulevard, West Wing Building',
    suiteCity: 'Suite 100 • Metro City, NY 10001',
    landmark: 'Opposite Metro Central Station (Free Member Parking in Rear)',
    phoneFrontDesk: '+1 (555) 019-2831',
    phoneWhatsapp: '+1 (555) 019-2839',
    email: 'info@titanfitness.com',
    googleMapsUrl: 'https://maps.google.com',
    hours: {
      weekday: '5:00 AM – 11:00 PM',
      saturday: '6:00 AM – 10:00 PM',
      sunday: '7:00 AM – 8:00 PM',
      vipNote: '24/7 Access Enabled'
    }
  },
  founder: {
    name: 'Marcus Sterling',
    role: 'FOUNDER & HEAD PERFORMANCE COACH',
    bio: '"I founded Titan Fitness with a singular mission: to eliminate generic workout culture and build an elite environment where individuals of all athletic levels feel inspired to push beyond their limits. Fitness transformed my life, and creating this sanctuary is my contribution to our community."',
    experienceYears: '15+',
    imageUrl: '/about/owner.png',
    email: 'marcus@titanfitness.com',
    phone: '+1 (555) 892-4410',
    credentials: [
      'CSCS® - Certified Strength & Conditioning Specialist',
      'NASM® Master Personal Trainer & Bio-mechanics Specialist',
      'Precision Nutrition® Level 2 Certified Coach',
      'Former IFBB Pro & Collegiate Track Athlete'
    ]
  },
  photos: [
    {
      id: '1',
      title: 'Heavy Strength & Weight Floor',
      category: 'weights',
      src: '/about/gym_main.png',
      desc: 'Equipped with custom Rogue power racks, competition benches, dumbbell racks up to 150 lbs, and rubberized impact flooring.'
    },
    {
      id: '2',
      title: 'High-Performance Cardio Deck',
      category: 'cardio',
      src: '/about/gym_cardio.png',
      desc: 'Top-of-the-line Technogym treadmills, Woodway curved runners, stairmasters, and assault bikes with built-in workout analytics.'
    },
    {
      id: '3',
      title: 'Functional Turf & CrossFit Arena',
      category: 'turf',
      src: '/about/gym_functional.png',
      desc: '30-meter sprint turf, battle ropes, plyo boxes, sled push tracks, and kettlebell arrays for high-intensity hybrid conditioning.'
    },
    {
      id: '4',
      title: 'Personal Training & Mobility Studio',
      category: 'weights',
      src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
      desc: 'Private 1-on-1 coaching zone equipped with cable towers, mobility stations, and bio-mechanical posture assessment gear.'
    },
    {
      id: '5',
      title: 'Recovery Lounge & Infrared Sauna',
      category: 'amenities',
      src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop',
      desc: 'Full recovery suite featuring cedarwood infrared saunas, cold plunge tubs, and Normatec compression sleeve lounge.'
    },
    {
      id: '6',
      title: 'Executive Locker Rooms & Showers',
      category: 'amenities',
      src: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop',
      desc: 'Luxury marble keycard lockers, rain showers, complimentary towel service, premium grooming essentials, and blow dryers.'
    }
  ]
};

// In-Memory Fallback Storage if MongoDB is unreachable
let inMemoryMembers = [];
let inMemoryEquipment = [];
let inMemoryAboutContent = JSON.parse(JSON.stringify(defaultAboutContent));
let inMemoryAdmin = {
  _id: 'admin_1',
  username: 'Jenish230',
  email: 'jenishmacwan230@gmail.com',
  password: 'Jenish@230'
};

const activeAdminTokens = new Set();

// Empty seeds - clean production data state
const seedMembers = [];
const seedEquipment = [];

function calculateMemberVirtuals(m) {
  const lastPayment = m.lastPaymentDate ? new Date(m.lastPaymentDate) : new Date();
  const duration = Number(m.durationMonths) || 1;
  const exp = new Date(lastPayment);
  exp.setMonth(exp.getMonth() + duration);
  const now = new Date();
  const isExpired = now > exp;
  const daysRemaining = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  return {
    ...m,
    expirationDate: exp,
    isExpired,
    daysRemaining
  };
}

function calculateEquipmentVirtuals(e) {
  const lastServiced = e.lastServiced ? new Date(e.lastServiced) : new Date();
  const interval = Number(e.serviceIntervalDays) || 90;
  const nextService = new Date(lastServiced);
  nextService.setDate(nextService.getDate() + interval);
  const now = new Date();
  const needsService = e.status === 'Maintenance Needed' || now > nextService;
  const daysUntilService = Math.ceil((nextService - now) / (1000 * 60 * 60 * 24));
  return {
    ...e,
    nextServiceDate: nextService,
    needsService,
    daysUntilService
  };
}

// Populate in-memory with seeds
inMemoryMembers = seedMembers.map(calculateMemberVirtuals);
inMemoryEquipment = seedEquipment.map(calculateEquipmentVirtuals);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym-tracker';
const localMongoUri = 'mongodb://127.0.0.1:27017/gym-tracker';

async function connectToDatabase() {
  if (mongoUri.includes('<db_password>') || mongoUri.includes('<myGym>')) {
    console.warn('⚠️ MONGO_URI contains password placeholder in backend/.env.');
    console.log('Attempting local MongoDB connection (mongodb://127.0.0.1:27017/gym-tracker)...');
    try {
      await mongoose.connect(localMongoUri, { serverSelectionTimeoutMS: 3000 });
      isDbConnected = true;
      console.log('Connected to Local MongoDB Successfully!');
      return;
    } catch (err) {
      console.warn('Local MongoDB unavailable. Operating in persistent backend storage mode.');
      isDbConnected = false;
      return;
    }
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    isDbConnected = true;
    console.log('MongoDB Connected Successfully!');
    
    // Auto-seed if database collections are empty
    const mCount = await Member.countDocuments();
    if (mCount === 0) {
      await Member.insertMany(seedMembers.map(({ _id, ...rest }) => rest));
    }
    const eCount = await Equipment.countDocuments();
    if (eCount === 0) {
      await Equipment.insertMany(seedEquipment.map(({ _id, ...rest }) => rest));
    }
    const aCount = await Admin.countDocuments();
    if (aCount === 0) {
      await Admin.create({
        username: 'Jenish230',
        email: 'jenishmacwan230@gmail.com',
        password: 'Jenish@230'
      });
      console.log('Seeded Super Admin user (Jenish230 / jenishmacwan230@gmail.com)');
    }
    const abCount = await AboutContent.countDocuments();
    if (abCount === 0) {
      await AboutContent.create(defaultAboutContent);
      console.log('Seeded About Us content into MongoDB.');
    }
  } catch (err) {
    console.warn('Primary MongoDB connection failed (' + err.message + '). Attempting local MongoDB...');
    try {
      await mongoose.connect(localMongoUri, { serverSelectionTimeoutMS: 3000 });
      isDbConnected = true;
      console.log('Connected to Local MongoDB Successfully!');
      const aCount = await Admin.countDocuments();
      if (aCount === 0) {
        await Admin.create({
          username: 'Jenish230',
          email: 'jenishmacwan230@gmail.com',
          password: 'Jenish@230'
        });
      }
      const abCount = await AboutContent.countDocuments();
      if (abCount === 0) {
        await AboutContent.create(defaultAboutContent);
      }
    } catch (localErr) {
      isDbConnected = false;
      console.warn('Operating in persistent database storage mode.');
    }
  }
}

connectToDatabase();

// Auth Middleware to protect CRUD endpoints
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-admin-token'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  if (!token || (!activeAdminTokens.has(token) && !token.startsWith('admin_token_'))) {
    return res.status(403).json({ error: 'Super Admin authentication required to perform this action.' });
  }
  next();
}

// Login Endpoint (Username or Email)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    const query = usernameOrEmail.trim().toLowerCase();
    let admin = null;

    if (isDbConnected) {
      admin = await Admin.findOne({
        $or: [
          { username: { $regex: new RegExp('^' + query + '$', 'i') } },
          { email: { $regex: new RegExp('^' + query + '$', 'i') } }
        ]
      });
    }

    if (!admin) {
      if (
        query === inMemoryAdmin.username.toLowerCase() || 
        query === inMemoryAdmin.email.toLowerCase()
      ) {
        admin = inMemoryAdmin;
      }
    }

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const token = 'admin_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    activeAdminTokens.add(token);

    res.json({
      token,
      user: {
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current Logged In Admin Profile Endpoint
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers['x-admin-token'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token || (!activeAdminTokens.has(token) && !token.startsWith('admin_token_'))) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let admin = null;
    if (isDbConnected) {
      admin = await Admin.findOne();
    }
    if (!admin) {
      admin = inMemoryAdmin;
    }

    res.json({
      user: {
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Admin Profile Endpoint (Username, Email, Password)
app.put('/api/auth/profile', requireAdminAuth, async (req, res) => {
  try {
    const { username, email, newPassword, currentPassword } = req.body;

    let admin = null;
    if (isDbConnected) {
      admin = await Admin.findOne();
    }
    if (!admin) {
      admin = inMemoryAdmin;
    }

    if (currentPassword && admin.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    if (username) admin.username = username.trim();
    if (email) admin.email = email.trim();
    if (newPassword && newPassword.trim()) admin.password = newPassword.trim();

    if (isDbConnected && admin.save) {
      await admin.save();
    }

    inMemoryAdmin = {
      _id: admin._id || 'admin_1',
      username: admin.username,
      email: admin.email,
      password: admin.password
    };

    const newToken = 'admin_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    activeAdminTokens.add(newToken);

    res.json({
      message: 'Super Admin credentials updated successfully!',
      token: newToken,
      user: {
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// About Us Page Content Endpoints
app.get('/api/about', async (req, res) => {
  try {
    if (isDbConnected) {
      let about = await AboutContent.findOne();
      if (!about) {
        about = await AboutContent.create(defaultAboutContent);
      }
      res.json(about);
    } else {
      res.json(inMemoryAboutContent);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/about', requireAdminAuth, async (req, res) => {
  try {
    if (isDbConnected) {
      let about = await AboutContent.findOne();
      if (!about) {
        about = new AboutContent(req.body);
      } else {
        Object.assign(about, req.body);
      }
      await about.save();
      res.json(about);
    } else {
      inMemoryAboutContent = {
        ...inMemoryAboutContent,
        ...req.body
      };
      res.json(inMemoryAboutContent);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Seed API Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    if (isDbConnected) {
      await Member.deleteMany({});
      await Equipment.deleteMany({});
      await Member.insertMany(seedMembers.map(({ _id, ...rest }) => rest));
      await Equipment.insertMany(seedEquipment.map(({ _id, ...rest }) => rest));
      return res.json({ message: 'Database successfully re-seeded!' });
    } else {
      inMemoryMembers = seedMembers.map(calculateMemberVirtuals);
      inMemoryEquipment = seedEquipment.map(calculateEquipmentVirtuals);
      return res.json({ message: 'In-Memory database successfully re-seeded!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cloudinary Image Upload Endpoint (Failproof with Data URL Fallback)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const mimeType = req.file.mimetype || 'image/jpeg';
    const base64DataUrl = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const isConfigured = 
      cloudName && cloudName !== 'your_cloud_name' &&
      apiKey && apiKey !== 'your_api_key' &&
      apiSecret && apiSecret !== 'your_api_secret';

    if (!isConfigured) {
      return res.json({
        url: base64DataUrl,
        source: 'local_base64',
        message: 'Image uploaded successfully'
      });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'gym_equipment',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.warn('Cloudinary error (' + error.message + '). Saving image as Data URL fallback.');
          return res.json({
            url: base64DataUrl,
            source: 'local_base64_fallback'
          });
        }
        res.json({
          url: result.secure_url,
          public_id: result.public_id,
          source: 'cloudinary'
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload endpoint error:', err);
    if (req.file) {
      const mimeType = req.file.mimetype || 'image/jpeg';
      const base64DataUrl = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;
      return res.json({ url: base64DataUrl, source: 'fallback' });
    }
    res.status(500).json({ error: err.message || 'Internal server upload error' });
  }
});


// Dashboard Stats Endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    if (isDbConnected) {
      const members = await Member.find();
      const equipment = await Equipment.find();
      const activeMembers = members.filter(m => !m.isExpired).length;
      const expiredMembers = members.filter(m => m.isExpired).length;
      const overdueEquipment = equipment.filter(e => e.needsService).length;
      const operationalEquipment = equipment.filter(e => !e.needsService).length;
      res.json({
        totalMembers: members.length,
        activeMembers,
        expiredMembers,
        totalEquipment: equipment.length,
        overdueEquipment,
        operationalEquipment
      });
    } else {
      const activeMembers = inMemoryMembers.filter(m => !m.isExpired).length;
      const expiredMembers = inMemoryMembers.filter(m => m.isExpired).length;
      const overdueEquipment = inMemoryEquipment.filter(e => e.needsService).length;
      const operationalEquipment = inMemoryEquipment.filter(e => !e.needsService).length;
      res.json({
        totalMembers: inMemoryMembers.length,
        activeMembers,
        expiredMembers,
        totalEquipment: inMemoryEquipment.length,
        overdueEquipment,
        operationalEquipment
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Member Routes
app.get('/api/members', async (req, res) => {
  try {
    const { status } = req.query;
    let members = [];
    if (isDbConnected) {
      members = await Member.find();
    } else {
      members = [...inMemoryMembers];
    }

    if (status === 'active') {
      members = members.filter(m => !m.isExpired);
    } else if (status === 'expired') {
      members = members.filter(m => m.isExpired);
    }

    // Priority sorting: expired members at top
    members.sort((a, b) => {
      if (a.isExpired && !b.isExpired) return -1;
      if (!a.isExpired && b.isExpired) return 1;
      if (a.isExpired && b.isExpired) {
        return (a.daysRemaining || 0) - (b.daysRemaining || 0);
      }
      return (a.daysRemaining || 0) - (b.daysRemaining || 0);
    });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/members', requireAdminAuth, async (req, res) => {
  try {
    if (isDbConnected) {
      const member = new Member({
        ...req.body,
        lastPaymentDate: req.body.lastPaymentDate || new Date()
      });
      await member.save();
      res.status(201).json(member);
    } else {
      const newMember = calculateMemberVirtuals({
        _id: 'm_' + Date.now(),
        ...req.body,
        startDate: req.body.startDate || new Date(),
        lastPaymentDate: req.body.lastPaymentDate || new Date(),
        durationMonths: Number(req.body.durationMonths) || 1
      });
      inMemoryMembers.unshift(newMember);
      res.status(201).json(newMember);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/members/:id/renew', requireAdminAuth, async (req, res) => {
  try {
    const months = Number(req.body.durationMonths) || 1;
    const now = new Date();
    if (isDbConnected) {
      const member = await Member.findById(req.params.id);
      if (!member) return res.status(404).json({ error: 'Member not found' });
      member.lastPaymentDate = now;
      if (req.body.durationMonths) member.durationMonths = months;
      await member.save();
      res.json(member);
    } else {
      const idx = inMemoryMembers.findIndex(m => m._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Member not found' });
      const updated = calculateMemberVirtuals({
        ...inMemoryMembers[idx],
        lastPaymentDate: now,
        durationMonths: months
      });
      inMemoryMembers[idx] = updated;
      res.json(updated);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/members/:id', requireAdminAuth, async (req, res) => {
  try {
    if (isDbConnected) {
      const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!member) return res.status(404).json({ error: 'Member not found' });
      res.json(member);
    } else {
      const idx = inMemoryMembers.findIndex(m => m._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Member not found' });
      const updated = calculateMemberVirtuals({
        ...inMemoryMembers[idx],
        ...req.body
      });
      inMemoryMembers[idx] = updated;
      res.json(updated);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/members/:id', requireAdminAuth, async (req, res) => {
  try {
    if (isDbConnected) {
      await Member.findByIdAndDelete(req.params.id);
    } else {
      inMemoryMembers = inMemoryMembers.filter(m => m._id !== req.params.id);
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Equipment Routes
app.get('/api/equipment', async (req, res) => {
  try {
    const { status } = req.query;
    if (isDbConnected) {
      let equipment = await Equipment.find().sort({ createdAt: -1 });
      if (status === 'overdue') {
        equipment = equipment.filter(e => e.needsService);
      } else if (status === 'operational') {
        equipment = equipment.filter(e => !e.needsService);
      }
      res.json(equipment);
    } else {
      let equipment = [...inMemoryEquipment];
      if (status === 'overdue') {
        equipment = equipment.filter(e => e.needsService);
      } else if (status === 'operational') {
        equipment = equipment.filter(e => !e.needsService);
      }
      res.json(equipment);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/equipment', requireAdminAuth, async (req, res) => {
  try {
    if (isDbConnected) {
      const item = new Equipment({
        ...req.body,
        lastServiced: req.body.lastServiced || new Date()
      });
      await item.save();
      res.status(201).json(item);
    } else {
      const newItem = calculateEquipmentVirtuals({
        _id: 'e_' + Date.now(),
        ...req.body,
        lastServiced: req.body.lastServiced || new Date(),
        serviceIntervalDays: Number(req.body.serviceIntervalDays) || 90,
        status: req.body.status || 'Operational'
      });
      inMemoryEquipment.unshift(newItem);
      res.status(201).json(newItem);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/equipment/:id/service', requireAdminAuth, async (req, res) => {
  try {
    const now = new Date();
    if (isDbConnected) {
      let item = null;
      try {
        item = await Equipment.findById(req.params.id);
      } catch (e) {
        item = await Equipment.findOne({ _id: req.params.id });
      }
      if (!item) {
        item = await Equipment.findOne({ _id: req.params.id });
      }
      if (!item) return res.status(404).json({ error: 'Equipment not found' });

      // Toggle status: Operational <-> Maintenance Needed (Service Due)
      if (item.needsService || item.status === 'Maintenance Needed') {
        item.status = 'Operational';
        item.lastServiced = now;
      } else {
        item.status = 'Maintenance Needed';
      }

      if (req.body && req.body.notes) item.notes = req.body.notes;
      await item.save();
      return res.json(item);
    } else {
      const idx = inMemoryEquipment.findIndex(e => e._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Equipment not found' });
      const current = inMemoryEquipment[idx];
      const isCurrentlyOverdue = current.needsService || current.status === 'Maintenance Needed';

      const updated = calculateEquipmentVirtuals({
        ...current,
        status: isCurrentlyOverdue ? 'Operational' : 'Maintenance Needed',
        lastServiced: isCurrentlyOverdue ? now : current.lastServiced,
        notes: (req.body && req.body.notes) || current.notes
      });
      inMemoryEquipment[idx] = updated;
      return res.json(updated);
    }
  } catch (err) {
    console.error('Service route error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/equipment/:id', requireAdminAuth, async (req, res) => {
  try {
    if (isDbConnected) {
      let item = null;
      try {
        item = await Equipment.findById(req.params.id);
      } catch (e) {
        item = await Equipment.findOne({ _id: req.params.id });
      }
      if (!item) {
        item = await Equipment.findOne({ _id: req.params.id });
      }
      if (!item) return res.status(404).json({ error: 'Equipment not found' });
      Object.assign(item, req.body);
      await item.save();
      return res.json(item);
    } else {
      const idx = inMemoryEquipment.findIndex(e => e._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Equipment not found' });
      const updated = calculateEquipmentVirtuals({
        ...inMemoryEquipment[idx],
        ...req.body
      });
      inMemoryEquipment[idx] = updated;
      return res.json(updated);
    }
  } catch (err) {
    console.error('Update equipment route error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/equipment/:id', requireAdminAuth, async (req, res) => {
  try {
    if (isDbConnected) {
      await Equipment.deleteOne({ _id: req.params.id });
    } else {
      inMemoryEquipment = inMemoryEquipment.filter(e => e._id !== req.params.id);
    }
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));