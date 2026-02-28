'use client'

import { useState, useEffect } from 'react'
import { ContactFormData, ContactFormResponse } from '../../types/contact'

// Client-side logger for contact form
enum ContactLogContext {
  FORM = "contact-form",
  VALIDATION = "contact-validation",
  SUBMISSION = "contact-submission"
}

const contactLogger = {
  info(context: ContactLogContext, message: string, metadata: any = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[${context.toUpperCase()}] INFO: ${message}`, metadata);
    }
  },

  warn(context: ContactLogContext, message: string, metadata: any = {}) {
    console.warn(`[${context.toUpperCase()}] WARNING: ${message}`, metadata);
  },

  error(context: ContactLogContext, message: string, error: any, metadata: any = {}) {
    const errorDetails = error instanceof Error ? { error: error.message, stack: error.stack } : { error };
    const fullMetadata = { ...errorDetails, ...metadata };
    console.error(`[${context.toUpperCase()}] ERROR: ${message}`, fullMetadata);
  }
};

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
    serviceType: 'Developer Relations',
    projectDetails: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formStartTime, setFormStartTime] = useState<number>(Date.now())
  const [interactionCount, setInteractionCount] = useState(0)

  // Log component mount
  useEffect(() => {
    contactLogger.info(ContactLogContext.FORM, "Contact form component mounted");
    setFormStartTime(Date.now());
    return () => {
      contactLogger.info(ContactLogContext.FORM, "Contact form component unmounted");
    };
  }, []);

  // Client-side email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Client-side validation
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        if (value.trim().length > 100) return 'Name cannot exceed 100 characters'
        break
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!isValidEmail(value.trim())) return 'Please enter a valid email address'
        break
      case 'projectDetails':
        if (!value.trim()) return 'Project details are required'
        if (value.trim().length < 10) return 'Please provide at least 10 characters'
        if (value.trim().length > 2000) return 'Project details cannot exceed 2000 characters'
        break
      default:
        break
    }
    return undefined
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Track interaction
    setInteractionCount(prev => prev + 1);
    
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time validation
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))

    // Log validation errors for analytics
    if (error) {
      contactLogger.warn(ContactLogContext.VALIDATION, `Validation error for field: ${name}`, {
        field: name,
        error,
        valueLength: value.length,
        interactionCount
      });
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))

    contactLogger.info(ContactLogContext.FORM, `Field blurred: ${name}`, {
      field: name,
      hasError: !!error,
      valueLength: value.length,
      timeOnField: Date.now() - formStartTime
    });
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    
    contactLogger.info(ContactLogContext.FORM, `Field focused: ${name}`, {
      field: name,
      interactionCount
    });
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) newErrors[key as keyof FormErrors] = error
    })

    setErrors(newErrors)
    
    const hasErrors = Object.keys(newErrors).length > 0;
    
    contactLogger.info(ContactLogContext.VALIDATION, "Form validation completed", {
      hasErrors,
      errorCount: Object.keys(newErrors).length,
      errors: newErrors,
      formData: {
        nameLength: formData.name.length,
        emailLength: formData.email.length,
        serviceType: formData.serviceType,
        projectDetailsLength: formData.projectDetails.length
      }
    });

    return !hasErrors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submissionStartTime = Date.now();
    const timeToSubmit = submissionStartTime - formStartTime;
    
    contactLogger.info(ContactLogContext.SUBMISSION, "Form submission started", {
      timeToSubmit,
      interactionCount,
      formData: {
        nameLength: formData.name.length,
        emailLength: formData.email.length,
        serviceType: formData.serviceType,
        projectDetailsLength: formData.projectDetails.length
      }
    });
    
    // Validate form before submitting
    if (!validateForm()) {
      setSubmitStatus('error')
      setSubmitMessage('Please fix the errors above and try again.')
      
      contactLogger.warn(ContactLogContext.SUBMISSION, "Form submission blocked by validation", {
        timeToSubmit,
        interactionCount
      });
      
      return
    }

    setIsSubmitting(true)
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
      const submissionDuration = Date.now() - submissionStartTime;

      if (result.success) {
        setSubmitStatus('success')
        setSubmitMessage(result.message)
        
        contactLogger.info(ContactLogContext.SUBMISSION, "Form submission successful", {
          timeToSubmit,
          submissionDuration,
          interactionCount,
          serviceType: formData.serviceType,
          projectDetailsLength: formData.projectDetails.length
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          serviceType: 'Developer Relations',
          projectDetails: ''
        })
        setErrors({})
        setInteractionCount(0)
        setFormStartTime(Date.now())
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.message)
        
        contactLogger.error(ContactLogContext.SUBMISSION, "Form submission failed", result, {
          timeToSubmit,
          submissionDuration,
          interactionCount,
          responseStatus: response.status
        });
        
        // Handle validation errors from server
        if ('errors' in result && result.errors) {
          setErrors(result.errors as FormErrors)
        }
      }
    } catch (error) {
      const submissionDuration = Date.now() - submissionStartTime;
      
      contactLogger.error(ContactLogContext.SUBMISSION, "Form submission network error", error, {
        timeToSubmit,
        submissionDuration,
        interactionCount
      });
      
      setSubmitStatus('error')
      setSubmitMessage('Sorry, there was a problem submitting your form. Please try again or email me directly at contact@brandanthonymcdonald.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Character counter for project details
  const projectDetailsCount = formData.projectDetails.length
  const projectDetailsMax = 2000

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Let's Work Together
            </h2>
            <p className="text-xl text-gray-600">
              Interested in developer relations, voiceover, or a collaboration?
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
                  <span className="text-gray-700">Quick turnaround on projects</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Ready to Start?
                </h4>
                <p className="text-gray-600 mb-4">
                  Whether you need developer advocacy, professional voiceover, or strategic consulting,
                  I bring the same discipline and focus that drives my mission to become the world's fastest centenarian.
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
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
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
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
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
                    onFocus={handleFocus}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                      errors.serviceType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="Developer Relations">Developer Relations</option>
                    <option value="Voiceover Services">Voiceover Services</option>
                    <option value="AI Consulting">AI Consulting</option>
                    <option value="Business Consulting">Business Consulting</option>
                    <option value="Sports Photography">Sports Photography</option>
                    <option value="Photography">Photography</option>
                    <option value="Content Creation">Content Creation</option>
                    <option value="Combination Project">Combination Project</option>
                  </select>
                  {errors.serviceType && (
                    <p className="text-red-600 text-sm mt-1">{errors.serviceType}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Details *
                    </label>
                    <span className={`text-xs ${
                      projectDetailsCount > projectDetailsMax ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {projectDetailsCount}/{projectDetailsMax}
                    </span>
                  </div>
                  <textarea 
                    name="projectDetails"
                    value={formData.projectDetails}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    rows={4}
                    maxLength={projectDetailsMax}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors resize-vertical ${
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
                  disabled={isSubmitting || Object.keys(errors).some(key => errors[key as keyof FormErrors])}
                  className={`w-full btn-primary flex items-center justify-center transition-all ${
                    isSubmitting || Object.keys(errors).some(key => errors[key as keyof FormErrors])
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-blue-700'
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