"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  User,
  Settings
} from "lucide-react";

// Mock PDF generation function
const generatePDF = () => {
  // In a real implementation, this would use react-pdf or similar library
  const element = document.createElement('a');
  const file = new Blob(['OSCE Assessment Report\n\nStudent: Sarah Johnson\nDate: 2024-01-15\nOverall Score: 85%\n\nDetailed feedback and analysis...'], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = 'osce-assessment-report.pdf';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export default function ExportPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      generatePDF();
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Export Assessment Report
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Generate comprehensive PDF reports of your OSCE assessments for portfolio building and academic records.
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Standard Report
            </CardTitle>
            <CardDescription>
              Complete assessment summary with scores, feedback, and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Overall performance score</li>
                <li>• Detailed checklist results</li>
                <li>• Strengths and areas for improvement</li>
                <li>• Bias analysis summary</li>
                <li>• Professional recommendations</li>
              </ul>
            </div>
            <Button 
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="w-full medical-primary"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Detailed Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive report with transcript, evidence, and detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full transcript with highlights</li>
                <li>• Clickable evidence timestamps</li>
                <li>• Detailed bias analysis</li>
                <li>• Performance trends</li>
                <li>• Learning recommendations</li>
                <li>• Portfolio-ready format</li>
              </ul>
            </div>
            <Button 
              onClick={handleExportPDF}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Detailed Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Sample of what your exported report will look like</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">OSCE Assessment Report</h2>
              <p className="text-gray-600">Chest Pain Assessment</p>
              <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Student Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> Sarah Johnson</p>
                  <p><strong>Student ID:</strong> STU2024001</p>
                  <p><strong>Assessment Date:</strong> January 15, 2024</p>
                  <p><strong>Case:</strong> Chest Pain Assessment</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Performance Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Overall Score:</strong> 85%</p>
                  <p><strong>Communication:</strong> 88%</p>
                  <p><strong>Clinical Skills:</strong> 82%</p>
                  <p><strong>Empathy:</strong> 91%</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Key Strengths</h3>
              <ul className="text-sm space-y-1">
                <li>• Excellent empathy and patient communication</li>
                <li>• Strong clinical reasoning demonstrated</li>
                <li>• Professional demeanor maintained throughout</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Areas for Improvement</h3>
              <ul className="text-sm space-y-1">
                <li>• Consider asking more open-ended questions</li>
                <li>• Practice explaining procedures before performing them</li>
                <li>• Work on maintaining eye contact during difficult conversations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Chest Pain Assessment Report", date: "2024-01-15", type: "Standard" },
              { name: "Pediatric Fever Analysis", date: "2024-01-12", type: "Detailed" },
              { name: "Mental Health Crisis Report", date: "2024-01-10", type: "Standard" }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date} • {report.type} Report</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
