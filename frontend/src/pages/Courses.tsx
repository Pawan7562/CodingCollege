import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, AccessTime, People } from '@mui/icons-material';

const Courses: React.FC = () => {
  // Mock data
  const courses = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
      thumbnail: 'https://via.placeholder.com/300x200?text=Web+Dev',
      price: 89.99,
      discountedPrice: 49.99,
      rating: 4.8,
      reviews: 2341,
      students: 15420,
      duration: 42,
      level: 'Beginner',
      category: 'Web Development',
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
      category: 'Web Development',
      instructor: {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40',
      },
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Courses
      </Typography>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              InputProps={{
                startAdornment: <Search />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category" defaultValue="">
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="web">Web Development</MenuItem>
                <MenuItem value="mobile">Mobile Development</MenuItem>
                <MenuItem value="data">Data Science</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select label="Level" defaultValue="">
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="outlined" fullWidth>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Course Grid */}
      <Grid container spacing={4}>
        {courses.map((course) => (
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
    </Container>
  );
};

export default Courses;
