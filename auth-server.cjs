const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

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
  },
  {
    id: '4',
    name: 'Cozy Lodge',
    type: 'lodge',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1470&auto=format&fit=crop',
    description: 'A cozy lodge nestled in the heart of the forest.',
    location: 'Nyungwe',
    fullAddress: 'Nyungwe Forest, Rwanda',
    latitude: '-2.5000',
    longitude: '29.2500',
    contact: 'bookings@cozylodge.com',
    phone: '+250 784 789 123',
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Safari Adventure',
    type: 'adventure',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1470&auto=format&fit=crop',
    description: 'Experience the wildlife of Rwanda on an exciting safari adventure.',
    location: 'Akagera',
    fullAddress: 'Akagera National Park, Rwanda',
    latitude: '-1.9000',
    longitude: '30.7000',
    contact: 'safari@adventures.com',
    phone: '+250 784 321 654',
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Register endpoint - No email confirmation required
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

    // Create new user - automatically verified (no email confirmation)
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

    // Add user to the in-memory database
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log the new user for debugging
    console.log('New user registered:', {
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    });

    // Return success with user data and token
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

// Login endpoint
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

    // Log the login for debugging
    console.log('User logged in:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// Get featured activities
app.get('/api/activities/featured', (req, res) => {
  const featuredActivities = activities.filter(activity => activity.featured);
  console.log('Featured activities endpoint called, returning', featuredActivities.length, 'activities');
  res.json(featuredActivities);
});

// Get all activities
app.get('/api/activities', (req, res) => {
  console.log('Activities endpoint called, returning', activities.length, 'activities');
  res.json(activities);
});

// Get activity by ID
app.get('/api/activities/:id', (req, res) => {
  try {
    console.log('Getting activity with ID:', req.params.id);

    const activity = activities.find(a => a.id === req.params.id);

    if (!activity) {
      console.log('Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    console.log('Returning activity with ID:', activity.id);
    res.json(activity);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
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
    console.log('Created new activity with ID:', newActivity.id);
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

    console.log('Updating activity with ID:', req.params.id);

    const index = activities.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      console.log('Update activity: Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    activities[index] = {
      ...activities[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    console.log('Activity updated successfully:', activities[index].id);
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
      console.log('Delete activity: Forbidden - User is not admin');
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('Attempting to delete activity with ID:', req.params.id);

    const index = activities.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      console.log('Delete activity: Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Remove the activity from the array
    const deletedActivity = activities.splice(index, 1)[0];
    console.log('Activity successfully deleted:', deletedActivity.id);
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

    console.log('Toggling featured status for activity with ID:', req.params.id);

    const index = activities.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      console.log('Toggle featured: Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    activities[index].featured = !activities[index].featured;
    activities[index].updated_at = new Date().toISOString();

    console.log('Activity featured status toggled successfully:', activities[index].id, 'Featured:', activities[index].featured);
    res.json(activities[index]);
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
