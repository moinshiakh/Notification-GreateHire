// server.js - Node.js Backend
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for notifications (use database in production)
let notifications = [];
let notificationId = 1;

// Get all notifications
app.get('/api/notifications', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// Create new notification
app.post('/api/notifications', (req, res) => {
  try {
    const { title, message, type, priority } = req.body;

    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    const newNotification = {
      id: notificationId++,
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      read: false,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    notifications.unshift(newNotification); // Add to beginning

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === parseInt(id));

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', (req, res) => {
  try {
    notifications.forEach(n => n.read = true);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notifications',
      error: error.message
    });
  }
});

// Delete notification
app.delete('/api/notifications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = notifications.findIndex(n => n.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notifications.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

// Clear all notifications
app.delete('/api/notifications', (req, res) => {
  try {
    notifications = [];

    res.status(200).json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing notifications',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET    /api/notifications`);
  console.log(`   POST   /api/notifications`);
  console.log(`   PUT    /api/notifications/:id/read`);
  console.log(`   PUT    /api/notifications/read-all`);
  console.log(`   DELETE /api/notifications/:id`);
  console.log(`   DELETE /api/notifications`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    server.listen(PORT + 1, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT + 1}`);
    });
  } else {
    console.error('❌ Server error:', err);
  }
});

module.exports = app;