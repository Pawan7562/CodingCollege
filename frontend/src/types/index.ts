export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  enrolledCourses: Course[];
  wishlist: Course[];
  progress: Progress[];
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountedPrice?: number;
  thumbnail: string;
  previewVideo?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  duration: number;
  lessons: Lesson[];
  notes: Notes;
  requirements: string[];
  whatYouWillLearn: string[];
  instructor: Instructor;
  enrolledStudents: string[];
  ratings: Rating[];
  averageRating: number;
  totalReviews: number;
  totalEnrollments: number;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number;
  order: number;
  isPreview: boolean;
  resources: Resource[];
}

export interface Resource {
  name: string;
  url: string;
  type: 'pdf' | 'code' | 'link' | 'image';
}

export interface Notes {
  pdfNotes: {
    title: string;
    url: string;
    size: string;
  }[];
  codeNotes: {
    title: string;
    content: string;
    language: string;
  }[];
  explanationNotes: {
    title: string;
    content: string;
  }[];
}

export interface Instructor {
  name: string;
  bio?: string;
  avatar?: string;
  experience?: string;
}

export interface Rating {
  user: User;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface Progress {
  course: Course;
  completedLessons: string[];
  completedAssignments: string[];
  completedQuizzes: string[];
  percentage: number;
  lastAccessed: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
  instructions: string;
  attachments: {
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'video' | 'document' | 'other';
  }[];
  maxScore: number;
  dueDate: string;
  submissionType: 'file' | 'text' | 'link' | 'code';
  allowedFileTypes: string[];
  maxFileSize: number;
  submissions: Submission[];
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  student: string;
  submittedAt: string;
  isLate: boolean;
  content: {
    text?: string;
    link?: string;
    code?: string;
    files?: {
      name: string;
      url: string;
      size: string;
    }[];
  };
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  course: string;
  instructions?: string;
  timeLimit: number;
  maxAttempts: number;
  passingScore: number;
  questions: Question[];
  attempts: QuizAttempt[];
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  showCorrectAnswers: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: {
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizAttempt {
  student: string;
  startedAt: string;
  submittedAt?: string;
  timeTaken?: number;
  answers: {
    questionIndex: number;
    answer: any;
    isCorrect?: boolean;
    points?: number;
  }[];
  score?: number;
  totalPoints?: number;
  percentage?: number;
  passed?: boolean;
  attemptNumber: number;
  status: 'in-progress' | 'submitted' | 'graded';
}

export interface Payment {
  _id: string;
  user: string;
  course: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'paypal' | 'razorpay' | 'other';
  paymentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  gatewayResponse: any;
  refundedAmount: number;
  refundReason?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  user: string;
  courses: {
    course: string;
    price: number;
    discountedPrice?: number;
  }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'stripe' | 'paypal' | 'razorpay' | 'other';
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  billingDetails?: {
    name: string;
    email: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  couponCode?: string;
  discountAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'instructor' | 'admin';
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
