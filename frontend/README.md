# Notification System Frontend

A React application that provides a user interface for creating and managing notifications.

## Features

- **Notification Form**: Create new notifications with title, message, type, and priority
- **Notification Bell**: Interactive bell icon showing unread count with dropdown
- **Dashboard**: Complete view of all notifications with management options
- **Real-time Updates**: Automatic refresh of notification status
- **Responsive Design**: Works on desktop and mobile devices

## Components

- `NotificationForm` - Form to create new notifications
- `NotificationBell` - Bell icon with notification dropdown
- `Dashboard` - Main dashboard showing all notifications
- `App` - Main application component managing state

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will run on `http://localhost:3000`

## Usage

1. **Create Notification**: Fill out the form with title, message, type, and priority
2. **View Notifications**: Click the bell icon to see recent notifications
3. **Manage Notifications**: Mark as read, delete, or view all in the dashboard
4. **Dashboard**: See complete notification history with filtering options

## Notification Types

- **Info**: General information (blue)
- **Success**: Success messages (green)
- **Warning**: Warning messages (orange)
- **Error**: Error messages (red)

## Priority Levels

- **Low**: Low priority notifications
- **Medium**: Medium priority notifications
- **High**: High priority notifications