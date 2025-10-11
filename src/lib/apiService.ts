// API Service for NLP-Powered OSCE Feedback System
// Enhanced with Bias Detection and Fairness Analysis

import { 
  Student, 
  OSCESession, 
  SessionWithAnalysis, 
  StudentWithSessions,
  AnalyticsOverview,
  BiasAnalysisData,
  FairnessMetrics,
  ReviewQueueItem,
  MockResults
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Students API
export const studentsApi = {
  // Get all students
  async getAll(): Promise<Student[]> {
    const response = await fetch(`${API_BASE_URL}/api/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  // Get student by ID
  async getById(id: number): Promise<StudentWithSessions> {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`);
    if (!response.ok) throw new Error('Failed to fetch student');
    return response.json();
  },

  // Create new student
  async create(student: Omit<Student, 'student_id' | 'created_at'>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  },

  // Update student
  async update(id: number, student: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  },

  // Delete student
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete student');
  },
};

// Sessions API
export const sessionsApi = {
  // Get all sessions
  async getAll(): Promise<OSCESession[]> {
    const response = await fetch(`${API_BASE_URL}/api/sessions`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  // Get session by ID with full analysis
  async getById(id: number): Promise<SessionWithAnalysis> {
    const response = await fetch(`${API_BASE_URL}/api/sessions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch session');
    return response.json();
  },

  // Get sessions by student ID
  async getByStudentId(studentId: number): Promise<OSCESession[]> {
    const response = await fetch(`${API_BASE_URL}/api/sessions?student_id=${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch student sessions');
    return response.json();
  },

  // Create new session
  async create(session: Omit<OSCESession, 'session_id' | 'created_at'>): Promise<OSCESession> {
    const response = await fetch(`${API_BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  },

  // Update session
  async update(id: number, session: Partial<OSCESession>): Promise<OSCESession> {
    const response = await fetch(`${API_BASE_URL}/api/sessions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error('Failed to update session');
    return response.json();
  },

  // Delete session
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sessions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete session');
  },
};

// Analytics API
export const analyticsApi = {
  // Get overview analytics
  async getOverview(): Promise<AnalyticsOverview> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/overview`);
    if (!response.ok) throw new Error('Failed to fetch analytics overview');
    return response.json();
  },

  // Get bias analysis data
  async getBiasAnalysis(): Promise<BiasAnalysisData> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/bias-analysis`);
    if (!response.ok) throw new Error('Failed to fetch bias analysis');
    return response.json();
  },

  // Get bias trends over time
  async getBiasTrends(): Promise<BiasAnalysisData['fairness_trends']> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/bias-trends`);
    if (!response.ok) throw new Error('Failed to fetch bias trends');
    return response.json();
  },

  // Get mitigation effectiveness
  async getMitigationEffectiveness(): Promise<BiasAnalysisData['mitigation_effectiveness']> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/mitigation-effectiveness`);
    if (!response.ok) throw new Error('Failed to fetch mitigation effectiveness');
    return response.json();
  },

  // Get fairness metrics
  async getFairnessMetrics(): Promise<FairnessMetrics> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/fairness-metrics`);
    if (!response.ok) throw new Error('Failed to fetch fairness metrics');
    return response.json();
  },

  // Get review queue
  async getReviewQueue(): Promise<ReviewQueueItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/review-queue`);
    if (!response.ok) throw new Error('Failed to fetch review queue');
    return response.json();
  },
};

