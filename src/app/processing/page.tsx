"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Mic, FileText, BarChart3, CheckCircle } from "lucide-react";

const processingSteps = [
  { id: 1, name: "Audio Processing", description: "Converting audio to text and analyzing speech patterns", icon: Mic },
  { id: 2, name: "Clinical Analysis", description: "Evaluating medical knowledge and clinical reasoning", icon: Brain },
  { id: 3, name: "Communication Assessment", description: "Analyzing empathy markers and communication skills", icon: FileText },
  { id: 4, name: "Bias Detection", description: "Checking for fairness across different speech characteristics", icon: BarChart3 },
];

export default function ProcessingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          // Redirect to results after completion
          setTimeout(() => {
            window.location.href = '/results';
          }, 2000);
          return 100;
        }
        
        const newProgress = prev + Math.random() * 15;
        const stepProgress = Math.floor(newProgress / 25);
        
        if (stepProgress >= currentStep && currentStep < 4) {
          setCurrentStep(stepProgress + 1);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Analyzing Your OSCE Performance
        </h1>
        <p className="text-xl text-gray-600">
          Our AI is processing your recording to provide comprehensive feedback
        </p>
      </div>

      {/* Main Progress Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Processing Progress</CardTitle>
          <CardDescription className="text-center">
            This usually takes 2-3 minutes depending on recording length
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="space-y-4">
            {processingSteps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                    isActive ? 'bg-blue-50 border border-blue-200' : 
                    isCompleted ? 'bg-green-50 border border-green-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white animate-pulse' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      isActive ? 'text-blue-900' : 
                      isCompleted ? 'text-green-900' : 
                      'text-gray-700'
                    }`}>
                      {step.name}
                    </h3>
                    <p className={`text-sm ${
                      isActive ? 'text-blue-700' : 
                      isCompleted ? 'text-green-700' : 
                      'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">📝</span>
            </div>
            <h3 className="font-medium mb-2">Transcript Analysis</h3>
            <p className="text-sm text-gray-600">
              Converting speech to text with speaker identification
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-lg">✅</span>
            </div>
            <h3 className="font-medium mb-2">Checklist Scoring</h3>
            <p className="text-sm text-gray-600">
              Evaluating clinical competencies and communication skills
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-lg">⚖️</span>
            </div>
            <h3 className="font-medium mb-2">Bias Detection</h3>
            <p className="text-sm text-gray-600">
              Ensuring fair assessment across different speech patterns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Analysis Complete!
            </h2>
            <p className="text-green-700">
              Your comprehensive OSCE feedback report is ready. Redirecting to results...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
