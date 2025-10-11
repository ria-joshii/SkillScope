"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock OSCE cases data
const oscCases = [
  {
    id: "case-1",
    title: "Chest Pain Assessment",
    description: "The student evaluates a patient presenting with acute chest pain, focusing on history taking, physical examination, and differential diagnosis.",
    duration: 15,
    difficulty: "intermediate",
    category: "Cardiology",
    competencies: [
      "Obtains chief complaint in patient's own words",
      "Uses OPQRST format for pain assessment",
      "Performs focused cardiovascular examination",
      "Considers cardiac risk factors systematically",
      "Orders appropriate diagnostic tests"
    ]
  },
  {
    id: "case-2", 
    title: "Pediatric Fever Evaluation",
    description: "The student assesses a 3-year-old child with high fever, demonstrating pediatric communication skills and age-appropriate examination techniques.",
    duration: 12,
    difficulty: "beginner",
    category: "Pediatrics",
    competencies: [
      "Uses age-appropriate communication",
      "Obtains immunization history",
      "Performs pediatric physical examination",
      "Assesses hydration status",
      "Provides parental education"
    ]
  },
  {
    id: "case-3",
    title: "Mental Health Crisis Management",
    description: "The student handles a patient experiencing a mental health crisis, demonstrating empathy, safety assessment, and appropriate intervention skills.",
    duration: 20,
    difficulty: "advanced",
    category: "Psychiatry",
    competencies: [
      "Establishes therapeutic rapport",
      "Conducts suicide risk assessment",
      "Demonstrates active listening skills",
      "Provides appropriate emotional support",
      "Documents comprehensive safety plan"
    ]
  },
  {
    id: "case-4",
    title: "Acute Abdominal Pain",
    description: "The student evaluates acute abdominal pain in an adult patient, focusing on systematic assessment and surgical emergency recognition.",
    duration: 18,
    difficulty: "intermediate", 
    category: "Gastroenterology",
    competencies: [
      "Obtains detailed pain history",
      "Performs systematic abdominal examination",
      "Recognizes surgical emergencies",
      "Orders appropriate imaging studies",
      "Provides effective pain management"
    ]
  }
];

const features = [
  {
    title: "AI-Powered Audio Analysis",
    description: "Advanced speech recognition analyzes the student's presentation for completeness and accuracy"
  },
  {
    title: "Comprehensive Performance Metrics",
    description: "Detailed analytics across multiple competencies with confidence scoring"
  },
  {
    title: "Bias Detection & Fairness",
    description: "AI-powered analysis ensures equitable evaluation across diverse student populations"
  },
  {
    title: "Personalized Learning Feedback",
    description: "Tailored recommendations help the student improve specific clinical skills"
  }
];

const rubricSections = [
  {
    category: "Chief Complaint",
    description: "Clear, concise statement of the patient's main concern",
    criteria: [
      "Uses patient's own words when possible",
      "Provides brief and specific description",
      "Avoids medical jargon"
    ]
  },
  {
    category: "History of Present Illness",
    description: "Detailed narrative of the current problem",
    criteria: [
      "Follows OPQRST format systematically",
      "Includes associated symptoms",
      "Considers etiology and risk factors",
      "Presents chronological progression"
    ]
  },
  {
    category: "Assessment & Plan",
    description: "Clinical reasoning and management approach",
    criteria: [
      "Provides well-reasoned discussion",
      "Lists ≥3 differential diagnoses",
      "Includes rationale for each diagnosis",
      "Outlines management plan"
    ]
  }
];

