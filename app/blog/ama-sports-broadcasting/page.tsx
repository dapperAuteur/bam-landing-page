'use client';

import React, { useState } from 'react';
import { 
  Mic, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Globe, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Send,
  Radio
} from 'lucide-react';

export default function GuestSpeakerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    expertise: '',
    availability: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/guest-speaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setStatusMessage(data.message);
      } else {
        setStatus('error');
        setStatusMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <header className="relative border-b border-gray-100">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 border border-red-100 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></span>
            Live On Air
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter mb-6 leading-[1.1]">
            Pass the Torch.<br />
            <span className="text-gray-400">Inspire the Next Generation.</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-10">
            The Sports Broadcasting Club at Fishers & Westfield High Schools is looking for industry professionals to share their journey. 
            <strong>35 minutes. Virtual. Massive Impact.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#sign-up" 
              className="bg-black text-white hover:bg-gray-800 font-bold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Join the Roster <ChevronDown size={18} />
            </a>
            <a 
              href="#the-playbook" 
              className="border border-gray-300 text-gray-600 hover:border-black hover:text-black px-8 py-4 rounded-full transition-all flex items-center justify-center bg-white"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Background Grid Pattern - Lighter */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      </header>


      {/* --- THE MISSION (WHY) --- */}
      <section className="py-20 border-b border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Not Just Watching. Producing.</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our students operate at the 5A level. They are filming games, running switchers, and commentating live. They have the technical spark, but they need the career roadmap.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you are a camera operator, producer, on-air talent, or work in a completely different field—your story validates their passion.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
                <Users className="text-gray-400" /> Who You'll Reach
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="text-green-600 shrink-0" size={20} />
                  <span className="text-gray-600">High School Students (Grades 9-12)</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-600 shrink-0" size={20} />
                  <span className="text-gray-600">Aspiring broadcasters, directors, & creatives</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="text-green-600 shrink-0" size={20} />
                  <span className="text-gray-600">Curious minds exploring career paths</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* --- THE PLAYBOOK (LOGISTICS) --- */}
      <section id="the-playbook" className="py-24 border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Playbook</h2>
            <p className="text-gray-500">We respect your time. Here is the low-lift commitment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PlaybookCard 
              icon={<Globe size={32} />}
              title="100% Virtual"
              desc="Join us from your office, home, or the road via Zoom/Teams. No travel required."
            />
            <PlaybookCard 
              icon={<Clock size={32} />}
              title="35 Minutes"
              desc="1:53 PM - 2:28 PM EST. Short, punchy, and high-energy. We handle the moderation."
            />
            <PlaybookCard 
              icon={<Calendar size={32} />}
              title="Monthly Series"
              desc="Events happen monthly. Pick a Monday, Tuesday, Thursday, or Friday that works for you."
            />
          </div>

          {/* Time Slot Detail Box - Kept Dark for Contrast/Importance */}
          <div className="mt-12 bg-black text-white rounded-xl p-6 text-center max-w-2xl mx-auto shadow-xl">
            <h3 className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-xs">The Official Time Slot</h3>
            <div className="text-3xl font-mono text-white mb-2 tracking-widest">
              1:53 PM - 2:28 PM <span className="text-sm text-gray-500 font-sans">EST</span>
            </div>
            <p className="text-gray-400 text-sm">
              Available Days: Mon • Tue • Thu • Fri
            </p>
          </div>
        </div>
      </section>


      {/* --- THE ROSTER (SOCIAL PROOF) --- */}
      <section className="py-20 border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Join The Roster</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Madison Card */}
            <div className="group bg-white border border-gray-200 p-6 rounded-xl hover:border-green-500/50 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold text-xl border border-green-100">
                MM
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Madison Morris</h3>
                <p className="text-green-600 text-sm font-medium mb-1">Photography Intern, Green Bay Packers</p>
                <p className="text-gray-500 text-sm">Shared insights on covering the College Football Playoff and NFL sidelines.</p>
              </div>
            </div>

            {/* Placeholder / You Card */}
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl flex items-center justify-center text-center hover:bg-white hover:border-gray-400 transition-colors cursor-pointer bg-gray-50/50">
              <div>
                <div className="text-gray-400 mb-2">You?</div>
                <h3 className="text-gray-600 font-bold">Your Name Here</h3>
                <p className="text-gray-500 text-sm">Inspire the next class</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- SIGN UP FORM --- */}
      <section id="sign-up" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get on the Schedule</h2>
            <p className="text-gray-500">
              Fill out the form below to express interest. We will follow up to confirm a specific date that fits your calendar.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Interest Received!</h3>
              <p className="text-gray-600">
                {statusMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl space-y-6">
            
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors placeholder-gray-400" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@network.com" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profession / Title</label>
                  <input 
                    type="text" 
                    name="profession"
                    required
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="e.g. Technical Director" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors placeholder-gray-400" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Area of Expertise</label>
                  <input 
                    type="text" 
                    name="expertise"
                    required
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="e.g. Audio Engineering, On-Air" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Availability <span className="text-gray-400 normal-case ml-2">(Mon/Tue/Thu/Fri @ 1:53-2:28 PM)</span>
                </label>
                <textarea 
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  rows={2} 
                  placeholder="I am generally available on Fridays in February. Tuesdays also work..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors placeholder-gray-400"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Introduction / Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  placeholder="Tell us a bit about yourself or what you'd like to share with the students." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors placeholder-gray-400"
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                  {statusMessage}
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-black text-white font-bold text-lg py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : <><Send size={20} /> Send Interest</>}
                </button>
                <p className="text-center text-gray-400 text-sm mt-4">
                  Note: This form expresses interest. We will email you to finalize the booking.
                </p>
              </div>

            </form>
          )}
        </div>
      </section>


      {/* --- FAQ SECTION --- */}
      <section className="py-20 border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FAQItem 
              q="Is this in-person or virtual?" 
              a="Always virtual. We use Zoom or Teams so you can join from anywhere." 
            />
            <FAQItem 
              q="What if I don't work in sports?" 
              a="We welcome all professionals! The skills you use—communication, technology, leadership—are transferable and valuable for our students to hear about." 
            />
            <FAQItem 
              q="Do I need to prepare a presentation?" 
              a="No slides required. This is an AMA (Ask Me Anything) format. We prep the students with questions beforehand, but feel free to share photos if you like." 
            />
            <FAQItem 
              q="Can I invite a colleague?" 
              a="Absolutely. Panels are great. Just mention it in the form notes." 
            />
          </div>
        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-200 text-center bg-white">
        <div className="container mx-auto px-4">
          <p className="text-gray-900 font-bold mb-2">Fishers & Westfield High Schools Broadcast Program</p>
          <p className="text-gray-500 text-sm">Managed by Anthony McDonald</p>
        </div>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function PlaybookCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-gray-200 p-8 rounded-xl hover:border-red-500 transition-colors group shadow-sm hover:shadow-md">
      <div className="text-black mb-6 group-hover:text-red-600 transition-colors">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
        <span className="text-red-500 mt-1"><Radio size={14} /></span>
        {q}
      </h4>
      <p className="text-gray-600 text-sm leading-relaxed pl-6">
        {a}
      </p>
    </div>
  );
}