"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock data for admin dashboard
const mockAdminData = {
  totalStudents: 1247,
  activeSessions: 89,
  averageScore: 78.5,
  biasIncidents: 12,
  systemHealth: 95,
  fairnessCompliance: 88,
  mitigationEffectiveness: 75,
};

const performanceOverviewData = [
  { month: "Jan", students: 120, sessions: 40, score: 75 },
  { month: "Feb", students: 150, sessions: 55, score: 78 },
  { month: "Mar", students: 130, sessions: 45, score: 76 },
  { month: "Apr", students: 160, sessions: 60, score: 80 },
  { month: "May", students: 180, sessions: 70, score: 82 },
];

const biasSeverityData = [
  { name: "Low Bias", value: 700, color: "#10B981" },
  { name: "Moderate Bias", value: 200, color: "#F59E0B" },
  { name: "High Bias", value: 50, color: "#EF4444" },
];

const fairnessTrendsData = [
  { month: "Jan", fairnessScore: 80 },
  { month: "Feb", fairnessScore: 82 },
  { month: "Mar", fairnessScore: 85 },
  { month: "Apr", fairnessScore: 83 },
  { month: "May", fairnessScore: 88 },
];

const biasMitigationStrategies = [
  { id: 1, strategy: "Algorithm re-calibration", status: "Active", effectiveness: 85 },
  { id: 2, strategy: "Diverse training data", status: "Active", effectiveness: 90 },
  { id: 3, strategy: "Human-in-the-loop review", status: "Monitoring", effectiveness: 70 },
];

const biasFlaggedCases = [
  { id: "BFC001", studentId: "STU005", case: "Pediatric Exam", flaggedReason: "Speech rate anomaly", status: "Pending Review" },
  { id: "BFC002", studentId: "STU012", case: "Mental Health Interview", flaggedReason: "Accent detection variance", status: "Reviewed - No Action" },
  { id: "BFC003", studentId: "STU023", case: "Surgical Consultation", flaggedReason: "Audio quality degradation", status: "Pending Review" },
];

