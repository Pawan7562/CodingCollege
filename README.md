# College Platform - MERN Stack Educational Platform

A comprehensive online learning platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to upload and sell courses professionally, similar to platforms like Udemy or Coursera.

## Features

### 🎓 Core Features
- **Authentication & Users**: Secure JWT-based login/signup with role-based access (Admin & Student)
- **Course System**: Create, update, delete courses with video lectures, notes, and resources
- **Payment Integration**: Secure payment gateway (Stripe) with cart functionality
- **Student Dashboard**: Track learning progress, watch videos, download notes
- **Assignments & Tests**: Create assignments and quizzes with timer and evaluation
- **Admin Panel**: Complete dashboard for managing courses, users, and analytics

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional UI using Material-UI
- **Fully Responsive**: Mobile + desktop optimized
- **Smooth Animations**: Interactive and engaging user experience
- **Search & Filter**: Advanced course search with filters
- **Wishlist & Reviews**: Course wishlist with ratings and reviews

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Stripe** - Payment processing
- **Cloudinary** - Cloud storage for files

### Frontend
- **React.js** - UI library with TypeScript
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Axios** - HTTP client

## Project Structure

```
College/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── .env
│   ├── package.json
│   └── src/
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the repository
```bash
git clone <repository-url>
cd College
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Backend Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Start Backend Server
```bash
# For development
npm run dev

# For production
npm start
```

### 5. Frontend Setup
```bash
cd frontend
npm install
```

### 6. Frontend Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 7. Start Frontend Development Server
```bash
npm start
```

## Database Setup

### Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. The application will automatically create the database on first run

### MongoDB Atlas (Recommended for Production)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your `.env` file

## Third-Party Services Setup

### Cloudinary (for file uploads)
1. Create a free Cloudinary account
2. Get your Cloud Name, API Key, and API Secret
3. Update the Cloudinary environment variables

### Stripe (for payments)
1. Create a Stripe account
2. Get your API keys (test keys for development)
3. Update the Stripe environment variables

## Usage

### Admin Account
1. Register a new account with role "admin"
2. Access the admin panel at `/admin`
3. Create courses, manage users, view analytics

### Student Account
1. Register a new account (default role is "student")
2. Browse courses at `/courses`
3. Enroll in courses and start learning

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### User Endpoints
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users/enroll/:courseId` - Enroll in course
- `POST /api/users/wishlist/:courseId` - Add to wishlist
- `DELETE /api/users/wishlist/:courseId` - Remove from wishlist

## Deployment

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set up environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository to Vercel/Netlify
2. Set up environment variables
3. Deploy automatically on push to main branch

### Production Environment Variables
Make sure to update all environment variables for production:
- Use production database connection string
- Use production API keys
- Update frontend URL to your deployed frontend URL

## Development Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Frontend
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from Create React App
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@collegeplatform.com
- Phone: +1 (555) 123-4567
- Visit our Help Center at `/help`

## Features Roadmap

- [ ] Live streaming for courses
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Course certificates with blockchain verification
- [ ] AI-powered course recommendations
- [ ] Multi-language support
- [ ] Affiliate marketing system
- [ ] Corporate training packages

---

**Built with ❤️ using the MERN stack**
