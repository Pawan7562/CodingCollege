import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About College Platform
      </Typography>

      <Typography variant="body1" paragraph>
        College Platform is a comprehensive online learning platform designed to provide
        high-quality education to students worldwide. We offer a wide range of courses
        taught by industry experts, helping you achieve your career goals.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            To make quality education accessible to everyone, anywhere, anytime.
            We believe that learning should be flexible, affordable, and effective.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Our Vision
          </Typography>
          <Typography variant="body1" paragraph>
            To become the world's leading online learning platform, empowering
            millions of learners to achieve their full potential.
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Meet Our Team
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  src="https://via.placeholder.com/80"
                >
                  JD
                </Avatar>
                <Typography variant="h6">John Doe</Typography>
                <Typography variant="body2" color="text.secondary">
                  CEO & Founder
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  src="https://via.placeholder.com/80"
                >
                  JS
                </Avatar>
                <Typography variant="h6">Jane Smith</Typography>
                <Typography variant="body2" color="text.secondary">
                  CTO
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  src="https://via.placeholder.com/80"
                >
                  MJ
                </Avatar>
                <Typography variant="h6">Mike Johnson</Typography>
                <Typography variant="body2" color="text.secondary">
                  Head of Education
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  src="https://via.placeholder.com/80"
                >
                  SB
                </Avatar>
                <Typography variant="h6">Sarah Brown</Typography>
                <Typography variant="body2" color="text.secondary">
                  Head of Marketing
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About;
