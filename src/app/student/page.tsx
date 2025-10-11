"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock data for student dashboard
const mockStudentData = {
  name: "Sarah Johnson",
  studentId: "STU2024001",
  totalCases: 8,
  averageScore: 85,
  completedCases: 6,
  pendingCases: 2,
  currentStreak: 5,
  totalHours: 24
};

const performanceHistory = [
  { week: "Week 1", score: 78, cases: 2 },
  { week: "Week 2", score: 82, cases: 2 },
  { week: "Week 3", score: 85, cases: 2 },
  { week: "Week 4", score: 88, cases: 2 }
];

const recentAssessments = [
  {
    id: "A001",
    case: "Chest Pain Assessment",
    date: "2024-01-15",
    score: 88,
    status: "completed",
    feedback: "The student demonstrated excellent communication skills and systematic approach to pain assessment."
  },
  {
    id: "A002",
    case: "Pediatric Fever",
    date: "2024-01-12",
    score: 82,
    status: "completed",
    feedback: "The student showed good clinical reasoning with room for improvement in empathy demonstration."
  },
  {
    id: "A003",
    case: "Mental Health Crisis",
    date: "2024-01-10",
    score: 91,
    status: "completed",
    feedback: "The student delivered outstanding performance across all competency categories."
  }
];

const skillBreakdown = [
  { skill: "Communication", score: 88, target: 85, improvement: "+3" },
  { skill: "Clinical Knowledge", score: 82, target: 80, improvement: "+2" },
  { skill: "Empathy", score: 91, target: 85, improvement: "+6" },
  { skill: "Professionalism", score: 85, target: 85, improvement: "0" }
];

const upcomingAssessments = [
  {
    id: "U001",
    title: "Cardiology Case",
    dueDate: "2024-01-20",
    difficulty: "intermediate",
    status: "available"
  },
  {
    id: "U002",
    title: "Emergency Medicine",
    dueDate: "2024-01-25",
    difficulty: "advanced",
    status: "locked"
  }
];

