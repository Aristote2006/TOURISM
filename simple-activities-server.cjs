const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory data store for users
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    // Password: admin123
    password: '$2b$10$EXtPYmN4ZjvQfnGBrFvXp.yGRNBHI5zZUBqzDWEn3xnqFj8WXqvVe',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// In-memory data store for user activity
const userActivity = [];

// In-memory data store for activities
const activities = [
  {
    id: '1',
    name: 'Mountain Hiking',
    type: 'adventure',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop',
    description: 'Experience the thrill of hiking in the beautiful mountains.',
    location: 'Musanze',
    fullAddress: 'Volcanoes National Park, Musanze, Rwanda',
    latitude: '-1.4833',
    longitude: '29.6333',
    contact: 'info@mountainhiking.com',
    phone: '+250 784 123 456',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Luxury Resort',
    type: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop',
    description: 'Relax and unwind at our luxury resort with stunning views.',
    location: 'Kigali',
    fullAddress: 'KG 9 Ave, Kigali, Rwanda',
    latitude: '-1.9441',
    longitude: '30.0619',
    contact: 'reservations@luxuryresort.com',
    phone: '+250 784 987 654',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Lakeside Restaurant',
    type: 'restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop',
    description: 'Enjoy delicious meals with a beautiful view of the lake.',
    location: 'Kibuye',
    fullAddress: 'Lake Kivu, Kibuye, Rwanda',
    latitude: '-2.0600',
    longitude: '29.3500',
    contact: 'info@lakesiderestaurant.com',
    phone: '+250 784 456 789',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

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

// API Routes

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role
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
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last activity
    const now = new Date().toISOString();
    const activityIndex = userActivity.findIndex(a => a.user_id === user.id);

    if (activityIndex !== -1) {
      userActivity[activityIndex].last_active = now;
    } else {
      userActivity.push({
        user_id: user.id,
        last_active: now
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
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
app.get('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
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

// Update user activity
app.put('/api/users/activity', authenticateToken, (req, res) => {
  try {
    const now = new Date().toISOString();
    const activityIndex = userActivity.findIndex(a => a.user_id === req.user.id);

    if (activityIndex !== -1) {
      userActivity[activityIndex].last_active = now;
    } else {
      userActivity.push({
        user_id: req.user.id,
        last_active: now
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Activity Routes

// Get featured activities
app.get('/api/activities/featured', (req, res) => {
  const featuredActivities = activities.filter(activity => activity.featured);
  res.json(featuredActivities);
});

// Get activity by ID
app.get('/api/activities/:id', (req, res) => {
  const activity = activities.find(a => a.id === req.params.id);
  if (!activity) {
    return res.status(404).json({ message: 'Activity not found' });
  }
  res.json(activity);
});

// Get all activities
app.get('/api/activities', (req, res) => {
  res.json(activities);
});

// Create activity
app.post('/api/activities', authenticateToken, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newActivity = {
      id: Date.now().toString(),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    activities.push(newActivity);
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update activity
app.put('/api/activities/:id', authenticateToken, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const index = activities.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activities[index] = {
      ...activities[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    res.json(activities[index]);
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete activity
app.delete('/api/activities/:id', authenticateToken, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const index = activities.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activities.splice(index, 1);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status
app.put('/api/activities/:id/featured', authenticateToken, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const index = activities.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activities[index].featured = !activities[index].featured;
    activities[index].updated_at = new Date().toISOString();

    res.json(activities[index]);
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
