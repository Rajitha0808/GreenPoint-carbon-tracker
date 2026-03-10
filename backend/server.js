const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'greenpoint-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Data storage paths
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const activitiesFile = path.join(dataDir, 'activities.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Helper functions
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const readActivities = () => {
  try {
    return JSON.parse(fs.readFileSync(activitiesFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeActivities = (activities) => {
  fs.writeFileSync(activitiesFile, JSON.stringify(activities, null, 2));
};

const calculateBadges = (points) => {
  const badges = [];
  if (points >= 50) badges.push('🌱 Eco Beginner');
  if (points >= 100) badges.push('🌿 Green Starter');
  if (points >= 250) badges.push('🌳 Eco Warrior');
  if (points >= 500) badges.push('🌍 Planet Protector');
  if (points >= 1000) badges.push('🏆 Climate Champion');
  return badges;
};

// Initialize data files with demo data
const initializeData = () => {
  let demoUsers = [];
  
  if (!fs.existsSync(usersFile)) {
    demoUsers = [
      {
        id: uuidv4(),
        username: 'eco_warrior',
        email: 'demo@greenpoint.com',
        password: bcrypt.hashSync('password123', 10),
        totalPoints: 850,
        badges: ['🌱 Eco Beginner', '🌿 Green Starter', '🌳 Eco Warrior'],
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        username: 'green_champion',
        email: 'champion@greenpoint.com',
        password: bcrypt.hashSync('password123', 10),
        totalPoints: 1200,
        badges: ['🌱 Eco Beginner', '🌿 Green Starter', '🌳 Eco Warrior', '🌍 Planet Protector', '🏆 Climate Champion'],
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        username: 'sustainability_pro',
        email: 'pro@greenpoint.com',
        password: bcrypt.hashSync('password123', 10),
        totalPoints: 450,
        badges: ['🌱 Eco Beginner', '🌿 Green Starter'],
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(usersFile, JSON.stringify(demoUsers, null, 2));
  }

  if (!fs.existsSync(activitiesFile)) {
    const users = readUsers();
    const demoActivities = [
      {
        id: uuidv4(),
        userId: users[0]?.id || demoUsers[0].id,
        activityName: 'Used bus instead of car',
        category: 'Transport',
        points: 20,
        date: new Date(Date.now() - 86400000).toISOString(),
        co2Saved: 2.5
      },
      {
        id: uuidv4(),
        userId: users[0]?.id || demoUsers[0].id,
        activityName: 'Ate a vegan meal',
        category: 'Food',
        points: 15,
        date: new Date(Date.now() - 172800000).toISOString(),
        co2Saved: 1.8
      },
      {
        id: uuidv4(),
        userId: users[1]?.id || demoUsers[1].id,
        activityName: 'Recycled plastic',
        category: 'Waste',
        points: 10,
        date: new Date().toISOString(),
        co2Saved: 0.8
      }
    ];
    fs.writeFileSync(activitiesFile, JSON.stringify(demoActivities, null, 2));
  }
};

initializeData();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const users = readUsers();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      totalPoints: 0,
      badges: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        totalPoints: newUser.totalPoints,
        badges: newUser.badges
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readUsers();

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
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        totalPoints: user.totalPoints,
        badges: user.badges
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      totalPoints: user.totalPoints,
      badges: user.badges
    }
  });
});

// Activity Routes
app.get('/api/activities', authenticateToken, (req, res) => {
  const activities = readActivities();
  const userActivities = activities.filter(a => a.userId === req.user.id);
  res.json(userActivities);
});

app.post('/api/activities', authenticateToken, (req, res) => {
  try {
    const { activityName, category, points } = req.body;
    const activities = readActivities();
    const users = readUsers();

    // Calculate CO2 saved (simplified calculation)
    const co2Saved = {
      'Transport': 2.5,
      'Food': 1.8,
      'Waste': 0.8,
      'Energy': 1.2
    }[category] || 1.0;

    const newActivity = {
      id: uuidv4(),
      userId: req.user.id,
      activityName,
      category,
      points,
      date: new Date().toISOString(),
      co2Saved
    };

    activities.push(newActivity);
    writeActivities(activities);

    // Update user points and badges
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
      users[userIndex].totalPoints += points;
      users[userIndex].badges = calculateBadges(users[userIndex].totalPoints);
      writeUsers(users);
    }

    res.json({
      activity: newActivity,
      totalPoints: users[userIndex].totalPoints,
      badges: users[userIndex].badges
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leaderboard Routes
app.get('/api/leaderboard', (req, res) => {
  const users = readUsers();
  const leaderboard = users
    .map(u => ({
      username: u.username,
      totalPoints: u.totalPoints,
      badges: u.badges
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10);

  res.json(leaderboard);
});

// User Stats Routes
app.get('/api/user/stats', authenticateToken, (req, res) => {
  const activities = readActivities();
  const userActivities = activities.filter(a => a.userId === req.user.id);
  
  // Calculate stats
  const totalActivities = userActivities.length;
  const totalCO2Saved = userActivities.reduce((sum, a) => sum + a.co2Saved, 0);
  
  // Monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyActivities = userActivities.filter(a => {
    const date = new Date(a.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const monthlyCO2Saved = monthlyActivities.reduce((sum, a) => sum + a.co2Saved, 0);

  // Category breakdown
  const categoryStats = {};
  userActivities.forEach(activity => {
    if (!categoryStats[activity.category]) {
      categoryStats[activity.category] = { count: 0, points: 0 };
    }
    categoryStats[activity.category].count++;
    categoryStats[activity.category].points += activity.points;
  });

  res.json({
    totalActivities,
    totalCO2Saved,
    monthlyCO2Saved,
    categoryStats
  });
});

app.listen(PORT, () => {
  console.log(`GREENPOINT server running on port ${PORT}`);
});