const learningResources = [
  {
    title: "Communication Skills Module",
    description: "Advanced techniques for patient interaction and rapport building",
    type: "module",
    duration: "2 hours"
  },
  {
    title: "Clinical Reasoning Workshop",
    description: "Structured approach to differential diagnosis and clinical decision making",
    type: "workshop",
    duration: "3 hours"
  },
  {
    title: "Empathy Training",
    description: "Building emotional intelligence and patient-centered care skills",
    type: "training",
    duration: "1.5 hours"
  }
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole !== 'student') {
      router.push('/login');
    }
  }, [router]);

  const handleScheduleOSCE = () => {
    alert("The student can schedule OSCE sessions through the academic portal.");
  };

  const handleStartAssessment = () => {
    alert("The student is starting a new OSCE assessment session.");
  };

  const handleViewDetails = (assessmentId: string) => {
    alert(`The student is viewing detailed results for assessment ${assessmentId}.`);
  };

  const handleDownloadReport = (assessmentId: string) => {
    alert(`The student is downloading a comprehensive report for assessment ${assessmentId}.`);
  };

  const handleAccessResource = (resourceName: string) => {
    alert(`The student is accessing the ${resourceName} learning resource.`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "intermediate": return "bg-amber-100 text-amber-800 border-amber-200";
      case "advanced": return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getImprovementColor = (improvement: string) => {
    if (improvement.startsWith('+')) return "text-emerald-600";
    if (improvement === '0') return "text-slate-600";
    return "text-rose-600";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Student Dashboard</h1>
                <p className="text-xs text-slate-500">Clinical Skills Development</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</a>
              <a href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">Login</a>
              <a href="/student" className="text-red-600 font-medium">Student</a>
              <a href="/admin" className="text-black hover:text-red-600 transition-colors">Admin</a>
            </div>
            
            <button
              onClick={() => {
                localStorage.removeItem("userRole");
                localStorage.removeItem("authToken");
                window.location.href = "/login";
              }}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {mockStudentData.name}
              </h1>
              <p className="text-lg text-slate-600">
                Continue developing your clinical presentation skills
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleScheduleOSCE}
                className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📅 Schedule OSCE
              </button>
              <button 
                onClick={handleStartAssessment}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ▶️ Start New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockStudentData.totalCases}</h3>
            <p className="text-slate-600">Total Cases</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockStudentData.averageScore}%</h3>
            <p className="text-slate-600">Average Score</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockStudentData.completedCases}</h3>
            <p className="text-slate-600">Completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockStudentData.pendingCases}</h3>
            <p className="text-slate-600">Pending</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8">
          {[
            { id: "overview", name: "Overview" },
            { id: "progress", name: "Progress" },
            { id: "assessments", name: "Assessments" },
            { id: "feedback", name: "Feedback" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-white/50"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Trend */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Performance Trend</h3>
                <p className="text-slate-600 mb-6">The student's progress over the last 4 weeks</p>
                <div className="space-y-4">
                  {performanceHistory.map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{week.week}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600">{week.cases} cases</span>
                        <div className="w-24 bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                            style={{width: `${week.score}%`}}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-900 w-12 text-right">{week.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Skill Breakdown</h3>
                <p className="text-slate-600 mb-6">The student's performance across different competencies</p>
                <div className="space-y-6">
                  {skillBreakdown.map((skill, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">{skill.skill}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600">{skill.score}%</span>
                          <span className={`text-sm font-bold ${getImprovementColor(skill.improvement)}`}>
                            {skill.improvement}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                          style={{width: `${(skill.score / skill.target) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Assessments</h3>
              <p className="text-slate-600 mb-6">The student's latest OSCE performance results</p>
              <div className="space-y-6">
                {recentAssessments.map((assessment) => (
                  <div key={assessment.id} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h4 className="text-xl font-bold text-slate-900">{assessment.case}</h4>
                          <span className="text-slate-600">{assessment.date}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            assessment.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {assessment.status}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-4">{assessment.feedback}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Score:</span>
                          <span className="text-2xl font-bold text-slate-900">{assessment.score}%</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleViewDetails(assessment.id)}
                          className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleDownloadReport(assessment.id)}
                          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                        >
                          Download Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Goals & Targets */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Learning Goals</h3>
                <p className="text-slate-600 mb-6">The student's learning objectives and progress</p>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Complete 10 OSCE cases</span>
                      <span className="text-slate-600">{mockStudentData.totalCases}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                        style={{width: `${(mockStudentData.totalCases / 10) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Achieve 85% average score</span>
                      <span className="text-slate-600">{mockStudentData.averageScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{width: `${(mockStudentData.averageScore / 85) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Improve empathy scores</span>
                      <span className="text-slate-600">91%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{width: '91%'}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Assessments */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Assessments</h3>
                <p className="text-slate-600 mb-6">Scheduled OSCE cases and deadlines</p>
                <div className="space-y-4">
                  {upcomingAssessments.map((assessment) => (
                    <div key={assessment.id} className={`p-4 rounded-xl border-2 ${
                      assessment.status === 'available' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{assessment.title}</p>
                          <p className="text-sm text-slate-600">Due: {assessment.dueDate}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(assessment.difficulty)}`}>
                            {assessment.difficulty}
                          </span>
                        </div>
                        <button 
                          onClick={handleStartAssessment}
                          disabled={assessment.status === 'locked'}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            assessment.status === 'available'
                              ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700'
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {assessment.status === 'available' ? 'Start' : 'Locked'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === "assessments" && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Assessment History</h3>
            <p className="text-slate-600 mb-6">Complete record of the student's OSCE assessments</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Case</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Date</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Score</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssessments.map((assessment) => (
                    <tr key={assessment.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-2 font-medium text-slate-900">{assessment.case}</td>
                      <td className="py-4 px-2 text-slate-600">{assessment.date}</td>
                      <td className="py-4 px-2 font-bold text-slate-900">{assessment.score}%</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          assessment.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {assessment.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDetails(assessment.id)}
                            className="bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDownloadReport(assessment.id)}
                            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Personalized Feedback</h3>
              <p className="text-slate-600 mb-8">AI-generated insights and recommendations for the student's improvement</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Strengths */}
                <div>
                  <h4 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Strengths
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span className="text-slate-700">Excellent empathy and patient communication</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span className="text-slate-700">Strong clinical reasoning and differential diagnosis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span className="text-slate-700">Professional demeanor and appropriate boundaries</span>
                    </li>
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <span className="text-amber-600">◐</span>
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span className="text-slate-700">Consider asking more open-ended questions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span className="text-slate-700">Practice explaining procedures before performing them</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span className="text-slate-700">Work on maintaining eye contact during difficult conversations</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Learning Resources */}
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-6">Recommended Learning Resources</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {learningResources.map((resource, index) => (
                    <div key={index} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                      <h5 className="font-bold text-slate-900 mb-3">{resource.title}</h5>
                      <p className="text-slate-600 mb-4 text-sm">{resource.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-slate-500">{resource.duration}</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {resource.type}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleAccessResource(resource.title)}
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                      >
                        Access Resource
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}