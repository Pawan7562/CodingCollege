import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  CardActions,
  Chip,
  Rating,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  School,
  TrendingUp,
  AccessTime,
  People,
  Star,
} from '@mui/icons-material';

const Home: React.FC = () => {
  // Mock data for featured courses
  const featuredCourses = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course',
      thumbnail: 'https://via.placeholder.com/300x200?text=Web+Dev',
      price: 89.99,
      discountedPrice: 49.99,
      rating: 4.8,
      reviews: 2341,
      students: 15420,
      duration: 42,
      level: 'Beginner',
      instructor: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40',
      },
    },
    {
      id: '2',
      title: 'React - The Complete Guide',
      description: 'Master React 18 and build amazing web applications',
      thumbnail: 'https://via.placeholder.com/300x200?text=React',
      price: 79.99,
      discountedPrice: 39.99,
      rating: 4.9,
      reviews: 1876,
      students: 12340,
      duration: 36,
      level: 'Intermediate',
      instructor: {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40',
      },
    },
    {
      id: '3',
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis and machine learning',
      thumbnail: 'https://via.placeholder.com/300x200?text=Python',
      price: 99.99,
      discountedPrice: 59.99,
      rating: 4.7,
      reviews: 3421,
      students: 28930,
      duration: 48,
      level: 'Beginner',
      instructor: {
        name: 'Mike Johnson',
        avatar: 'https://via.placeholder.com/40',
      },
    },
  ];

  const categories = [
    { name: 'Web Development', icon: <School />, count: 156 },
    { name: 'Data Science', icon: <TrendingUp />, count: 89 },
    { name: 'Mobile Development', icon: <School />, count: 67 },
    { name: 'UI/UX Design', icon: <School />, count: 45 },
    { name: 'Business', icon: <TrendingUp />, count: 123 },
    { name: 'Photography', icon: <School />, count: 34 },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to College Platform
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Learn from industry experts and build your career with our comprehensive online courses
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/courses"
              sx={{ px: 4 }}
            >
              Browse Courses
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={Link}
              to="/register"
              sx={{ px: 4 }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" color="primary" fontWeight="bold">
              50K+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Active Students
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" color="primary" fontWeight="bold">
              1000+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Online Courses
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" color="primary" fontWeight="bold">
              500+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Expert Instructors
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} textAlign="center">
            <Typography variant="h3" color="primary" fontWeight="bold">
              98%
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Success Rate
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Popular Categories
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 3,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Box sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}>
                  {category.icon}
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.count} courses
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Courses Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Featured Courses
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {featuredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnail}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      src={course.instructor.avatar}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    >
                      {course.instructor.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.name}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={course.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {course.rating} ({course.reviews.toLocaleString()})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={course.level} size="small" />
                    <Chip
                      icon={<AccessTime sx={{ fontSize: 16 }} />}
                      label={`${course.duration} hours`}
                      size="small"
                    />
                    <Chip
                      icon={<People sx={{ fontSize: 16 }} />}
                      label={`${course.students.toLocaleString()} students`}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="primary">
                      ${course.discountedPrice}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      ${course.price}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/courses/${course.id}`}
                  >
                    View Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/courses"
          >
            View All Courses
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
