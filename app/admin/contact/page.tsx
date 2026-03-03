'use client'

import { useState } from 'react'
import ContactDashboard from './../../../components/admin/ContactDashboard'
import EducationDashboard from './../../../components/admin/EducationDashboard'
import GuestSpeakerDashboard from '@/components/admin/GuestSpeakerDashboard'
import WorkoutFeedbackDashboard from '@/components/admin/WorkoutFeedbackDashboard'

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'education' | 'guest' | 'workout'>('contact')

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav
          role="tablist"
          aria-label="Admin dashboard sections"
          className="-mb-px flex overflow-x-auto gap-1 sm:gap-2"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'contact'}
            onClick={() => setActiveTab('contact')}
            className={`whitespace-nowrap flex-shrink-0 py-3 px-3 sm:px-4 border-b-2 font-medium text-sm ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contact Forms
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'education'}
            onClick={() => setActiveTab('education')}
            className={`whitespace-nowrap flex-shrink-0 py-3 px-3 sm:px-4 border-b-2 font-medium text-sm ${
              activeTab === 'education'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Education Forms
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'guest'}
            onClick={() => setActiveTab('guest')}
            className={`whitespace-nowrap flex-shrink-0 py-3 px-3 sm:px-4 border-b-2 font-medium text-sm ${
              activeTab === 'guest'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Guest Speakers
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'workout'}
            onClick={() => setActiveTab('workout')}
            className={`whitespace-nowrap flex-shrink-0 py-3 px-3 sm:px-4 border-b-2 font-medium text-sm ${
              activeTab === 'workout'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Workout Feedback
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'contact' && <ContactDashboard />}
          {activeTab === 'education' && <EducationDashboard />}
          {activeTab === 'guest' && <GuestSpeakerDashboard />}
          {activeTab === 'workout' && <WorkoutFeedbackDashboard />}
        </div>
      </div>
    </div>
  )
}