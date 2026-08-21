import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-ivory min-h-screen font-body text-charcoal">
      {/* Structured Data: Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Illaram",
            url: "https://www.illaram.com",
            logo: "https://www.illaram.com/logo.png",
            sameAs: [
              "https://www.facebook.com/illaram",
              "https://www.instagram.com/illaram",
              "https://www.linkedin.com/company/illaram",
            ],
          }),
        }}
      />
      {/* Structured Data: WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Illaram",
            url: "https://www.illaram.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.illaram.com/profiles?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* HERO — the thread */}
      <section className="relative overflow-hidden bg-white">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-gold to-kumkum" />

        <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="kolam" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#0F5C5E" strokeWidth="0.5" />
                <circle cx="30" cy="30" r="10" fill="none" stroke="#0F5C5E" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#kolam)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-14 pb-28 md:pt-20 md:pb-36 relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs tracking-[0.2em] uppercase font-medium text-kumkum bg-kumkum/10 px-4 py-1.5 rounded-full mb-6">
              வணக்கம் · Vanakkam
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-medium leading-[1.05] text-charcoal">
              Two families.<br />One thread.
            </h1>
            <p className="mt-6 text-lg text-muted">
              Illaram matches on what actually holds a Tamil marriage together — language, horoscope, values and family — not just a swipe.
            </p>
          </div>

          {/* THE THREAD: two profiles tied by a knot */}
          <div className="relative max-w-3xl mx-auto grid grid-cols-3 items-center gap-2">
            <div className="bg-white rounded-2xl shadow-card p-5 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-soft flex items-center justify-center text-3xl mb-3">👩🏽</div>
              <p className="font-semibold text-charcoal">Ananya, 28</p>
              <p className="text-xs text-muted">Chennai · Software Engineer</p>
              <span className="mt-2 inline-block text-[11px] bg-primary-soft text-primary px-2 py-0.5 rounded-full">✓ ID Verified</span>
            </div>

            <div className="relative h-24 flex items-center justify-center">
              <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                <path d="M0 15 Q 100 15 100 30 Q 100 45 200 45" fill="none" stroke="#E8A33D" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                </path>
              </svg>
              <div className="absolute w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white text-sm shadow-card">🪢</div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-5 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-soft flex items-center justify-center text-3xl mb-3">👨🏽</div>
              <p className="font-semibold text-charcoal">Karthik, 30</p>
              <p className="text-xs text-muted">Coimbatore · Product Manager</p>
              <span className="mt-2 inline-block text-[11px] bg-primary-soft text-primary px-2 py-0.5 rounded-full">✓ ID Verified</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Link href="/register" className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary-dark transition shadow-card hover:shadow-card-hover">
              Find Your Match — Free
            </Link>
            <Link href="#how-it-works" className="bg-white text-primary border border-primary/20 px-8 py-4 rounded-full font-medium hover:bg-primary-soft transition">
              How Illaram Works
            </Link>
          </div>
        </div>

        {/* FLOATING SEARCH — overlaps hero/next section boundary */}
        <div className="absolute left-0 right-0 -bottom-10 md:-bottom-8 px-4 z-20">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-white shadow-card-hover rounded-2xl md:rounded-full px-4 py-3 md:px-3">
            <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 md:gap-1 items-center">
              <div className="flex items-center gap-2 px-3 py-2 md:border-r border-gray-100">
                <span className="text-lg">💍</span>
                <select className="w-full bg-transparent text-sm font-medium focus:outline-none">
                  <option>Bride</option>
                  <option>Groom</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 md:border-r border-gray-100">
                <span className="text-lg">🎂</span>
                <select className="w-full bg-transparent text-sm font-medium focus:outline-none">
                  <option>25 – 32</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 md:border-r border-gray-100">
                <span className="text-lg">🗣️</span>
                <select className="w-full bg-transparent text-sm font-medium focus:outline-none">
                  <option>Tamil</option>
                  <option>Telugu</option>
                  <option>Kannada</option>
                  <option>Malayalam</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-lg">📍</span>
                <select className="w-full bg-transparent text-sm font-medium focus:outline-none">
                  <option>Chennai</option>
                  <option>Coimbatore</option>
                  <option>Bengaluru</option>
                  <option>Overseas</option>
                </select>
              </div>
              <button className="bg-kumkum text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-kumkum/90 transition whitespace-nowrap">
                Explore matches
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-muted mt-3">
            Community, Rasi & Nakshatram filters available inside — private by default.
          </p>
        </div>
      </section>

      {/* LIVE PULSE STRIP */}
      <section className="bg-charcoal text-white pt-20 pb-10 md:pt-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { n: '128', label: 'interests sent today', pulse: true },
            { n: '3,400+', label: 'verified profiles this month' },
            { n: '47', label: 'families matched this week' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                {s.pulse && <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kumkum opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-kumkum"></span>
                </span>}
                <span className="font-display text-3xl font-medium">{s.n}</span>
              </div>
              <span className="text-sm text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-12 text-charcoal">How Illaram works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create your profile', desc: 'Tell us about yourself and your family — in your own words.' },
            { step: '02', title: 'Discover compatible people', desc: 'Match on horoscope, values, lifestyle and preferences.' },
            { step: '03', title: 'Connect with confidence', desc: 'Express interest, connect mutually, involve family when ready.' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition">
              <span className="font-display text-5xl font-medium text-primary-soft">{item.step}</span>
              <h3 className="text-xl font-semibold mt-4 text-charcoal">{item.title}</h3>
              <p className="text-muted mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPATIBILITY GOES DEEPER */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-12 text-charcoal">Compatibility goes deeper</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Culture', items: ['Tamil language', 'Festivals', 'Native place'] },
              { title: 'Traditions', items: ['Rasi & Nakshatram', 'Gothram', 'Subcaste'] },
              { title: 'Values', items: ['Family', 'Spirituality', 'Expectations'] },
              { title: 'Future', items: ['Career', 'Location', 'Family involvement'] },
            ].map((card) => (
              <div key={card.title} className="bg-ivory p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-4 text-primary">{card.title}</h3>
                <ul className="space-y-2 text-sm text-charcoal">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFILE PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-12 text-charcoal">A profile that feels real</h2>
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="bg-gradient-to-br from-primary-soft to-gold/10 h-40 flex items-center justify-center text-5xl">👩🏽</div>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-charcoal">Ananya, 28</h3>
                <p className="text-muted">Chennai · Software Engineer</p>
              </div>
              <span className="bg-primary-soft text-primary px-3 py-1 rounded-full text-sm">✓ Verified</span>
            </div>
            <p className="mt-4 text-gray-600 italic">"Family-oriented, curious about the world and happiest around people I love."</p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Mother tongue</span><span className="font-medium">Tamil</span></div>
              <div className="flex justify-between"><span className="text-muted">Rasi / Nakshatram</span><span className="font-medium">Available</span></div>
              <div className="flex justify-between"><span className="text-muted">Family involvement</span><span className="font-medium">Important</span></div>
              <div className="flex justify-between"><span className="text-muted">Location</span><span className="font-medium">Chennai</span></div>
            </div>
            <button className="mt-8 w-full bg-primary text-white py-3 rounded-xl hover:bg-primary-dark font-medium">View Profile</button>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="bg-primary-soft/40 py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal mb-4">Your story. Your privacy.</h2>
            <p className="text-muted mb-6">Your photos don't have to be public. You control who you connect with, and when.</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">🔒 <span>Private photo</span></li>
              <li className="flex items-center gap-2">👁️ <span>Visible after mutual interest</span></li>
              <li className="flex items-center gap-2">🎛️ <span>You decide</span></li>
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-card flex flex-col items-center">
            <div className="w-40 h-40 bg-gray-200 rounded-2xl mb-4 blur-sm flex items-center justify-center text-4xl">🔒</div>
            <p className="font-medium text-charcoal">Private photo</p>
            <p className="text-sm text-muted">Visible after mutual interest</p>
          </div>
        </div>
      </section>

      {/* FAMILYLINK */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">Family can be part of the journey</h2>
          <p className="text-muted mt-2">Invite a parent or trusted family member when you're ready.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-card text-center w-40">
            <div className="text-4xl mb-2">👩🏽</div>
            <p className="font-medium">You</p>
          </div>
          <div className="text-3xl text-gold">→</div>
          <div className="bg-white rounded-2xl p-6 shadow-card text-center w-40 border-2 border-gold">
            <div className="text-4xl mb-2">🤝</div>
            <p className="font-medium">FamilyLink</p>
            <p className="text-xs text-muted">on your terms</p>
          </div>
          <div className="text-3xl text-gold">→</div>
          <div className="bg-white rounded-2xl p-6 shadow-card text-center w-40">
            <div className="text-4xl mb-2">👨‍👩‍👧</div>
            <p className="font-medium">Parent / Family</p>
          </div>
        </div>
      </section>

      {/* TRUST & VERIFICATION */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4 text-charcoal">Know more. Trust better.</h2>
          <p className="text-muted max-w-xl mx-auto mb-8">Verification helps you make more informed decisions. It doesn't guarantee anyone's character or intentions.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Phone verified', 'Selfie verified', 'Government ID verified', 'Optional background check'].map((item) => (
              <span key={item} className="bg-primary-soft text-primary px-5 py-2 rounded-full text-sm font-medium">✓ {item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* MATCH — thread motif returns */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="relative flex justify-center items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-primary-soft rounded-full flex items-center justify-center text-4xl">👩🏽</div>
          <svg viewBox="0 0 80 20" className="w-16 h-5">
            <path d="M0 10 Q 40 -5 80 10" fill="none" stroke="#E8A33D" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />
          </svg>
          <div className="w-24 h-24 bg-primary-soft rounded-full flex items-center justify-center text-4xl">👨🏽</div>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">The thread is tied.</h2>
        <p className="text-muted mt-2">Both of you are interested in getting to know each other.</p>
        <button className="mt-6 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark font-medium">Start a conversation</button>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-12 text-charcoal">Real people. Real connections.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-ivory rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-soft"></div>
                  <div>
                    <p className="font-medium text-charcoal">Name & Name</p>
                    <p className="text-sm text-muted">Location</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">"We connected through shared values and discovered that our families had more in common than we expected."</p>
                <button className="mt-4 text-primary font-medium text-sm">Read their story</button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-4">Stories will appear here once real members share them.</p>
        </div>
      </section>

      {/* DIASPORA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-12 text-charcoal">Tamil, wherever life takes you.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['🇮🇳 India', '🇸🇬 Singapore', '🇲🇾 Malaysia', '🇬🇧 UK', '🇺🇸 USA', '🇨🇦 Canada', '🇦🇪 UAE', '🇦🇺 Australia'].map((loc) => (
            <div key={loc} className="bg-white rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition">
              <span className="text-3xl">{loc.split(' ')[0]}</span>
              <p className="mt-2 font-medium text-charcoal">{loc.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY ILLARAM */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-3xl shadow-card">
          <h3 className="text-xl font-semibold mb-4 text-charcoal">Traditional matrimony sites</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>Large profile databases</li>
            <li>Lots of filters</li>
            <li>Family participation</li>
            <li>But often overwhelming</li>
          </ul>
        </div>
        <div className="bg-maroon p-8 rounded-3xl shadow-card text-white">
          <h3 className="text-xl font-semibold mb-4">Illaram</h3>
          <ul className="space-y-2 text-sm">
            <li>Meaningful profiles</li>
            <li>Privacy-first</li>
            <li>Traditional filters + modern compatibility</li>
            <li>Family involvement, on your terms</li>
            <li>Government ID verification</li>
            <li>Premium experience</li>
          </ul>
        </div>
      </section>

      {/* PREMIUM */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4 text-charcoal">When you're ready to go further.</h2>
          <p className="text-muted mb-8">Unlimited interests · Advanced filters · Enhanced discovery · Additional privacy controls</p>
          <Link href="/premium" className="bg-kumkum text-white px-8 py-3 rounded-full font-medium hover:bg-kumkum/90 transition">Explore Premium</Link>
        </div>
      </section>

      {/* Structured Data: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is Illaram only for Tamil people?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Illaram is designed primarily for Tamils worldwide, but everyone who values Tamil culture and traditions is welcome.",
                },
              },
              {
                "@type": "Question",
                name: "Can Tamils living outside India use Illaram?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, Illaram is built for the global Tamil diaspora, including Singapore, Malaysia, UK, USA, Canada, UAE, and Australia.",
                },
              },
              {
                "@type": "Question",
                name: "Does Illaram support traditional filters?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can filter by Rasi, Nakshatram, Gothram, subcaste, and more. Full horoscope compatibility scoring is on the roadmap.",
                },
              },
              {
                "@type": "Question",
                name: "How does profile verification work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Users can verify their phone number, upload a selfie, and optionally verify with a government ID. We show verification badges to increase trust.",
                },
              },
              {
                "@type": "Question",
                name: "Are my photos private?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "By default, photos are blurred to other users until mutual interest is established. You can also request photo access individually.",
                },
              },
              {
                "@type": "Question",
                name: "Can my parents participate?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, through FamilyLink you can invite a parent or trusted family member to help manage your profile, with your approval.",
                },
              },
              {
                "@type": "Question",
                name: "How does mutual interest work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "When you send an interest and the other person also accepts, it becomes a mutual match, unlocking private photos and chat.",
                },
              },
              {
                "@type": "Question",
                name: "Is Illaram free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Basic features are free. Premium unlocks unlimited interests, advanced filters, and additional privacy controls.",
                },
              },
            ],
          }),
        }}
      />

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-8 text-charcoal">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is Illaram only for Tamil people?', a: 'Illaram is designed primarily for Tamils worldwide, but everyone who values Tamil culture and traditions is welcome.' },
            { q: 'Can Tamils living outside India use Illaram?', a: 'Yes, Illaram is built for the global Tamil diaspora, including Singapore, Malaysia, UK, USA, Canada, UAE, and Australia.' },
            { q: 'Does Illaram support traditional filters?', a: 'Yes. You can filter by Rasi, Nakshatram, Gothram, subcaste, and more. Full horoscope compatibility scoring is on the roadmap.' },
            { q: 'How does profile verification work?', a: 'Users can verify their phone number, upload a selfie, and optionally verify with a government ID. We show verification badges to increase trust.' },
            { q: 'Are my photos private?', a: 'By default, photos are blurred to other users until mutual interest is established. You can also request photo access individually.' },
            { q: 'Can my parents participate?', a: 'Yes, through FamilyLink you can invite a parent or trusted family member to help manage your profile, with your approval.' },
            { q: 'How does mutual interest work?', a: 'When you send an interest and the other person also accepts, it becomes a mutual match, unlocking private photos and chat.' },
            { q: 'Is Illaram free?', a: 'Basic features are free. Premium unlocks unlimited interests, advanced filters, and additional privacy controls.' },
          ].map((item) => (
            <details key={item.q} className="bg-white rounded-2xl shadow-card p-4">
              <summary className="font-medium text-charcoal cursor-pointer">{item.q}</summary>
              <p className="text-sm text-muted mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary py-20 text-center">
        <h2 className="font-display text-4xl font-medium text-white mb-4">Maybe your person is closer than you think.</h2>
        <p className="text-primary-soft mb-8">Start your Illaram journey today.</p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-primary-soft">Create your profile</Link>
          <Link href="/profiles" className="bg-kumkum text-white px-8 py-3 rounded-full font-medium hover:bg-kumkum/90">Explore Illaram</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white mb-3">Illaram</h4>
            <ul className="space-y-1 text-sm">
              <li>About</li><li>How it works</li><li>Safety</li><li>Privacy</li><li>Terms</li><li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Discover</h4>
            <ul className="space-y-1 text-sm">
              <li>Tamil Matrimony</li><li>Tamil Brides</li><li>Tamil Grooms</li><li>Chennai Matrimony</li><li>Singapore Tamil Matrimony</li><li>UK Tamil Matrimony</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Resources</h4>
            <ul className="space-y-1 text-sm">
              <li>Matrimony Guide</li><li>Traditional Filters Guide</li><li>Tamil Culture</li><li>Safety Guide</li><li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Follow</h4>
            <ul className="space-y-1 text-sm">
              <li>Instagram</li><li>Facebook</li><li>LinkedIn</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8">© 2026 Illaram. All rights reserved.</div>
      </footer>
    </div>
  );
}