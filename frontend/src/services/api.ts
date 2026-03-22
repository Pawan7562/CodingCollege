import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getMe() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  async updateProfile(userData: { name?: string; email?: string; avatar?: string }) {
    const response = await this.api.put('/auth/profile', userData);
    return response.data;
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    const response = await this.api.put('/auth/password', passwordData);
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await this.api.post('/auth/forgot-password', { email });
    return response.data;
  }

  // Course endpoints
  async getCourses(params?: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    const response = await this.api.get('/courses', { params });
    return response.data;
  }

  async getCourse(id: string) {
    const response = await this.api.get(`/courses/${id}`);
    return response.data;
  }

  async createCourse(courseData: any) {
    const response = await this.api.post('/courses', courseData);
    return response.data;
  }

  async updateCourse(id: string, courseData: any) {
    const response = await this.api.put(`/courses/${id}`, courseData);
    return response.data;
  }

  async deleteCourse(id: string) {
    const response = await this.api.delete(`/courses/${id}`);
    return response.data;
  }

  async getEnrolledCourses() {
    const response = await this.api.get('/courses/enrolled/my-courses');
    return response.data;
  }

  async getCourseContent(id: string) {
    const response = await this.api.get(`/courses/${id}/content`);
    return response.data;
  }

  async addCourseRating(id: string, ratingData: { rating: number; review?: string }) {
    const response = await this.api.post(`/courses/${id}/ratings`, ratingData);
    return response.data;
  }

  async addLesson(courseId: string, lessonData: any) {
    const response = await this.api.post(`/courses/${courseId}/lessons`, lessonData);
    return response.data;
  }

  async updateLesson(courseId: string, lessonId: string, lessonData: any) {
    const response = await this.api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
    return response.data;
  }

  async deleteLesson(courseId: string, lessonId: string) {
    const response = await this.api.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  }

  // User endpoints
  async getUsers(params?: { page?: number; limit?: number }) {
    const response = await this.api.get('/users', { params });
    return response.data;
  }

  async getUser(id: string) {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: any) {
    const response = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  async enrollCourse(courseId: string) {
    const response = await this.api.post(`/users/enroll/${courseId}`);
    return response.data;
  }

  async addToWishlist(courseId: string) {
    const response = await this.api.post(`/users/wishlist/${courseId}`);
    return response.data;
  }

  async removeFromWishlist(courseId: string) {
    const response = await this.api.delete(`/users/wishlist/${courseId}`);
    return response.data;
  }

  async getProgress(courseId: string) {
    const response = await this.api.get(`/users/progress/${courseId}`);
    return response.data;
  }

  async updateLessonProgress(courseId: string, lessonId: string) {
    const response = await this.api.post(`/users/progress/${courseId}/lesson`, { lessonId });
    return response.data;
  }

  // Upload endpoint
  async uploadFile(file: File, type: 'image' | 'video' | 'pdf' | 'document') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
