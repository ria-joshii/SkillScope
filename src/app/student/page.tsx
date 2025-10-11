"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentPage() {
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "student") {
      router.push("/login");
      return;
    }
  }, [router]);

  const handleSearch = async () => {
    if (!sessionId.trim()) {
      setError("Please enter a session ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setSession(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setSession(data.session);
      } else {
        setError(data.message || "Session not found");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">OSCE Student Portal</h1>
              <p className="text-sm text-gray-600">View your OSCE feedback reports</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Search for Your Report</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700">
                Session ID
              </label>
              <input
                id="sessionId"
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter your unique session ID"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {session && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Session Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Session ID</label>
                  <p className="mt-1 text-sm text-gray-900">{session.unique_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    session.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Name</label>
                  <p className="mt-1 text-sm text-gray-900">{session.file_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {session.status === 'completed' && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Feedback Report</h3>
                  <a
                    href={`/api/download/${session.unique_id}`}
                    download
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Download PDF Report
                  </a>
                </div>
              )}

              {session.status === 'processing' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    Your report is currently being processed. Please check back later.
                  </p>
                </div>
              )}

              {session.status === 'failed' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">
                    There was an error processing your session. Please contact your instructor.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}