export default function HomePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const router = useRouter();

  const handleCaseSelect = (caseId: string) => {
    router.push(`/processing?case=${caseId}`);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      router.push("/processing?upload=true");
    }, 2000);
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
      intermediate: "bg-amber-100 text-amber-800 border-amber-200",
      advanced: "bg-rose-100 text-rose-800 border-rose-200"
    };
    return styles[difficulty as keyof typeof styles] || styles.beginner;
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Organic Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-red-200 to-red-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-25 blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black italic">OSCE</h1>
                <p className="text-sm text-gray-600">feedback system</p>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              <a href="/" className="text-red-600 font-medium text-lg relative group">
                Home
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-600"></div>
              </a>
              <a href="/login" className="text-black hover:text-red-600 transition-colors text-lg font-medium">Login</a>
              <a href="/student" className="text-black hover:text-red-600 transition-colors text-lg font-medium">Student</a>
              <a href="/admin" className="text-black hover:text-red-600 transition-colors text-lg font-medium">Admin</a>
            </div>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-32 px-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              <a 
                href="/login" 
                className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign Up
              </a>
              <div className="w-10 h-10 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center hover:from-red-300 hover:to-red-400 transition-colors cursor-pointer">
                🛒
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-8">
                {/* Social Media Icons */}
                <div className="flex flex-col space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-red-600 font-bold">f</span>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-red-600 font-bold">📷</span>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-red-600 font-bold">🐦</span>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-red-600 font-bold">P</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                  <h1 className="text-6xl font-bold text-black leading-tight">
                    Bringing Clinical
                    <span className="block">Excellence into</span>
                    <span className="block text-red-600">Life</span>
                  </h1>
                  <div className="w-24 h-1 bg-black"></div>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    When it comes to medical education, OSCE covers everything from clinical skills assessment to the latest AI-powered feedback systems.
                  </p>
                  
                  {/* Call to Action */}
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                    </div>
                    <span className="text-lg font-medium text-black underline decoration-black underline-offset-4">
                      Watch Demo
                    </span>
                  </div>
                </div>

                {/* Decorative Dots */}
                <div className="grid grid-cols-8 gap-4 opacity-30">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-red-300 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Right Side - Visual Elements */}
              <div className="relative">
                {/* Large Organic Shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-200 via-red-100 to-red-300 rounded-[60%] opacity-60 blur-2xl"></div>
                
                {/* Main Content Card */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-red-100">
                  {/* Wall Art */}
                  <div className="flex justify-center mb-8">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="w-16 h-16 bg-white border-2 border-red-200 rounded-lg"></div>
                      <div className="w-16 h-16 bg-red-600 rounded-lg shadow-lg"></div>
                      <div className="w-16 h-16 bg-white border-2 border-red-200 rounded-lg"></div>
                      <div className="w-16 h-16 bg-red-600 rounded-lg shadow-lg"></div>
                      <div className="w-16 h-16 bg-red-600 rounded-lg shadow-lg"></div>
                      <div className="w-16 h-16 bg-white border-2 border-red-200 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Central Feature */}
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                      <span className="text-white text-4xl">🎓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-black">AI-Powered Assessment</h3>
                    <p className="text-gray-600">Advanced clinical skills evaluation</p>
                  </div>

                  {/* Side Elements */}
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                    <div className="w-16 h-32 bg-white border border-red-200 rounded-lg shadow-lg flex items-center justify-center">
                      <span className="text-red-600 text-2xl">📊</span>
                    </div>
                  </div>
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <div className="w-16 h-32 bg-white border border-red-200 rounded-lg shadow-lg flex items-center justify-center">
                      <span className="text-red-600 text-2xl">⚖️</span>
                    </div>
                  </div>
                </div>

                {/* Small Organic Shape */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-red-200 to-red-300 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl">📤</span>
                </div>
                <h2 className="text-4xl font-bold text-black mb-6">
                  Upload Presentation Recording
                </h2>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                  The student uploads their OSCE presentation for comprehensive AI analysis and detailed feedback generation.
                </p>
                
                <div className="relative max-w-3xl mx-auto">
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-3xl p-16 hover:border-red-400 hover:bg-red-50/50 transition-all duration-300">
                    <div className="text-center">
                      <span className="text-8xl mb-6 block">📁</span>
                      <p className="text-2xl font-medium text-gray-700 mb-4">
                        {isUploading ? "Processing Presentation..." : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-gray-500 text-lg">
                        Audio (MP3, WAV) or Video (MP4, MOV) files up to 100MB
                      </p>
                      {isUploading && (
                        <div className="mt-8">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-red-600 h-4 rounded-full transition-all duration-500" 
                              style={{width: '75%'}}
                            ></div>
                          </div>
                          <p className="text-gray-500 mt-4">Analyzing presentation...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rubric Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-12">
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl">📋</span>
                </div>
                <h2 className="text-4xl font-bold text-black mb-6">
                  Assessment Rubric
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  The student is evaluated using standardized criteria for oral presentations and clinical competencies.
                </p>
                <button
                  onClick={() => setShowRubric(!showRubric)}
                  className="bg-red-600 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  {showRubric ? "Hide Rubric Details" : "View Assessment Criteria"}
                </button>
              </div>

              {showRubric && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {rubricSections.map((section, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                        <h3 className="text-2xl font-bold text-black mb-4">{section.category}</h3>
                        <p className="text-gray-600 mb-6">{section.description}</p>
                        <ul className="space-y-3">
                          {section.criteria.map((criterion, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-600">
                              <span className="text-red-500 mt-1">✓</span>
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-black mb-6">Assessment Scale</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-black mb-4 text-lg">Content Quality (0-2 scale)</h4>
                        <ul className="text-gray-600 space-y-2">
                          <li>• 2 = Satisfactory (minor corrections needed)</li>
                          <li>• 1 = Needs improvement (significant corrections needed)</li>
                          <li>• 0 = Did not perform</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-4 text-lg">Competency Level (EPA scale)</h4>
                        <ul className="text-gray-600 space-y-2">
                          <li>• Level 1-2: Supervised practice</li>
                          <li>• Level 3-4: Independent with guidance</li>
                          <li>• Level 5: Fully independent</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Practice Cases */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-black mb-6">
                Practice Cases
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                The student can practice with curated OSCE cases to develop their clinical presentation skills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {oscCases.map((caseItem) => (
                <div key={caseItem.id} className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 hover:shadow-3xl hover:border-red-300 transition-all duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-black mb-4">{caseItem.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{caseItem.description}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyBadge(caseItem.difficulty)}`}>
                      {caseItem.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-8 mb-8 text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <span className="font-medium text-lg">{caseItem.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <span className="font-medium text-lg">{caseItem.category}</span>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h4 className="font-bold text-black mb-6 text-xl">Key Competencies:</h4>
                    <ul className="space-y-4">
                      {caseItem.competencies.map((competency, index) => (
                        <li key={index} className="flex items-start gap-4 text-gray-600">
                          <span className="text-red-500 mt-1">✓</span>
                          <span className="text-lg">{competency}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCaseSelect(caseItem.id)}
                    className="w-full bg-red-600 text-white py-5 px-8 rounded-2xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                  >
                    ▶️ Start Practice Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-black mb-6">
                Advanced Features
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                The platform provides comprehensive tools for clinical skill development and assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 text-center hover:shadow-3xl hover:border-red-300 transition-all duration-300">
                  <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-red-600 rounded-3xl shadow-3xl p-16 text-white">
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl">🎓</span>
                </div>
                <h2 className="text-5xl font-bold mb-6">Ready to Begin?</h2>
                <p className="text-2xl text-red-100 mb-12 max-w-3xl mx-auto">
                  Join thousands of medical students and professionals using our platform for clinical skill development.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a 
                    href="/login" 
                    className="bg-white text-red-600 px-10 py-5 rounded-2xl font-semibold hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                  >
                    Sign In
                  </a>
                  <a 
                    href="/login" 
                    className="bg-white/20 text-white border-2 border-white px-10 py-5 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex justify-center space-x-12">
              <a href="/login" className="text-lg font-medium text-black hover:text-red-600 transition-colors">
                Explore More
              </a>
              <a href="/student" className="text-lg font-medium text-black hover:text-red-600 transition-colors">
                Trending
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}