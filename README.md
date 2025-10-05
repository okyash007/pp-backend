# PP Backend

Express.js server for the PP application.

## Features

- Express.js framework
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan
- Environment variable support
- Error handling middleware
- Health check endpoint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-restart

### API Endpoints

- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint
- `GET /api/status` - API status

### Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)

## Development

The server runs on `http://localhost:3000` by default.

Health check available at `http://localhost:3000/health`