// Feedback API
export const feedbackApi = {
  // Get feedback for session
  async getSessionFeedback(sessionId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/feedback/session/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch session feedback');
    return response.json();
  },

  // Submit reviewer comment
  async submitComment(comment: {
    session_id: number;
    reviewer_name: string;
    comment: string;
    segment_reference?: number;
    is_flagged?: boolean;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/feedback/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to submit comment');
    return response.json();
  },

  // Update checklist score
  async updateChecklistScore(scoreId: number, updates: {
    achieved?: boolean;
    reviewer_comments?: string;
    reviewed_by_human?: boolean;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/feedback/scores/${scoreId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update checklist score');
    return response.json();
  },
};

// Mock data for development/demo
export const mockDataApi = {
  // Get mock results for demo
  async getMockResults(): Promise<MockResults> {
    return {
      session: {
        session_id: 1,
        student_id: 1,
        session_date: '2024-01-15',
        video_url: 'https://storage.example.com/sessions/session_001.mp4',
        transcript: 'Student: Hello, I\'m Dr. Johnson. How are you feeling today? Patient: I\'ve been having chest pain for the past two days...',
        processing_status: 'complete',
        lms_link: 'https://lms.example.com/sessions/001',
        created_at: '2024-01-15T10:00:00Z',
        student: {
          student_id: 1,
          full_name: 'Sarah Johnson',
          email: 'sarah.johnson@medschool.edu',
          institution: 'Rutgers Medical School',
          created_at: '2024-01-01T00:00:00Z'
        },
        transcript_segments: [
          {
            segment_id: 1,
            session_id: 1,
            start_time: 0.0,
            end_time: 3.2,
            speaker: 'student',
            content: 'Hello, I\'m Dr. Johnson. How are you feeling today?',
            detected_intent: 'greet_patient',
            sentiment_label: 'positive',
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            segment_id: 2,
            session_id: 1,
            start_time: 3.2,
            end_time: 8.5,
            speaker: 'patient',
            content: 'I\'ve been having chest pain for the past two days. It started suddenly while I was at work.',
            detected_intent: 'describe_symptom',
            sentiment_label: 'neutral',
            created_at: '2024-01-15T10:00:00Z'
          }
        ],
        exam_actions: [
          {
            action_id: 1,
            session_id: 1,
            action_type: 'inspection',
            body_part: 'chest',
            timestamp: 35.0,
            notes: 'Visual inspection of chest for signs of distress'
          }
        ],
        checklist_scores: [],
        reviewer_comments: [],
        bias_analysis: {
          analysis_id: 1,
          session_id: 1,
          bias_severity: 0.05,
          speech_rate_score: 0.52,
          accent_cluster: 'northeast_standard',
          audio_quality_score: 0.85,
          gender_bias_score: 0.02,
          age_bias_score: 0.01,
          regional_bias_score: 0.03,
          language_bias_score: 0.01,
          cultural_competency_score: 0.94,
          overall_fairness_score: 0.94,
          fairness_confidence: 0.89,
          analysis_model_version: 'bias_detection_v2.1',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        bias_mitigations: []
      },
      biasAnalysis: {
        overallBiasScore: 0.941,
        speechRateScore: 0.52,
        audioQualityScore: 0.85,
        culturalCompetencyScore: 0.94,
        biasDetectionResults: {
          speechRate: 'No Bias',
          accent: 'No Bias',
          gender: 'No Bias',
          regional: 'No Bias'
        },
        mitigationStrategies: {
          speechNormalization: 'Applied',
          accentAgnostic: 'Applied',
          qualityCompensation: 'Applied',
          culturalSensitivity: 'Applied'
        }
      },
      transcript: {
        segments: [
          {
            segment_id: 1,
            session_id: 1,
            start_time: 0.0,
            end_time: 3.2,
            speaker: 'student',
            content: 'Hello, I\'m Dr. Johnson. How are you feeling today?',
            detected_intent: 'greet_patient',
            sentiment_label: 'positive',
            created_at: '2024-01-15T10:00:00Z'
          }
        ],
        totalDuration: 45.0
      },
      checklist: {
        items: [
          {
            checklist_id: 1,
            category: 'clinical_content',
            description: 'Obtains chief complaint',
            expected_behavior: 'Asks patient about main reason for visit',
            weight: 1.0,
            achieved: true,
            confidence: 0.95
          }
        ],
        totalScore: 85,
        categoryScores: {
          clinical_content: 88,
          communication: 82,
          professionalism: 85
        }
      }
    };
  }
};

// Export all APIs
export default {
  students: studentsApi,
  sessions: sessionsApi,
  analytics: analyticsApi,
  feedback: feedbackApi,
  mockData: mockDataApi,
};