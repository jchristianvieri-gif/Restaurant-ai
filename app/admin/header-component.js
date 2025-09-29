'use client';
import { useDemoMode } from '../../lib/config';

export function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
              <span className="text-2xl text-white">🤖</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">GourmetAI Dashboard</h1>
              <p className="text-gray-600">AI-Powered Restaurant Management</p>
              <div className="flex items-center space-x-2 mt-1">
                {useDemoMode ? (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-yellow-600">Demo Mode - Local Testing</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Production Mode - Live Data</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <a 
            href="/" 
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ← Back to Restaurant
          </a>
        </div>
      </div>
    </header>
  );
}
