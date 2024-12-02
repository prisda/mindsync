import React from 'react';
import { ArrowRight, Brain, Sparkles, Folder, Search, Lock } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Organize{' '}
            <span className="relative whitespace-nowrap text-blue-600">
              <span className="relative">AI conversations</span>
            </span>{' '}
            with ease
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Your intelligent workspace for AI interactions. Save, organize, and reference your AI conversations in one beautiful place.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <a
              href="#"
              className="rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started for free
            </a>
            <a
              href="#"
              className="rounded-xl bg-gray-100 dark:bg-gray-800 px-8 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Live demo
            </a>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Intelligent Note-Taking</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to manage AI conversations
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <Brain className="h-5 w-5 flex-none text-blue-600" />
                  Smart Organization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Automatically categorize and tag your AI conversations for easy reference and retrieval.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <Sparkles className="h-5 w-5 flex-none text-blue-600" />
                  Rich Formatting
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Convert AI responses to beautiful, formatted notes with support for markdown and rich text.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <Search className="h-5 w-5 flex-none text-blue-600" />
                  Powerful Search
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Find any conversation instantly with our powerful search and filtering capabilities.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Screenshot Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Beautiful and Intuitive</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Experience a seamless workflow with our beautiful and intuitive interface. Organize your AI conversations the way you want.
            </p>
          </div>
          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative rounded-xl bg-gray-900 p-2 ring-1 ring-white/10 sm:rounded-2xl lg:flex lg:items-center">
              <div className="w-full flex-auto">
                <img
                  src="https://images.unsplash.com/photo-1693922874336-bf8a776e5a24?q=80&w=2532&auto=format&fit=crop"
                  alt="App screenshot"
                  className="rounded-lg shadow-2xl ring-1 ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}