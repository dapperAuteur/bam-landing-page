'use client'

import { useState } from 'react'
import ContactDashboard from './../../../components/admin/ContactDashboard'
import EducationDashboard from './../../../components/admin/EducationDashboard'
import GuestSpeakerDashboard from '@/components/admin/GuestSpeakerDashboard'

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'education' | 'guest'>('contact')

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contact Forms
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'education'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Education Forms
          </button>
          <button
            onClick={() => setActiveTab('guest')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'guest'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Guest Speakers
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'contact' && <ContactDashboard />}
          {activeTab === 'education' && <EducationDashboard />}
          {activeTab === 'guest' && <GuestSpeakerDashboard />}
        </div>
      </div>
    </div>
  )
}