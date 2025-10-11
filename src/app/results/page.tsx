"use client";

import { useState } from "react";

// Mock data for demonstration
const mockResults = {
  studentName: "Sarah Johnson",
  caseTitle: "Chest Pain Assessment",
  overallScore: 87,
  confidence: 0.89,
  duration: "12:34",
  timestamp: "2024-01-15 14:30",
  competencies: {
    communication: 92,
    clinicalReasoning: 85,
    empathy: 88,
    professionalism: 90
  }
};

const transcriptData = [
  {
    id: 1,
    timestamp: "00:15",
    speaker: "Student",
    text: "Good morning, I'm Dr. Johnson. What brings you in today?",
    type: "communication",
    status: "met"
  },
  {
    id: 2,
    timestamp: "00:22",
    speaker: "Patient",
    text: "I've been having chest pain for the past 2 hours.",
    type: "patient_response",
    status: "neutral"
  },
  {
    id: 3,
    timestamp: "00:28",
    speaker: "Student",
    text: "I'm sorry to hear that. Can you tell me more about the pain?",
    type: "empathy",
    status: "met"
  },
  {
    id: 4,
    timestamp: "00:35",
    speaker: "Student",
    text: "When did the pain start exactly?",
    type: "clinical_reasoning",
    status: "met"
  },
  {
    id: 5,
    timestamp: "00:42",
    speaker: "Patient",
    text: "About 2 hours ago, while I was walking up the stairs.",
    type: "patient_response",
    status: "neutral"
  },
  {
    id: 6,
    timestamp: "00:48",
    speaker: "Student",
    text: "Can you describe what the pain feels like?",
    type: "clinical_reasoning",
    status: "met"
  },
  {
    id: 7,
    timestamp: "00:55",
    speaker: "Patient",
    text: "It's a sharp, stabbing pain in the center of my chest.",
    type: "patient_response",
    status: "neutral"
  },
  {
    id: 8,
    timestamp: "01:02",
    speaker: "Student",
    text: "Does the pain radiate anywhere else?",
    type: "clinical_reasoning",
    status: "met"
  },
  {
    id: 9,
    timestamp: "01:08",
    speaker: "Patient",
    text: "Yes, it goes to my left arm and jaw.",
    type: "patient_response",
    status: "neutral"
  },
  {
    id: 10,
    timestamp: "01:15",
    speaker: "Student",
    text: "That sounds concerning. Let me examine you now.",
    type: "empathy",
    status: "met"
  }
];

const checklistItems = [
  {
    id: 1,
    item: "Obtains chief complaint in patient's own words",
    status: "met",
    confidence: 0.95,
    evidence: "00:15",
    feedback: "Excellent - used patient's exact words"
  },
  {
    id: 2,
    item: "Uses OPQRST format for pain assessment",
    status: "met",
    confidence: 0.88,
    evidence: "00:35-01:08",
    feedback: "Good systematic approach to pain history"
  },
  {
    id: 3,
    item: "Asks about associated symptoms",
    status: "partial",
    confidence: 0.72,
    evidence: "01:08",
    feedback: "Partially addressed - could ask about nausea, sweating"
  },
  {
    id: 4,
    item: "Performs focused cardiovascular examination",
    status: "met",
    confidence: 0.91,
    evidence: "01:15+",
    feedback: "Comprehensive cardiac exam performed"
  },
  {
    id: 5,
    item: "Considers cardiac risk factors",
    status: "missed",
    confidence: 0.45,
    evidence: "N/A",
    feedback: "Did not inquire about smoking, diabetes, family history"
  },
  {
    id: 6,
    item: "Demonstrates empathy and reassurance",
    status: "met",
    confidence: 0.93,
    evidence: "00:28, 01:15",
    feedback: "Excellent empathetic responses throughout"
  }
];

