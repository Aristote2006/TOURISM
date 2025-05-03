const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory data store for activities
let activities = [
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

// API Routes

// Get featured activities
app.get('/api/activities/featured', (_, res) => {
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
app.get('/api/activities', (_, res) => {
  res.json(activities);
});

// Create activity
app.post('/api/activities', (req, res) => {
  const newActivity = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  activities.push(newActivity);
  res.status(201).json(newActivity);
});

// Update activity
app.put('/api/activities/:id', (req, res) => {
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
});

// Delete activity
app.delete('/api/activities/:id', (req, res) => {
  const index = activities.findIndex(a => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Activity not found' });
  }

  activities.splice(index, 1);
  res.json({ success: true });
});

// Toggle featured status
app.put('/api/activities/:id/featured', (req, res) => {
  const index = activities.findIndex(a => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Activity not found' });
  }

  activities[index].featured = !activities[index].featured;
  activities[index].updated_at = new Date().toISOString();

  res.json(activities[index]);
});

// Catch all other routes and return the React app
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
