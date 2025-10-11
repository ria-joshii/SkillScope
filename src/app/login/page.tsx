"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  role?: "student" | "admin";
  token?: string;
  error?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      router.push(userRole === 'student' ? '/student' : '/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (res.ok && data.role) {
        localStorage.setItem("userRole", data.role);
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        router.push(data.role === "student" ? "/student" : "/admin");
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your network and try again.");
    } finally {
      setIsLoading(false);
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
                <h1 className="text-xl font-bold text-slate-900">OSCE Feedback</h1>
                <p className="text-xs text-slate-500">Medical Education Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</a>
              <a href="/login" className="text-red-600 font-medium">Login</a>
              <a href="/student" className="text-black hover:text-red-600 transition-colors">Student</a>
              <a href="/admin" className="text-black hover:text-red-600 transition-colors">Admin</a>
            </div>
            
            <a 
              href="/" 
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎓</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome Back</h1>
            <p className="text-xl text-slate-600">
              The student or administrator can sign in to access their OSCE feedback dashboard
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-rose-600 text-xl">⚠️</span>
                  <span className="text-rose-800 text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>Sign In</span>
                    <span className="text-lg">🎓</span>
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600 mb-4">Demo Credentials</p>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Student:</span>
                    <span className="text-slate-800 font-mono">student@rutgers.edu / password123</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Administrator:</span>
                    <span className="text-slate-800 font-mono">teacher@rutgers.edu / password123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Platform Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎯</span>
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📊</span>
                  <span>Performance Metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">⚖️</span>
                  <span>Bias Detection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}