const feedbackSummary = {
  strengths: [
    "Excellent communication skills and patient rapport",
    "Systematic approach to pain assessment using OPQRST",
    "Demonstrates genuine empathy and concern",
    "Clear, professional presentation style"
  ],
  improvements: [
    "Inquire about cardiac risk factors (smoking, diabetes, family history)",
    "Ask about associated symptoms (nausea, sweating, shortness of breath)",
    "Consider pain severity rating scale",
    "Include medication and allergy history"
  ],
  recommendations: [
    "Practice comprehensive history taking checklist",
    "Review cardiac risk stratification guidelines",
    "Continue developing empathetic communication skills",
    "Consider additional OSCE cases for practice"
  ]
};

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTranscript, setSelectedTranscript] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "met": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "partial": return "bg-amber-100 text-amber-800 border-amber-200";
      case "missed": return "bg-rose-100 text-rose-800 border-rose-200";
      case "empathy": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "met": return "✓";
      case "partial": return "◐";
      case "missed": return "✗";
      case "empathy": return "💙";
      default: return "•";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-emerald-600";
    if (confidence >= 0.6) return "text-amber-600";
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
                <h1 className="text-xl font-bold text-slate-900">OSCE Results</h1>
                <p className="text-xs text-slate-500">Assessment Feedback</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                ← Back to Dashboard
              </button>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                📥 Download Report
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Assessment Results
              </h1>
              <p className="text-lg text-slate-600">
                {mockResults.caseTitle} • {mockResults.studentName}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Completed on {mockResults.timestamp} • Duration: {mockResults.duration}
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <div className="bg-red-600 rounded-2xl p-6 text-white text-center">
                <div className="text-4xl font-bold mb-1">{mockResults.overallScore}%</div>
                <div className="text-red-100">Overall Score</div>
                <div className="text-sm text-red-200 mt-2">
                  Confidence: {(mockResults.confidence * 100).toFixed(0)}%
                </div>
              </div>
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
            { id: "transcript", name: "Transcript" },
            { id: "checklist", name: "Checklist" },
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Competency Scores */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Competency Scores</h2>
                <div className="space-y-6">
                  {Object.entries(mockResults.competencies).map(([competency, score]) => (
                    <div key={competency} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-700 capitalize">
                            {competency.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-bold text-slate-900">{score}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                            style={{width: `${score}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Items Completed</span>
                    <span className="font-bold text-emerald-600">4/6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Partial Items</span>
                    <span className="font-bold text-amber-600">1/6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Missed Items</span>
                    <span className="font-bold text-rose-600">1/6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Empathy Markers</span>
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Next Steps</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Review cardiac risk factor assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Practice comprehensive history taking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Continue developing empathy skills</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === "transcript" && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Presentation Transcript</h2>
            <div className="space-y-4">
              {transcriptData.map((segment) => (
                <div
                  key={segment.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedTranscript === segment.id
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedTranscript(selectedTranscript === segment.id ? null : segment.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${getStatusColor(segment.status)}`}>
                        {getStatusIcon(segment.status)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-slate-500">{segment.timestamp}</span>
                        <span className="text-sm font-semibold text-slate-700">{segment.speaker}</span>
                        {segment.type !== "patient_response" && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(segment.status)}`}>
                            {segment.type.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{segment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === "checklist" && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Assessment Checklist</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Item</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Confidence</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Evidence</th>
                    <th className="text-left py-4 px-2 font-semibold text-slate-700">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {checklistItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-2 text-slate-700">{item.item}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)} {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`font-bold ${getConfidenceColor(item.confidence)}`}>
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          {item.evidence}
                        </button>
                      </td>
                      <td className="py-4 px-2 text-slate-600 text-sm">{item.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Strengths */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">✓</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Strengths</h3>
              </div>
              <ul className="space-y-4">
                {feedbackSummary.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span className="text-slate-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 font-bold">◐</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Improvements</h3>
              </div>
              <ul className="space-y-4">
                {feedbackSummary.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    <span className="text-slate-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">💡</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Recommendations</h3>
              </div>
              <ul className="space-y-4">
                {feedbackSummary.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-slate-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}