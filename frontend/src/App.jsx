import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Logo from './components/Logo'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import WatchCourse from './pages/WatchCourse'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import BecomeTeacher from './pages/BecomeTeacher'
import TeacherDashboard from './pages/TeacherDashboard'

// Auth helpers
import AuthCallback from './pages/AuthCallback'
import VerifyEmail from './pages/VerifyEmail'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCourses from './pages/admin/ManageCourses'
import CreateCourse from './pages/admin/CreateCourse'
import ManageUsers from './pages/admin/ManageUsers'
import ManageAssignments from './pages/admin/ManageAssignments'
import ManageTeacherApplications from './pages/admin/ManageTeacherApplications'

// 404
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-6">
    <Logo size="lg" />
    <div>
      <div className="text-[120px] font-black text-gray-800/60 leading-none mb-2">404</div>
      <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-gray-400 mb-7 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="btn-primary">← Back to Home</a>
    </div>
  </div>
)

// Payment Success
const PaymentSuccess = () => {
  const { fetchMe } = useAuth()
  useEffect(() => { fetchMe() }, [])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-5">
      <Logo size="lg" />
      <div className="text-6xl">🎉</div>
      <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
      <p className="text-gray-400 max-w-sm">Your courses have been added to your account. Happy learning!</p>
      <a href="/dashboard" className="btn-primary mt-2">Go to Dashboard →</a>
    </div>
  )
}

// Layout wrapper
const Layout = ({ children, hideFooter = false }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    {!hideFooter && <Footer />}
  </>
)

// Teacher route guard
const TeacherRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'teacher' && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

const App = () => {
  const { loading } = useAuth()

  if (loading) return <Loader fullPage />

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/courses" element={<Layout><Courses /></Layout>} />
      <Route path="/courses/:id" element={<Layout><CourseDetail /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout><Cart /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/courses/:id/watch" element={
        <ProtectedRoute>
          <WatchCourse />
        </ProtectedRoute>
      } />
      <Route path="/payment/success" element={
        <ProtectedRoute>
          <Layout><PaymentSuccess /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/become-teacher" element={
        <ProtectedRoute>
          <Layout><BecomeTeacher /></Layout>
        </ProtectedRoute>
      } />

      {/* Teacher Routes */}
      <Route path="/teacher/dashboard" element={
        <TeacherRoute>
          <Layout><TeacherDashboard /></Layout>
        </TeacherRoute>
      } />
      <Route path="/admin/courses/create" element={
        <TeacherRoute>
          <Layout><CreateCourse /></Layout>
        </TeacherRoute>
      } />
      <Route path="/admin/courses/:id/edit" element={
        <TeacherRoute>
          <Layout><CreateCourse /></Layout>
        </TeacherRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <Layout><AdminDashboard /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/courses" element={
        <AdminRoute>
          <Layout><ManageCourses /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <Layout><ManageUsers /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/assignments" element={
        <AdminRoute>
          <Layout><ManageAssignments /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/teacher-applications" element={
        <AdminRoute>
          <Layout><ManageTeacherApplications /></Layout>
        </AdminRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

export default App
