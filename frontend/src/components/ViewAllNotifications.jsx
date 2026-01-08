import React from 'react';
import './ViewAllNotifications.css';

const ViewAllNotifications = ({ notifications, onMarkAsRead, onDelete, onMarkAllAsRead, onClearAll }) => {
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

  return (
    <div className="view-all-notifications">
      <div className="page-header">
        <h1>All Notifications</h1>
        <div className="header-actions">
          <span className="total-count">Total: {notifications.length}</span>
          <span className="unread-count">
            Unread: {notifications.filter(n => !n.read).length}
          </span>
          <button className="btn-secondary" onClick={onMarkAllAsRead}>
            Mark All Read
          </button>
          <button className="btn-danger" onClick={onClearAll}>
            Clear All
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <div className="notification-header">
                  <span className="type-icon">{getTypeIcon(notification.type)}</span>
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className={`priority-badge ${notification.priority}`}>
                    {notification.priority}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <span className="timestamp">{formatDateTime(notification.createdAt)}</span>
                  <span className="type-label">{notification.type}</span>
                </div>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="btn-read"
                    onClick={() => onMarkAsRead(notification.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button 
                  className="btn-delete"
                  onClick={() => onDelete(notification.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewAllNotifications;