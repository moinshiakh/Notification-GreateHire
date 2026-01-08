import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationForm from './components/NotificationForm';
import NotificationBell from './components/NotificationBell';
import Dashboard from './components/Dashboard';
import ViewAllNotifications from './components/ViewAllNotifications';
import './App.css';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'viewall'

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const createNotification = async (notificationData) => {
    try {
      await axios.post('/api/notifications', notificationData);
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete('/api/notifications');
      fetchNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Notification System</h1>
        {/* <nav className="nav-buttons">
          <button 
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${currentView === 'viewall' ? 'active' : ''}`}
            onClick={() => setCurrentView('viewall')}
          >
            View All ({notifications.length})
          </button>
        </nav> */}
        <NotificationBell 
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
          onViewAll={() => setCurrentView('viewall')}
        />
      </header>
      
      <main className="app-main">
        {currentView === 'dashboard' ? (
          <>
            <div className="form-section">
              <NotificationForm onSubmit={createNotification} />
            </div>
            
            <div className="dashboard-section">
              <Dashboard 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            </div>
          </>
        ) : (
          <ViewAllNotifications 
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAllNotifications}
          />
        )}
      </main>
    </div>
  );
}

export default App;