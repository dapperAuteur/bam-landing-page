'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Brand Anthony McDonald',
    autoBackup: true,
    emailNotifications: true,
    maintenanceMode: false,
    maxFileSize: '10MB',
    allowedFileTypes: 'jpg,jpeg,png,gif,webp'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save settings to database
    console.log('Saving settings:', settings)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
                Maintenance Mode
              </label>
            </div>
          </div>
        </div>

        {/* Photo Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Photo Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max File Size
              </label>
              <select
                value={settings.maxFileSize}
                onChange={(e) => setSettings({...settings, maxFileSize: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="5MB">5MB</option>
                <option value="10MB">10MB</option>
                <option value="25MB">25MB</option>
                <option value="50MB">50MB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allowed File Types
              </label>
              <input
                type="text"
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings({...settings, allowedFileTypes: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="jpg,jpeg,png,gif,webp"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                Email notifications for new contacts
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoBackup"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="autoBackup" className="ml-2 text-sm text-gray-700">
                Automatic daily backups
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}