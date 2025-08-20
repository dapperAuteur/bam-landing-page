'use client'

import ContactDashboard from './../../../components/admin/ContactDashboard'

export default function AdminContactPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ContactDashboard />
        </div>
      </div>
    </div>
  )
}