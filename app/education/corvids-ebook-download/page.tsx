import { Metadata } from 'next'
import { CheckCircle, Download, BookOpen, Users, Calendar, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Download Your Corvids Education Package | Brand Anthony McDonald',
  description: 'Access your complete Corvids of Fishers educational curriculum package with activities, lesson plans, and documentary content.',
  keywords: 'corvids education, elementary science, Indiana wildlife, educational curriculum, K-5 activities',
}

export default function CorvidEbookDownload() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Interest!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your request for the Corvids of Fishers Educational Series has been received.
            </p>
            <p className="text-lg text-gray-500">
              Download your complete curriculum package below.
            </p>
          </div>

          {/* Download Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Complete Education Package
              </h2>
              <p className="text-gray-600 mb-6">
                Download the comprehensive marketing eBook with full curriculum details, 
                implementation guides, and standards alignment information.
              </p>
              
              <a 
                href="/corvids-of-fishers-educational-marketing-ebook.html"
                download="Corvids-of-Fishers-Educational-Series.html"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 text-lg"
              >
                <Download className="w-6 h-6 mr-3" />
                Download Education Package
              </a>
            </div>

            {/* Package Contents */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-800 mb-2">K-5 Activities</h3>
                <p className="text-blue-700 text-sm">Standards-aligned activities for all elementary grades</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">Complete Curriculum</h3>
                <p className="text-green-700 text-sm">Lesson plans, assessments, and implementation guides</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-800 mb-2">Ready to Use</h3>
                <p className="text-purple-700 text-sm">Materials lists and timeline for immediate implementation</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-8">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">📧 Check Your Email</h3>
                <p className="text-gray-600 mb-4">
                  You'll receive additional resources and implementation support within 24 hours, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Sample documentary episode links</li>
                  <li>Printable activity sheets</li>
                  <li>Assessment rubric templates</li>
                  <li>Custom content creation information</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">🎯 Implementation Support</h3>
                <p className="text-gray-600 mb-4">
                  Need help getting started? We provide:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Teacher training webinars</li>
                  <li>Materials sourcing guidance</li>
                  <li>Standards alignment verification</li>
                  <li>Custom local wildlife content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-2">
              Questions about implementation or custom content creation?
            </p>
            <p className="text-gray-700">
              Contact us at <a href="mailto:a@awews.com" className="text-blue-600 underline hover:text-blue-700">a@awews.com</a> or 
              <span className="text-blue-600"> (602) 456-9335</span>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Join 500+ educators already transforming science education with local wildlife content
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}