import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  AccessTime,
  People,
  School,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock course data
  const course = {
    id: id,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course. Build real-world projects and launch your career as a web developer.',
    shortDescription: 'Become a full-stack web developer with this comprehensive bootcamp',
    price: 89.99,
    discountedPrice: 49.99,
    thumbnail: 'https://via.placeholder.com/800x400?text=Web+Development+Course',
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Web Development',
    level: 'Beginner',
    language: 'English',
    duration: 42,
    rating: 4.8,
    reviews: 2341,
    students: 15420,
    requirements: [
      'No programming experience needed',
      'A computer with internet access',
      'Dedication to learn and practice'
    ],
    whatYouWillLearn: [
      'Build 25+ web applications and projects',
      'Master HTML5, CSS3, and modern JavaScript',
      'Learn React, Node.js, Express, and MongoDB',
      'Understand APIs and database management',
      'Deploy applications to production'
    ],
    instructor: {
      name: 'John Doe',
      bio: 'Senior Web Developer with 10+ years of experience',
      avatar: 'https://via.placeholder.com/100',
      experience: '10+ years'
    },
    lessons: [
      {
        id: '1',
        title: 'Introduction to Web Development',
        duration: 45,
        isPreview: true,
      },
      {
        id: '2',
        title: 'HTML Fundamentals',
        duration: 60,
        isPreview: false,
      },
      {
        id: '3',
        title: 'CSS Styling and Layout',
        duration: 90,
        isPreview: false,
      },
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              {course.shortDescription}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={course.rating} precision={0.1} size="large" readOnly />
              <Typography variant="body1">
                {course.rating} ({course.reviews.toLocaleString()} reviews)
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {course.students.toLocaleString()} students
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip label={course.category} />
              <Chip label={course.level} />
              <Chip icon={<AccessTime />} label={`${course.duration} hours`} />
              <Chip icon={<School />} label={course.language} />
            </Box>
          </Box>

          {/* Course Preview */}
          <Box sx={{ mb: 4, position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              src={course.previewVideo}
              title="Course Preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>

          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              About this course
            </Typography>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </Box>

          {/* What You'll Learn */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              What you'll learn
            </Typography>
            <Grid container spacing={2}>
              {course.whatYouWillLearn.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircle color="primary" sx={{ mt: 0.5 }} />
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Requirements */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Requirements
            </Typography>
            <List>
              {course.requirements.map((requirement, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={requirement} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Course Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Course Content
            </Typography>
            <Card>
              <List>
                {course.lessons.map((lesson, index) => (
                  <ListItem key={lesson.id} divider>
                    <ListItemIcon>
                      {lesson.isPreview ? <PlayArrow color="primary" /> : <PlayArrow />}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${index + 1}. ${lesson.title}`}
                      secondary={`${lesson.duration} minutes ${lesson.isPreview ? '(Preview)' : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardMedia
              component="img"
              height="200"
              image={course.thumbnail}
              alt={course.title}
            />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h4" color="primary">
                  ${course.discountedPrice}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${course.price}
                </Typography>
              </Box>

              <Button variant="contained" fullWidth size="large" sx={{ mb: 2 }}>
                Enroll Now
              </Button>

              <Button variant="outlined" fullWidth sx={{ mb: 3 }}>
                Add to Wishlist
              </Button>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                This course includes:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`${course.duration} hours of video content`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <People color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`${course.students.toLocaleString()} enrolled students`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <School color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Certificate of completion" />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={course.instructor.avatar}
                  sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }}
                >
                  {course.instructor.name.charAt(0)}
                </Avatar>
                <Typography variant="h6">{course.instructor.name}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.instructor.bio}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.instructor.experience} experience
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetails;
