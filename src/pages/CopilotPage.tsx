import React, { useState } from 'react';
import { Bot, Send, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CopilotPage() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      // AI processing logic will go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Copilot</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
              <h3 className="flex items-center text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                <Sparkles className="w-5 h-5 mr-2" />
                Smart Suggestions
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Get AI-powered suggestions for organizing and categorizing your notes.
              </p>
            </div>
            {/* Add more feature cards as needed */}
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me anything about your notes..."
                className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={isProcessing || !prompt.trim()}
                className={`absolute bottom-4 right-4 p-2 rounded-lg ${
                  isProcessing || !prompt.trim()
                    ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Response Area */}
          <div className="mt-8">
            {/* AI responses will be rendered here */}
          </div>
        </div>
      </main>
    </div>
  );
}