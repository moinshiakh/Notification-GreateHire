// // import dotenv from "dotenv";
// // require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const app = express();
// const PORT = process.env.PORT || 3001;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prasadmargaj14_db_user:Moinprasad@cluster0.fwwvefa.mongodb.net/notifications';

// // Fallback in-memory storage
// let notifications = [];
// let notificationId = 1;
// let useMemory = false;

// // MongoDB Connection
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     console.log('✅ Connected to MongoDB');
//     useMemory = false;
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err);
//     console.log('📝 Using in-memory storage as fallback');
//     useMemory = true;
//   });

// // Notification Schema
// const notificationSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   type: { type: String, default: 'info' },
//   priority: { type: String, default: 'medium' },
//   read: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
//   timestamp: { type: Number, default: Date.now }
// });

// // Transform _id to id for frontend compatibility
// notificationSchema.set('toJSON', {
//   transform: function(doc, ret) {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//     return ret;
//   }
// });

// const Notification = mongoose.model('Notification', notificationSchema);


// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Get all notifications
// app.get('/api/notifications', async (req, res) => {
//   try {
//     if (useMemory) {
//       res.status(200).json({
//         success: true,
//         data: notifications,
//         count: notifications.length,
//         unreadCount: notifications.filter(n => !n.read).length
//       });
//     } else {
//       const notificationList = await Notification.find().sort({ createdAt: -1 });
//       const unreadCount = await Notification.countDocuments({ read: false });
      
//       res.status(200).json({
//         success: true,
//         data: notificationList,
//         count: notificationList.length,
//         unreadCount
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching notifications',
//       error: error.message
//     });
//   }
// });

// // Create new notification
// app.post('/api/notifications', async (req, res) => {
//   try {
//     const { title, message, type, priority } = req.body;

//     if (!title || !message) {
//       return res.status(400).json({
//         success: false,
//         message: 'Title and message are required'
//       });
//     }

//     if (useMemory) {
//       const newNotification = {
//         id: notificationId++,
//         title,
//         message,
//         type: type || 'info',
//         priority: priority || 'medium',
//         read: false,
//         createdAt: new Date().toISOString(),
//         timestamp: Date.now()
//       };
//       notifications.unshift(newNotification);
      
//       res.status(201).json({
//         success: true,
//         message: 'Notification created successfully',
//         data: newNotification
//       });
//     } else {
//       const newNotification = new Notification({
//         title,
//         message,
//         type: type || 'info',
//         priority: priority || 'medium'
//       });

//       await newNotification.save();

//       res.status(201).json({
//         success: true,
//         message: 'Notification created successfully',
//         data: newNotification
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating notification',
//       error: error.message
//     });
//   }
// });

// // Mark notification as read
// app.put('/api/notifications/:id/read', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const notification = await Notification.findByIdAndUpdate(
//       id,
//       { read: true },
//       { new: true }
//     );

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Notification marked as read',
//       data: notification
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating notification',
//       error: error.message
//     });
//   }
// });

// // Mark all notifications as read
// app.put('/api/notifications/read-all', async (req, res) => {
//   try {
//     await Notification.updateMany({}, { read: true });

//     res.status(200).json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating notifications',
//       error: error.message
//     });
//   }
// });

// // Delete notification
// app.delete('/api/notifications/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const notification = await Notification.findByIdAndDelete(id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Notification deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting notification',
//       error: error.message
//     });
//   }
// });

// // Clear all notifications
// app.delete('/api/notifications', async (req, res) => {
//   try {
//     await Notification.deleteMany({});

//     res.status(200).json({
//       success: true,
//       message: 'All notifications cleared'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error clearing notifications',
//       error: error.message
//     });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   console.log(`📡 API Endpoints:`);
//   console.log(`   GET    /api/notifications`);
//   console.log(`   POST   /api/notifications`);
//   console.log(`   PUT    /api/notifications/:id/read`);
//   console.log(`   PUT    /api/notifications/read-all`);
//   console.log(`   DELETE /api/notifications/:id`);
//   console.log(`   DELETE /api/notifications`);
// });

// server.on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
//     server.listen(PORT + 1, () => {
//       console.log(`🚀 Server is running on http://localhost:${PORT + 1}`);
//     });
//   } else {
//     console.error('❌ Server error:', err);
//   }
// });

// module.exports = app;


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not set. Using in-memory storage.');
}

const MONGODB_URI = process.env.MONGODB_URI;

// ------------------
// In-memory fallback
// ------------------
let notifications = [];
let notificationId = 1;
let useMemory = true;

// ------------------
// MongoDB Connection
// ------------------
mongoose.set('strictQuery', true);

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      useMemory = false;
    })
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      console.log('📝 Falling back to in-memory storage');
      useMemory = true;
    });
}

// ------------------
// Schema
// ------------------
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  priority: { type: String, default: 'medium' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  timestamp: { type: Number, default: () => Date.now() }
});

notificationSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

// ------------------
// Middleware
// ------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------
// Routes
// ------------------
app.get('/api/notifications', async (req, res) => {
  try {
    if (useMemory) {
      return res.json({
        success: true,
        data: notifications,
        count: notifications.length,
        unreadCount: notifications.filter(n => !n.read).length
      });
    }

    const data = await Notification.find().sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ read: false });

    res.json({
      success: true,
      data,
      count: data.length,
      unreadCount
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create
app.post('/api/notifications', async (req, res) => {
  const { title, message, type, priority } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message required' });
  }

  if (useMemory) {
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
    notifications.unshift(newNotification);
    return res.status(201).json({ success: true, data: newNotification });
  }

  const doc = await Notification.create({ title, message, type, priority });
  res.status(201).json({ success: true, data: doc });
});

// Mark read
app.put('/api/notifications/:id/read', async (req, res) => {
  const { id } = req.params;

  if (useMemory) {
    const n = notifications.find(n => n.id == id);
    if (!n) return res.status(404).json({ success: false });
    n.read = true;
    return res.json({ success: true, data: n });
  }

  const updated = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
  if (!updated) return res.status(404).json({ success: false });
  res.json({ success: true, data: updated });
});

// Mark all read
app.put('/api/notifications/read-all', async (_, res) => {
  if (useMemory) {
    notifications.forEach(n => (n.read = true));
    return res.json({ success: true });
  }

  await Notification.updateMany({}, { read: true });
  res.json({ success: true });
});

// Delete one
app.delete('/api/notifications/:id', async (req, res) => {
  const { id } = req.params;

  if (useMemory) {
    notifications = notifications.filter(n => n.id != id);
    return res.json({ success: true });
  }

  await Notification.findByIdAndDelete(id);
  res.json({ success: true });
});

// Clear all
app.delete('/api/notifications', async (_, res) => {
  if (useMemory) {
    notifications = [];
    return res.json({ success: true });
  }

  await Notification.deleteMany({});
  res.json({ success: true });
});

// Health
app.get('/api/health', (_, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// ------------------
// Server Start
// ------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;