# College - MERN Stack Educational Platform

A full-featured, production-level online learning platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Student Features
- Browse and search 200+ courses with filters (category, level, price)
- Free and paid course enrollment
- Video player with progress tracking
- Quiz system with auto-grading
- Assignment submission
- Reviews and ratings
- Wishlist and cart
- Dashboard with learning progress
- Payment via Stripe and Razorpay
- Notification system

### Admin Features
- Full admin dashboard with analytics charts
- Create, edit, publish/unpublish courses
- Add lectures with video uploads (Cloudinary)
- Manage users and roles
- Create and grade assignments
- Create quizzes
- Broadcast notifications
- Revenue and order tracking

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (media uploads)
- Stripe + Razorpay (payments)
- Nodemailer (emails)
- Multer (file uploads)

### Frontend
- React 18 + Vite
- Tailwind CSS (dark theme)
- React Router v6
- Framer Motion (animations)
- Recharts (admin charts)
- React Player (video)
- React Hot Toast
- React Icons

## Setup Instructions

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_*` - Cloudinary credentials for media uploads
- `STRIPE_SECRET_KEY` - Stripe payment key
- `RAZORPAY_*` - Razorpay payment credentials
- `EMAIL_*` - SMTP email credentials

### 3. Start the development servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 5. Create an admin user

Register a new account, then update the role in MongoDB:
```javascript
db.users.updateOne({ email: "admin@college.com" }, { $set: { role: "admin" } })
```

## Project Structure

```
CodingCollege/
├── backend/          # Express API
│   ├── config/       # Database connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, upload, error handlers
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── utils/        # Email utility
└── frontend/         # React app
    └── src/
        ├── api/      # Axios config
        ├── components/ # Reusable components
        ├── context/  # React Context (Auth, Cart)
        └── pages/    # Page components
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/cart/:courseId` - Add to cart
- `POST /api/auth/wishlist/:courseId` - Toggle wishlist

### Courses
- `GET /api/courses` - List courses (with filters)
- `GET /api/courses/featured` - Featured courses
- `GET /api/courses/:id` - Course detail
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `POST /api/courses/:id/lectures` - Add lecture (admin)
- `POST /api/courses/:id/reviews` - Add review
- `GET/PUT /api/courses/:id/progress` - Progress tracking

### Payments
- `POST /api/payments/stripe/create-session` - Stripe checkout
- `POST /api/payments/razorpay/create-order` - Razorpay order
- `POST /api/payments/razorpay/verify` - Verify payment
- `POST /api/payments/enroll-free/:courseId` - Free enrollment
- `GET /api/payments/my-orders` - User orders

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET/PUT/DELETE /api/admin/users` - User management
- `POST /api/admin/assignments` - Create assignment
- `POST /api/admin/quizzes` - Create quiz
- `POST /api/admin/notifications` - Broadcast notification
# CodingCollege
