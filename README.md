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
- Cloudinary image upload integration
- JWT authentication
- MongoDB and PostgreSQL support
- Swagger API documentation

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
- `GET /api-docs` - Swagger API documentation

#### Creator Management
- `POST /creator/signup` - Register new creator
- `POST /creator/login` - Creator login
- `GET /creator/profile` - Get creator profile (protected)
- `PUT /creator/profile` - Update creator profile (protected)

#### Image Upload
- `POST /upload/image` - Upload image to Cloudinary

#### Analytics
- `GET /analytics` - Get analytics data

#### Tips
- `GET /tip/:creator_id` - Get tips for creator

#### Configuration
- `POST /config` - Create configuration
- `GET /config/:id` - Get configuration
- `PUT /config/:id` - Update configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/pp-backend
PG_USER=your_postgres_user
PG_HOST=localhost
PG_DATABASE=pp_database
PG_PASSWORD=your_postgres_password
PG_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=8000
NODE_ENV=development
API_BASE_URL=http://localhost:8000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Required Environment Variables:
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Development

The server runs on `http://localhost:8000` by default.

- Health check: `http://localhost:8000/health`
- API Documentation: `http://localhost:8000/api-docs`

### Image Upload Usage

To upload an image:

```bash
curl -X POST http://localhost:8000/upload/image \
  -F "image=@/path/to/your/image.jpg"
```

Response:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/pp-uploads/abc123.jpg",
    "public_id": "pp-uploads/abc123",
    "width": 1000,
    "height": 800,
    "format": "jpg"
  },
  "message": "Image uploaded successfully"
}
```
