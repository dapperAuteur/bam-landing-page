'use client'

import { useState } from 'react'
import { ContactFormData, ContactFormResponse } from '../../types/contact'

interface FormErrors {
  name?: string
  email?: string
  serviceType?: string
  projectDetails?: string
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: 'Voiceover Services',
    projectDetails: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: ContactFormResponse = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setSubmitMessage(result.message)
        // Reset form
        setFormData({
          name: '',
          email: '',
          serviceType: 'Voiceover Services',
          projectDetails: ''
        })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.message)
        
        // Handle validation errors
        if ('errors' in result) {
          setErrors(result.errors as FormErrors)
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setSubmitMessage('Sorry, there was a problem submitting your form. Please try again or email me directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Let's Work Together
            </h2>
            <p className="text-xl text-gray-600">
              Ready to start your voiceover project or discuss business consulting? 
              Let's connect and make it happen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">contact@brandanthonymcdonald.com</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">Available for consultation calls</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Quick turnaround on voiceover projects</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Ready to Start?
                </h4>
                <p className="text-gray-600 mb-4">
                  Whether you need professional voiceover services or strategic business consulting, 
                  I'm here to help you achieve your goals with the same discipline and focus that 
                  drives my mission to become the world's fastest centenarian.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Project Inquiry
              </h3>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">{submitMessage}</p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800 font-medium">Error sending message</p>
                  </div>
                  <p className="text-red-700 text-sm mt-1">{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.serviceType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="Voiceover Services">Voiceover Services</option>
                    <option value="Business Consulting">Business Consulting</option>
                    <option value="Content Creation">Content Creation</option>
                    <option value="Combination Project">Combination Project</option>
                  </select>
                  {errors.serviceType && (
                    <p className="text-red-600 text-sm mt-1">{errors.serviceType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Details *
                  </label>
                  <textarea 
                    name="projectDetails"
                    value={formData.projectDetails}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.projectDetails ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Tell me about your project, timeline, and goals..."
                    required
                  />
                  {errors.projectDetails && (
                    <p className="text-red-600 text-sm mt-1">{errors.projectDetails}</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full btn-primary flex items-center justify-center ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </button>
              </form>

              <div className="mt-4 text-xs text-gray-500 text-center">
                * Required fields. I typically respond within 24 hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}