# Notification System Backend

A Node.js Express server that provides REST API endpoints for managing notifications.

## Features

- Create new notifications
- Retrieve all notifications
- Mark notifications as read
- Delete notifications
- Real-time notification count tracking

## API Endpoints

- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create a new notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification
- `DELETE /api/notifications` - Clear all notifications
- `GET /api/health` - Health check

## Installation

```bash
npm install
```

## Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## Notification Object Structure

```json
{
  "id": 1,
  "title": "Notification Title",
  "message": "Notification message content",
  "type": "info|success|warning|error",
  "priority": "low|medium|high",
  "read": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "timestamp": 1704067200000
}
```