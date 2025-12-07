# Cinema Booking System

Full-stack cinema booking application with React frontend and Node.js backend.

## Project Structure

```
cinema-booking/
├── frontend/          # React + Vite frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
│
├── backend/          # Node.js + Express backend API
│   ├── src/         # Source code
│   └── package.json # Backend dependencies
│
└── README.md        # This file
```

## Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** Radix UI
- **State Management:** React Context
- **Routing:** React Router v6
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth + JWT
- **Validation:** Joi
- **Logging:** Winston

## Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Movie Browsing (Now Showing, Coming Soon)
- ✅ Showtime Selection
- ✅ Seat Selection & Booking
- ✅ Payment Integration (VNPay, Momo)
- ✅ Booking History
- ✅ Loyalty Points System
- ✅ Admin Dashboard
- ✅ Movie Management
- ✅ Showtime Management
- ✅ User Management
- ✅ Reports & Analytics

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cinema-booking
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Update .env with your Supabase credentials
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your Supabase credentials and secrets
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Environment Variables

#### Frontend (.env)
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev      # Start with nodemon
npm start        # Start production server
npm test         # Run tests
```

## Database Setup

1. Create a Supabase project
2. Run the SQL scripts in order:
   - `001_initial_schema.sql`
   - `002_functions_triggers.sql`
   - `003_views.sql`
   - `004_seed_data.sql`

3. Configure Row Level Security (RLS) policies
4. Set up Storage buckets for images

See `backend/database/` for migration files.

## API Documentation

API runs on `http://localhost:5000/api/v1`

### Endpoints

- **Auth:** `/api/v1/auth/*`
- **Movies:** `/api/v1/movies/*`
- **Showtimes:** `/api/v1/showtimes/*`
- **Bookings:** `/api/v1/bookings/*`
- **Users:** `/api/v1/users/*`
- **Admin:** `/api/v1/admin/*`

See `backend/README.md` for detailed API documentation.

## Project Status

- ✅ Frontend UI Complete
- ✅ Backend Structure Complete
- 🚧 API Endpoints (In Progress)
- 🚧 Payment Integration (Planned)
- 🚧 Email Notifications (Planned)

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## License

ISC

## Contact

For questions or support, please contact the development team.
