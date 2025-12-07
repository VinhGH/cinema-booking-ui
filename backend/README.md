# Cinema Booking Backend API

Backend API for Cinema Booking System built with Node.js, Express, and Supabase.

## Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Movie Management (CRUD operations)
- ✅ Showtime Scheduling
- ✅ Seat Selection & Booking
- ✅ Payment Integration (VNPay, Momo)
- ✅ Loyalty Points System
- ✅ Admin Dashboard
- ✅ QR Code Generation
- ✅ Email Notifications

## Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth + JWT
- **Validation:** Joi
- **Logging:** Winston
- **Testing:** Jest + Supertest

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   - Supabase credentials
   - JWT secrets
   - Payment gateway keys
   - Email configuration

4. **Start the server**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── validators/      # Request validation
│   ├── utils/           # Utility functions
│   ├── tests/           # Test files
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── logs/                # Log files
├── .env                 # Environment variables
├── .env.example         # Example env file
├── package.json         # Dependencies
└── README.md            # This file
```

## API Endpoints

### Health Check
```
GET /health
```

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
```

### Movies
```
GET    /api/v1/movies
GET    /api/v1/movies/:id
POST   /api/v1/movies          (Admin)
PUT    /api/v1/movies/:id      (Admin)
DELETE /api/v1/movies/:id      (Admin)
```

### Bookings
```
GET    /api/v1/bookings
GET    /api/v1/bookings/:id
POST   /api/v1/bookings
PUT    /api/v1/bookings/:id
DELETE /api/v1/bookings/:id
```

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## License

ISC
