const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: String,
  avatar_url: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  fullAddress: String,
  latitude: String,
  longitude: String,
  contact: String,
  phone: String,
  featured: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const userActivitySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  last_active: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update the updated_at field on save
userSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

activitySchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Define models
const User = mongoose.model('User', userSchema);
const Activity = mongoose.model('Activity', activitySchema);
const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not set');
  process.exit(1);
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Routes

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      first_name,
      last_name,
      phone,
      role: 'user'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last activity
    await UserActivity.findOneAndUpdate(
      { user_id: user._id },
      { last_active: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        avatar_url: user.avatar_url
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, phone, avatar_url } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        first_name,
        last_name,
        phone,
        avatar_url,
        updated_at: new Date()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: user.role
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user activity
app.put('/api/users/activity', authenticateToken, async (req, res) => {
  try {
    await UserActivity.findOneAndUpdate(
      { user_id: req.user.id },
      { last_active: new Date() },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all activities
app.get('/api/activities', async (_, res) => {
  try {
    const activities = await Activity.find().sort({ created_at: -1 });

    // Transform MongoDB documents to ensure proper ID field
    const transformedActivities = activities.map(activity => {
      const activityObj = activity.toObject();
      // Add id field if it doesn't exist (frontend expects 'id', MongoDB uses '_id')
      if (!activityObj.id) {
        activityObj.id = activityObj._id.toString();
      }
      return activityObj;
    });

    console.log('Returning activities with IDs:', transformedActivities.map(a => a.id));
    res.json(transformedActivities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured activities
app.get('/api/activities/featured', async (_, res) => {
  try {
    console.log('Getting featured activities');
    const activities = await Activity.find({ featured: true }).limit(6);

    // Transform MongoDB documents to ensure proper ID field
    const transformedActivities = activities.map(activity => {
      const activityObj = activity.toObject();
      // Add id field if it doesn't exist (frontend expects 'id', MongoDB uses '_id')
      if (!activityObj.id) {
        activityObj.id = activityObj._id.toString();
      }
      return activityObj;
    });

    console.log('Returning featured activities:', transformedActivities.length);
    res.json(transformedActivities);
  } catch (error) {
    console.error('Get featured activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity by ID
app.get('/api/activities/:id', async (req, res) => {
  try {
    console.log('Getting activity with ID:', req.params.id);

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Get activity: Invalid ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      console.log('Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Transform MongoDB document to ensure proper ID field
    const activityObj = activity.toObject();
    if (!activityObj.id) {
      activityObj.id = activityObj._id.toString();
    }

    console.log('Returning activity with ID:', activityObj.id);
    res.json(activityObj);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create activity
app.post('/api/activities', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const {
      name,
      type,
      image,
      description,
      location,
      fullAddress,
      latitude,
      longitude,
      contact,
      phone,
      featured
    } = req.body;

    const activity = new Activity({
      name,
      type,
      image,
      description,
      location,
      fullAddress,
      latitude,
      longitude,
      contact,
      phone,
      featured: featured || false
    });

    await activity.save();

    // Transform MongoDB document to ensure proper ID field
    const activityObj = activity.toObject();
    if (!activityObj.id) {
      activityObj.id = activityObj._id.toString();
    }

    console.log('Created new activity with ID:', activityObj.id);
    res.status(201).json(activityObj);
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update activity
app.put('/api/activities/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('Updating activity with ID:', req.params.id);

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Update activity: Invalid ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!activity) {
      console.log('Update activity: Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Transform MongoDB document to ensure proper ID field
    const activityObj = activity.toObject();
    if (!activityObj.id) {
      activityObj.id = activityObj._id.toString();
    }

    console.log('Activity updated successfully:', activityObj.id);
    res.json(activityObj);
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete activity
app.delete('/api/activities/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('Delete activity: Forbidden - User is not admin');
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('Attempting to delete activity with ID:', req.params.id);

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Delete activity: Invalid ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      console.log('Delete activity: Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    console.log('Activity successfully deleted:', req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status
app.put('/api/activities/:id/featured', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('Toggling featured status for activity with ID:', req.params.id);

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Toggle featured: Invalid ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid activity ID format' });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      console.log('Toggle featured: Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    activity.featured = !activity.featured;
    activity.updated_at = new Date();

    await activity.save();

    // Transform MongoDB document to ensure proper ID field
    const activityObj = activity.toObject();
    if (!activityObj.id) {
      activityObj.id = activityObj._id.toString();
    }

    console.log('Activity featured status toggled successfully:', activityObj.id, 'Featured:', activityObj.featured);
    res.json(activityObj);
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Catch all other routes and return the React app
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
