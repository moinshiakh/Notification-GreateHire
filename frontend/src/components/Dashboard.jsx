import React from 'react';
import './Dashboard.css';

const Dashboard = ({ notifications, onMarkAsRead, onDelete }) => {
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Notification Dashboard</h2>
        <div className="stats">
          <span className="total-count">Total: {notifications.length}</span>
          <span className="unread-count">
            Unread: {notifications.filter(n => !n.read).length}
          </span>
        </div>
      </div>

      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No notifications yet</h3>
            <p>Create your first notification using the form</p>
          </div>
        ) : (
          <div className="notifications-grid">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.read ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
              >
                <div className="card-header">
                  <div className="notification-meta">
                    <span className="type-icon">{getTypeIcon(notification.type)}</span>
                    <span className="type-label">{notification.type}</span>
                    <span className={`priority-badge ${notification.priority}`}>
                      {notification.priority}
                    </span>
                  </div>
                  <div className="card-actions">
                    {!notification.read && (
                      <button 
                        className="action-btn mark-read"
                        onClick={() => onMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      className="action-btn delete"
                      onClick={() => onDelete(notification.id)}
                      title="Delete notification"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                </div>

                <div className="card-footer">
                  <span className="timestamp">{formatDateTime(notification.createdAt)}</span>
                  {!notification.read && <span className="unread-indicator">●</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;