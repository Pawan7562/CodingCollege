import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { School, TrendingUp, AccessTime, Star } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data
  const enrolledCourses = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      thumbnail: 'https://via.placeholder.com/100x60',
      progress: 75,
      lastAccessed: '2 days ago',
    },
    {
      id: '2',
      title: 'React - The Complete Guide',
      thumbnail: 'https://via.placeholder.com/100x60',
      progress: 45,
      lastAccessed: '1 week ago',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">2</Typography>
              <Typography variant="body2" color="text.secondary">
                Enrolled Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">60%</Typography>
              <Typography variant="body2" color="text.secondary">
                Average Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">24h</Typography>
              <Typography variant="body2" color="text.secondary">
                Learning Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">2</Typography>
              <Typography variant="body2" color="text.secondary">
                Certificates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Continue Learning */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Continue Learning
          </Typography>
          {enrolledCourses.map((course) => (
            <Card key={course.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={course.thumbnail}
                    alt={course.title}
                    sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{course.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{ flexGrow: 1 }}
                      />
                      <Typography variant="body2">{course.progress}%</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Last accessed: {course.lastAccessed}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/courses/${course.id}`}
                  >
                    Continue
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Recommended Courses
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body2" paragraph>
                Based on your learning history, we recommend these courses:
              </Typography>
              <Button variant="outlined" fullWidth component={Link} to="/courses">
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
