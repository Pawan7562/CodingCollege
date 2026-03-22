import React from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';

const Help: React.FC = () => {
  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, simply browse our course catalog, select the course you\'re interested in, and click the "Enroll Now" button. You\'ll be prompted to complete the payment process, and then you\'ll have immediate access to the course content.',
    },
    {
      question: 'Can I access courses offline?',
      answer: 'Currently, our courses require an internet connection to stream video content. However, we\'re working on an offline mode that will allow you to download course materials for offline viewing.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal. We also support various regional payment methods depending on your location.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with a course, you can request a full refund within 30 days of purchase.',
    },
    {
      question: 'How long do I have access to a course?',
      answer: 'Once you purchase a course, you have lifetime access to all course materials, including any future updates. You can learn at your own pace and revisit the content anytime.',
    },
    {
      question: 'Do I receive a certificate upon completion?',
      answer: 'Yes, upon successful completion of a course, you\'ll receive a certificate of completion that you can add to your resume or share on LinkedIn.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Help & Support
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <HelpIcon color="primary" sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom textAlign="center">
                Still need help?
              </Typography>
              <Typography variant="body2" paragraph>
                Can't find what you're looking for? Our support team is here to help.
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Email: support@collegeplatform.com
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Phone: +1 (555) 123-4567
                </Typography>
                <Typography variant="body2">
                  Hours: Monday-Friday, 9AM-6PM EST
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Help;
