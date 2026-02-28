'use client'

import { useState } from 'react'

const sections = [
  { id: 'gallery', label: 'Gallery System' },
  { id: 'proposals', label: 'Proposals & Projects' },
  { id: 'contact', label: 'Contact Dashboard' },
  { id: 'blog', label: 'Blog Management' },
  { id: 'content', label: 'Portfolio & Content' },
  { id: 'tips', label: 'Tips & Troubleshooting' },
]

export default function AdminGuidePage() {
  const [activeSection, setActiveSection] = useState('gallery')

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Guide</h1>
        <p className="mt-2 text-gray-600">
          Complete reference for managing galleries, proposals, blog, and site content.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-56 shrink-0 sticky top-6 self-start">
          <ul className="space-y-1">
            {sections.map(section => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    setActiveSection(section.id)
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-10 max-w-4xl">

          {/* ===== GALLERY SYSTEM ===== */}
          <section id="gallery" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery System</h2>
            <p className="text-gray-600 mb-6">
              Create media galleries for clients with photos, videos, and documents. Clients access galleries via a unique link — optionally password-protected.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Creating a Gallery</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Navigate to <span className="font-mono text-sm bg-gray-100 px-1 rounded">Admin &gt; Galleries</span></li>
                  <li>Click <strong>&quot;Create New Gallery&quot;</strong></li>
                  <li>Fill in client details:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-gray-600">
                      <li><strong>Client Name</strong> — who the gallery is for</li>
                      <li><strong>Client Email</strong> — for communication</li>
                      <li><strong>Event Name</strong> — title displayed on the gallery</li>
                      <li><strong>Event Date</strong> — displayed in gallery header</li>
                      <li><strong>Description</strong> — optional context for the client</li>
                    </ul>
                  </li>
                  <li>Click <strong>&quot;Create&quot;</strong> to save the gallery</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Uploading Media</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Open an existing gallery and click <strong>&quot;Upload Media&quot;</strong></li>
                  <li>Select files — supports multiple file types:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-gray-600">
                      <li><strong>Images</strong> (up to 20MB) — JPG, PNG, WebP, etc.</li>
                      <li><strong>Videos</strong> (up to 100MB) — MP4, MOV, etc.</li>
                      <li><strong>Documents</strong> (up to 50MB) — PDF, PPTX, DOCX, XLSX</li>
                    </ul>
                  </li>
                  <li>Files upload to Cloudinary with automatic thumbnail generation</li>
                  <li>Delete individual items by clicking the delete button on each media card</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Gallery Settings</h3>
                <p className="text-gray-600 mb-2">Edit a gallery to configure these options:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li><strong>Allow Downloads</strong> — let clients download individual files</li>
                  <li><strong>Allow Full-Size Access</strong> — show original resolution images</li>
                  <li><strong>Require Password</strong> — protect with an access code</li>
                  <li><strong>Access Code</strong> — the password clients must enter</li>
                  <li><strong>Show Metadata</strong> — display file info on media cards</li>
                  <li><strong>Enable Social Sharing</strong> — allow sharing links from gallery</li>
                  <li><strong>Layout Mode</strong> — grid, masonry, or slideshow</li>
                  <li><strong>Expiration Date</strong> — auto-disable gallery after this date</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Sharing the Gallery</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-gray-700">
                    Share the gallery link with your client: <span className="font-mono text-sm bg-white px-2 py-1 rounded border">/client-gallery/[galleryId]</span>
                  </p>
                  <p className="text-gray-600 mt-2 text-sm">
                    The gallery ID is automatically generated when you create the gallery. If password-protected, share the access code separately.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Client Experience</h3>
                <p className="text-gray-600 mb-2">When a client opens the gallery link, they can:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li><strong>Enter access code</strong> if the gallery is password-protected</li>
                  <li><strong>Browse media</strong> in a responsive grid layout</li>
                  <li><strong>Filter by type</strong> — Images, Videos, or Documents tabs</li>
                  <li><strong>Open lightbox</strong> — click any item for full-screen viewing with navigation</li>
                  <li><strong>Like items</strong> — click the heart icon on any media card</li>
                  <li><strong>Comment</strong> — add comments on individual items</li>
                  <li><strong>Download individual files</strong> (if downloads enabled)</li>
                  <li><strong>Download all files</strong> — batch download button in header</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ===== PROPOSALS & PROJECTS ===== */}
          <section id="proposals" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proposals & Projects</h2>
            <p className="text-gray-600 mb-6">
              Create professional proposals for clients with cover letters, pricing, timelines, deliverables, and media. Track client responses and view engagement analytics.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Creating a Project</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Navigate to <span className="font-mono text-sm bg-gray-100 px-1 rounded">Admin &gt; Projects</span></li>
                  <li>Click <strong>&quot;Create New Project&quot;</strong></li>
                  <li>Fill in project details:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-gray-600">
                      <li><strong>Client Name &amp; Email</strong></li>
                      <li><strong>Project Name</strong> — title displayed on the proposal</li>
                      <li><strong>Description</strong> — brief overview</li>
                      <li><strong>Service Category</strong> — Voiceover, AI Consulting, Business Consulting, Sports Photography, Photography, Content Creation, Dev Relations, or Combination</li>
                      <li><strong>Project Type</strong> — Proposal, Gallery, Deliverable, or Mixed</li>
                      <li><strong>Access Code</strong> — optional password for portal access</li>
                      <li><strong>Brand Color</strong> — custom hex color for the client-facing portal</li>
                    </ul>
                  </li>
                  <li>The project starts in <strong>Draft</strong> status</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Editing the Proposal (3-Tab Editor)</h3>
                <p className="text-gray-600 mb-3">Click into any project to open the editor with three tabs:</p>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Tab 1: Proposal Content</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li><strong>Cover Letter</strong> — introduction text (supports markdown)</li>
                      <li><strong>Scope of Work</strong> — detailed project description (markdown)</li>
                      <li><strong>Deliverables</strong> — add items with name, description, due date, and status (pending / in-progress / completed / delivered)</li>
                      <li><strong>Pricing</strong> — line items with description, quantity, unit price. Totals auto-calculate. Optional tax field</li>
                      <li><strong>Timeline</strong> — phases with name, description, start/end dates, and status indicators</li>
                      <li><strong>Terms &amp; Conditions</strong> — legal text (markdown)</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-2">Click &quot;Save Proposal&quot; after editing.</p>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Tab 2: Media</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Upload images, videos, and documents related to the project</li>
                      <li>Media displays in a grid — delete individual items as needed</li>
                      <li>Uploaded media appears in the client&apos;s portal view</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Tab 3: Settings</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li><strong>Allow Downloads</strong> — clients can download media</li>
                      <li><strong>Allow Comments</strong> — clients can leave notes</li>
                      <li><strong>Allow Approval</strong> — show approve/decline buttons</li>
                      <li><strong>Show Pricing</strong> — display pricing section to clients</li>
                      <li><strong>Show Timeline</strong> — display timeline section</li>
                      <li><strong>Require Password</strong> — protect with access code</li>
                      <li><strong>Brand Color</strong> — custom accent color on portal</li>
                      <li><strong>Company Name</strong> — displayed in portal header</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Status Pipeline</h3>
                <p className="text-gray-600 mb-3">Projects follow this lifecycle:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { status: 'Draft', color: 'bg-gray-100 text-gray-800' },
                    { status: 'Sent', color: 'bg-blue-100 text-blue-800' },
                    { status: 'Viewed', color: 'bg-yellow-100 text-yellow-800' },
                    { status: 'Approved', color: 'bg-green-100 text-green-800' },
                    { status: 'Rejected', color: 'bg-red-100 text-red-800' },
                    { status: 'Revised', color: 'bg-purple-100 text-purple-800' },
                  ].map(({ status, color }) => (
                    <span key={status} className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                      {status}
                    </span>
                  ))}
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Projects start as <strong>Draft</strong> while you build the proposal</li>
                  <li>Click <strong>&quot;Send to Client&quot;</strong> to change status to <strong>Sent</strong> — this sends an email notification to the client with the portal link and access code</li>
                  <li>Status auto-updates to <strong>Viewed</strong> when the client opens the portal</li>
                  <li>Client can <strong>Approve</strong>, <strong>Decline</strong>, or <strong>Request Revision</strong> — each triggers an email notification to you</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin: Analytics Dashboard</h3>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-gray-700 mb-2">
                    Click <strong>&quot;Analytics&quot;</strong> on any project to see engagement data:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>Total Views</strong> — how many times the portal was opened</li>
                    <li><strong>Time Spent</strong> — total time client spent viewing</li>
                    <li><strong>Media Views</strong> — individual media item engagement</li>
                    <li><strong>Downloads</strong> — number of files downloaded</li>
                    <li><strong>Views Over Time</strong> — chart showing access patterns</li>
                    <li><strong>Section Engagement</strong> — which parts of the proposal got the most attention</li>
                    <li><strong>Recent Activity</strong> — timestamped feed of all portal events</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Client Experience</h3>
                <p className="text-gray-600 mb-2">When a client opens the portal link:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>If password-protected, they enter the access code</li>
                  <li>They see a branded proposal with your custom color and company name</li>
                  <li>Proposal sections displayed in order: Cover Letter, Scope of Work, Deliverables (with status badges), Pricing Table, Timeline (with phase status), Media Gallery, Terms &amp; Conditions</li>
                  <li>At the bottom, they can respond:
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-gray-600">
                      <li><strong>Approve</strong> (green) — accepts the proposal</li>
                      <li><strong>Request Revision</strong> (yellow) — asks for changes with notes</li>
                      <li><strong>Decline</strong> (red) — rejects the proposal with optional note</li>
                    </ul>
                  </li>
                  <li>Each response triggers an email notification to the admin</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">New Features</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Email Notifications</strong> — automatic emails on send and client response</li>
                    <li><strong>Analytics Dashboard</strong> — full engagement tracking with charts</li>
                    <li><strong>Brand Customization</strong> — custom colors, company name, and logo for client portals</li>
                    <li><strong>Deliverable Status Tracking</strong> — mark deliverables as pending, in-progress, completed, or delivered</li>
                    <li><strong>Status History</strong> — full audit trail of all status changes with timestamps</li>
                    <li><strong>Media Gallery in Proposals</strong> — embed photos, videos, and documents directly in proposals</li>
                    <li><strong>Client Session Management</strong> — secure cookie-based sessions for password-protected portals</li>
                    <li><strong>Expiration Dates</strong> — proposals can auto-expire after a set date</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ===== CONTACT DASHBOARD ===== */}
          <section id="contact" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Dashboard</h2>
            <p className="text-gray-600 mb-4">
              View and manage all incoming submissions from the public website.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Three Sub-Tabs</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li><strong>Contact Forms</strong> — general inquiries submitted via the contact page</li>
                  <li><strong>Education Forms</strong> — submissions from the education interest form</li>
                  <li><strong>Guest Speakers</strong> — guest speaker booking requests</li>
                </ul>
              </div>
              <p className="text-gray-600">
                Each tab displays submissions with timestamps, contact details, and message content. Use the logs dashboard for detailed activity and status tracking.
              </p>
            </div>
          </section>

          {/* ===== BLOG MANAGEMENT ===== */}
          <section id="blog" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Blog Management</h2>
            <p className="text-gray-600 mb-4">
              Manage blog post metadata from the admin panel. Blog post content lives as TSX component files — the admin UI controls visibility, featured status, and metadata.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin: Blog Management Page</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Navigate to <span className="font-mono text-sm bg-gray-100 px-1 rounded">Admin &gt; Blog</span></li>
                  <li>First time: click <strong>&quot;Sync from Code&quot;</strong> to import all blog post metadata into the database</li>
                  <li>Toggle <strong>Featured</strong> status on any post with a single click</li>
                  <li>Toggle <strong>Hidden</strong> to remove a post from the public blog listing</li>
                  <li>Click <strong>&quot;Edit&quot;</strong> to modify metadata: title, description, excerpt, category, tags, read time, publish date</li>
                  <li>Use search and category filters to find specific posts</li>
                  <li>Click <strong>&quot;View&quot;</strong> to open any post on the public site</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Adding New Blog Posts</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-gray-700 mb-2">New blog post content must still be added as code:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Create folder: <span className="font-mono text-sm bg-white px-1 rounded border">/app/blog/[your-slug]/page.tsx</span></li>
                    <li>Add metadata entry to <span className="font-mono text-sm bg-white px-1 rounded border">lib/blogData.ts</span></li>
                    <li>Click <strong>&quot;Sync from Code&quot;</strong> in admin to import the new post</li>
                    <li>Use admin to toggle featured, edit metadata, etc.</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* ===== PORTFOLIO & CONTENT ===== */}
          <section id="content" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio & Site Content</h2>
            <p className="text-gray-600 mb-4">
              Manage portfolio projects, experience entries, and skills from the admin panel. Like blog posts, the source data lives in TypeScript files — the admin UI controls visibility and metadata overrides.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin: Content Management Page</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Navigate to <span className="font-mono text-sm bg-gray-100 px-1 rounded">Admin &gt; Content</span></li>
                  <li>Three tabs: <strong>Projects</strong>, <strong>Experience</strong>, <strong>Skills</strong></li>
                  <li>Click <strong>&quot;Sync from Code&quot;</strong> to import data from the TypeScript source files</li>
                  <li>Toggle <strong>Featured</strong> to highlight items on the public site</li>
                  <li>Toggle <strong>Hidden</strong> to remove items from public view</li>
                  <li>Click <strong>&quot;Edit&quot;</strong> to update title, description, technologies, etc.</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Source Files</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  <li><strong>Projects</strong> — <span className="font-mono text-sm bg-gray-100 px-1 rounded">lib/projectData.ts</span></li>
                  <li><strong>Experience</strong> — <span className="font-mono text-sm bg-gray-100 px-1 rounded">lib/experienceData.ts</span></li>
                  <li><strong>Skills</strong> — <span className="font-mono text-sm bg-gray-100 px-1 rounded">lib/skillCategoryData.ts</span></li>
                </ul>
                <p className="text-gray-600 mt-2 text-sm">
                  To add entirely new items, add them to the source files and click &quot;Sync from Code&quot; in admin.
                </p>
              </div>
            </div>
          </section>

          {/* ===== TIPS ===== */}
          <section id="tips" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips & Troubleshooting</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Large File Uploads</h3>
                <p className="text-gray-700">
                  If you get a 413 error when uploading large files in production, the hosting provider may have a request body size limit. Check your deployment configuration (e.g., Vercel&apos;s 4.5MB limit on serverless functions). Consider using direct Cloudinary uploads for very large files.
                </p>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Gallery Access Codes</h3>
                <p className="text-gray-700">
                  Always share access codes through a separate channel (text, email) from the gallery link for better security. Access codes are stored securely and never exposed in the gallery URL.
                </p>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Proposal Best Practices</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Preview the portal (<strong>&quot;Preview Portal&quot;</strong> button) before sending to clients</li>
                  <li>Set a brand color that matches the client&apos;s brand for a professional touch</li>
                  <li>Use the analytics dashboard to see if clients have viewed your proposal</li>
                  <li>Follow up if a proposal has been &quot;Viewed&quot; but not responded to</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Sync from Code</h3>
                <p className="text-gray-700">
                  The &quot;Sync from Code&quot; button in Blog and Content pages imports data from the TypeScript source files. It preserves any changes you&apos;ve made in admin (featured, hidden, metadata edits). Run it after deploying code changes that add new blog posts or content items.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