const studentList = [
  { id: "S001", name: "Alice Smith", email: "alice.s@example.com", role: "student", status: "Active" },
  { id: "S002", name: "Bob Johnson", email: "bob.j@example.com", role: "student", status: "Active" },
  { id: "S003", name: "Charlie Brown", email: "charlie.b@example.com", role: "student", status: "Inactive" },
  { id: "S004", name: "Diana Prince", email: "diana.p@example.com", role: "student", status: "Active" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  const handleSettings = () => {
    alert("The administrator can access system settings and configuration options.");
  };

  const handleExportReport = () => {
    alert("The administrator is exporting a comprehensive analytics report.");
  };

  const handleReviewCase = (caseId: string) => {
    alert(`The administrator is opening detailed review for case ${caseId}.`);
  };

  const handleApproveCase = (caseId: string) => {
    alert(`The administrator has approved case ${caseId}.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Pending Review": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Reviewed - No Action": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Inactive": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
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
                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-xs text-slate-500">System Management</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</a>
              <a href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">Login</a>
              <a href="/student" className="text-black hover:text-red-600 transition-colors">Student</a>
              <a href="/admin" className="text-red-600 font-medium">Admin</a>
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
                Administrator Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                System overview, analytics, and bias detection management
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleSettings}
                className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ⚙️ System Settings
              </button>
              <button 
                onClick={handleExportReport}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📥 Export Full Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8">
          {[
            { id: "overview", name: "Overview" },
            { id: "bias-analysis", name: "Bias Analysis" },
            { id: "fairness-metrics", name: "Fairness Metrics" },
            { id: "review-queue", name: "Review Queue" },
            { id: "students", name: "Students" }
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockAdminData.totalStudents}</h3>
                <p className="text-slate-600">Total Students</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockAdminData.activeSessions}</h3>
                <p className="text-slate-600">Active Sessions</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockAdminData.averageScore}%</h3>
                <p className="text-slate-600">Average Score</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{mockAdminData.biasIncidents}</h3>
                <p className="text-slate-600">Bias Incidents</p>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Platform Performance Overview</h3>
                <p className="text-slate-600 mb-6">Monthly active students, sessions, and average scores</p>
                <div className="space-y-4">
                  {performanceOverviewData.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{month.month}</span>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{month.students}</div>
                          <div className="text-xs text-slate-500">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{month.sessions}</div>
                          <div className="text-xs text-slate-500">Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{month.score}%</div>
                          <div className="text-xs text-slate-500">Score</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">System Health</h3>
                <p className="text-slate-600 mb-6">Overall system operational status and resource utilization</p>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-700 font-medium">Server Uptime</span>
                      <span className="font-bold text-emerald-600">99.9%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full" style={{width: '99.9%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-700 font-medium">Database Response</span>
                      <span className="font-bold text-emerald-600">Optimal</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-700 font-medium">API Latency</span>
                      <span className="font-bold text-amber-600">Average</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bias Analysis Tab */}
        {activeTab === "bias-analysis" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Bias Detection Summary</h3>
                <p className="text-slate-600 mb-6">Overview of detected bias incidents across the platform</p>
                <div className="space-y-4">
                  {biasSeverityData.map((bias, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{backgroundColor: bias.color}}></div>
                        <span className="font-medium text-slate-700">{bias.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{bias.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Mitigation Strategy Effectiveness</h3>
                <p className="text-slate-600 mb-6">Tracking the impact of active bias mitigation strategies</p>
                <div className="space-y-6">
                  {biasMitigationStrategies.map((strategy) => (
                    <div key={strategy.id}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-slate-700 font-medium">{strategy.strategy}</span>
                        <span className={`font-bold ${strategy.effectiveness > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {strategy.effectiveness}% Effective
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                          style={{width: `${strategy.effectiveness}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fairness Metrics Tab */}
        {activeTab === "fairness-metrics" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Fairness Trends Over Time</h3>
              <p className="text-slate-600 mb-6">Longitudinal analysis of fairness scores and metrics</p>
              <div className="space-y-4">
                {fairnessTrendsData.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{trend.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                          style={{width: `${trend.fairnessScore}%`}}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-900 w-12 text-right">{trend.fairnessScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Comprehensive Fairness Metrics</h3>
              <p className="text-slate-600 mb-8">Detailed metrics on various fairness dimensions</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-xl text-slate-800 mb-3">Demographic Parity</h4>
                  <p className="text-slate-600 mb-4">Ensures similar rates of positive outcomes across different groups</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-emerald-600">92%</span>
                    <span className="text-emerald-600 text-2xl">✓</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-xl text-slate-800 mb-3">Equal Opportunity</h4>
                  <p className="text-slate-600 mb-4">Ensures similar true positive rates for all groups</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-emerald-600">89%</span>
                    <span className="text-emerald-600 text-2xl">✓</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <h4 className="font-bold text-xl text-slate-800 mb-3">Predictive Parity</h4>
                  <p className="text-slate-600 mb-4">Ensures similar precision rates for all groups</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-amber-600">78%</span>
                    <span className="text-amber-600 text-2xl">◐</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl">
                  <h4 className="font-bold text-xl text-slate-800 mb-3">Bias Mitigation Strategies</h4>
                  <p className="text-slate-600 mb-4">Active strategies to reduce algorithmic bias</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-600">3 Active</span>
                    <span className="text-blue-600 text-2xl">📚</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Queue Tab */}
        {activeTab === "review-queue" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Bias-Flagged Cases Requiring Review</h3>
              <p className="text-slate-600 mb-6">Cases identified by the system for potential bias or anomalies</p>
              <div className="space-y-4">
                {biasFlaggedCases.map((caseItem) => (
                  <div key={caseItem.id} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h4 className="text-lg font-bold text-slate-900">{caseItem.studentId}</h4>
                          <span className="text-slate-600">{caseItem.case}</span>
                          <span className="text-slate-500 text-sm">{caseItem.id}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Flagged Reason:</span>
                            <span className="font-medium text-rose-600">{caseItem.flaggedReason}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                        <button 
                          onClick={() => handleReviewCase(caseItem.id)}
                          className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          👁️ Review
                        </button>
                        <button 
                          onClick={() => handleApproveCase(caseItem.id)}
                          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                        >
                          ✅ Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Student Management</h3>
              <p className="text-slate-600 mb-6">Manage student accounts, roles, and access permissions</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">ID</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Name</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Email</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Role</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                      <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentList.map((student) => (
                      <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-2 font-medium text-slate-900">{student.id}</td>
                        <td className="py-4 px-2 text-slate-600">{student.name}</td>
                        <td className="py-4 px-2 text-slate-600">{student.email}</td>
                        <td className="py-4 px-2 text-slate-600">{student.role}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex gap-2">
                            <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                              Edit
                            </button>
                            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-200">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}