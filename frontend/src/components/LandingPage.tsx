import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-cream min-h-screen font-body text-ink overflow-x-hidden">
      {/* HERO SECTION â€” split editorial composition */}
      <section className="relative bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12">
          {/* Left column: headline + CTA */}
          <div className="lg:w-1/2 space-y-6 order-1">
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-peach bg-peach-light/20 px-4 py-1.5 rounded-full">
              à®µà®£à®•à¯à®•à®®à¯ Â· VANAKKAM
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-ink">
              Two families.<br />
              <span className="text-peach">One thread.</span>
            </h1>
            <p className="text-lg text-muted max-w-lg">
              Illaram matches on what actually holds a Tamil marriage together â€” language, horoscope, values and family.
            </p>
            <Link
              href="/register"
              className="inline-block bg-peach text-white px-8 py-4 rounded-full font-medium hover:bg-peach/90 transition shadow-card"
            >
              Find Your Match â€” Free
            </Link>
          </div>

          {/* Right column: couple photograph */}
          <div className="lg:w-1/2 order-2 relative">
            <div className="relative h-[400px] lg:h-[600px] w-full overflow-hidden">
              <Image
                src="/images/illaram-hero-couple.jpg"
                alt="Indian couple walking hand in hand on a beach"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_30%]"
              />
              {/* Subtle gradient blend from ivory into the photo */}
              <div className="absolute inset-0 bg-gradient-to-l from-cream via-cream/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: 'âœ…', title: 'Verified profiles', desc: 'Selfie & ID checks' },
            { icon: 'ðŸ”’', title: 'Privacy-first photos', desc: 'Blur until mutual interest' },
            { icon: 'â¤ï¸', title: 'Meaningful connections', desc: 'Compatibility-based' },
            { icon: 'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§', title: 'Family-friendly', desc: 'On your terms' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12 text-ink">How Illaram works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create your profile', desc: 'Tell us what makes you, you.' },
            { step: '02', title: 'Discover compatible people', desc: 'Explore based on values, lifestyle, culture and preferences.' },
            { step: '03', title: 'Connect with confidence', desc: 'Express interest, connect mutually, and start a meaningful conversation.' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-3xl p-8 shadow-card">
              <span className="font-display text-5xl text-peach-light">{item.step}</span>
              <h3 className="text-xl font-semibold mt-4 text-ink">{item.title}</h3>
              <p className="text-muted mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPATIBILITY GOES DEEPER */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-12 text-ink">Compatibility goes deeper</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Culture', items: ['Tamil language', 'Festivals', 'Traditions'] },
              { title: 'Lifestyle', items: ['Food', 'Travel', 'Habits', 'Interests'] },
              { title: 'Values', items: ['Family', 'Spirituality', 'Relationship expectations'] },
              { title: 'Future', items: ['Career', 'Location', 'Family involvement', 'Partner expectations'] },
            ].map((card) => (
              <div key={card.title} className="bg-cream p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-4 text-peach">{card.title}</h3>
                <ul className="space-y-2 text-sm text-ink/80">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue"></span>
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
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12 text-ink">A profile that feels real</h2>
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="bg-gradient-to-br from-peach-light to-blue-light h-40 flex items-center justify-center text-5xl">ðŸ‘©ðŸ½</div>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-ink">Ananya, 28</h3>
                <p className="text-muted">Chennai Â· Software Engineer</p>
              </div>
              <span className="bg-blue text-white px-3 py-1 rounded-full text-sm">âœ“ Verified</span>
            </div>
            <p className="mt-4 text-gray-600 italic">"Family-oriented, curious about the world and happiest around people I love."</p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Mother tongue</span><span className="font-medium">Tamil</span></div>
              <div className="flex justify-between"><span className="text-muted">Rasi / Nakshatram</span><span className="font-medium">Available</span></div>
              <div className="flex justify-between"><span className="text-muted">Family involvement</span><span className="font-medium">Important</span></div>
              <div className="flex justify-between"><span className="text-muted">Location</span><span className="font-medium">Chennai</span></div>
            </div>
            <button className="mt-8 w-full bg-peach text-white py-3 rounded-xl font-medium">View Profile</button>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="bg-primary-soft/40 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">Your story. Your privacy.</h2>
            <p className="text-muted mb-6">Your photos don't have to be public. You control who you connect with, and when.</p>
            <ul className="space-y-2 text-sm text-ink/80">
              <li className="flex items-center gap-2">ðŸ”’ <span>Private photo</span></li>
              <li className="flex items-center gap-2">ðŸ‘ï¸ <span>Visible after mutual interest</span></li>
              <li className="flex items-center gap-2">ðŸŽ›ï¸ <span>You decide</span></li>
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-card flex flex-col items-center">
            <div className="w-40 h-40 bg-gray-200 rounded-2xl mb-4 blur-sm flex items-center justify-center text-4xl">ðŸ”’</div>
            <p className="font-medium text-ink">Private photo</p>
            <p className="text-sm text-muted">Visible after mutual interest</p>
          </div>
        </div>
      </section>

      {/* FAMILYLINK */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-ink">Family can be part of the journey</h2>
          <p className="text-muted mt-2">Invite a parent or trusted family member when you're ready.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-card text-center w-40">
            <div className="text-4xl mb-2">ðŸ‘©ðŸ½</div>
            <p className="font-medium">You</p>
          </div>
          <div className="text-3xl text-blue">â†’</div>
          <div className="bg-white rounded-2xl p-6 shadow-card text-center w-40 border-2 border-peach">
            <div className="text-4xl mb-2">ðŸ¤</div>
            <p className="font-medium">FamilyLink</p>
            <p className="text-xs text-muted">on your terms</p>
          </div>
          <div className="text-3xl text-blue">â†’</div>
          <div className="bg-white rounded-2xl p-6 shadow-card text-center w-40">
            <div className="text-4xl mb-2">ðŸ‘¨â€ðŸ‘©â€ðŸ‘§</div>
            <p className="font-medium">Parent / Family</p>
          </div>
        </div>
      </section>

      {/* PREMIUM */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">When you're ready to go further.</h2>
          <p className="text-muted mb-8">Unlimited interests Â· Advanced filters Â· Enhanced discovery Â· Additional privacy controls</p>
          <Link href="/premium" className="bg-peach text-white px-8 py-3 rounded-full font-medium">Explore Premium</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-8 text-ink">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is Illaram only for Tamil people?', a: 'Designed primarily for Tamils worldwide, but open to anyone who values Tamil culture and tradition.' },
            { q: 'Does Illaram support horoscope matching?', a: 'Yes â€” Rasi, Nakshatram, Gothram and subcaste filters, with fuller compatibility scoring on the roadmap.' },
            { q: 'Are my photos private?', a: 'Blurred by default until mutual interest is established.' },
            { q: 'Is Illaram free?', a: 'Basic features are free. Premium unlocks unlimited interests and advanced filters.' },
          ].map((item) => (
            <details key={item.q} className="bg-white rounded-2xl shadow-card p-5">
              <summary className="font-medium cursor-pointer text-ink">{item.q}</summary>
              <p className="text-sm text-muted mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-white/60 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="text-white font-display italic text-lg mb-3">Illaram</p>
            <ul className="space-y-1 text-xs"><li>About</li><li>Safety</li><li>Privacy</li><li>Terms</li></ul>
          </div>
          <div>
            <p className="text-xs tracking-wide uppercase text-peach mb-3">Discover</p>
            <ul className="space-y-1 text-xs"><li>Tamil Matrimony</li><li>Chennai</li><li>Overseas</li></ul>
          </div>
          <div>
            <p className="text-xs tracking-wide uppercase text-blue mb-3">Resources</p>
            <ul className="space-y-1 text-xs"><li>Guide</li><li>FAQ</li></ul>
          </div>
          <div>
            <p className="text-xs tracking-wide uppercase text-peach mb-3">Follow</p>
            <ul className="space-y-1 text-xs"><li>Instagram</li><li>LinkedIn</li></ul>
          </div>
        </div>
        <p className="text-center text-[11px] mt-10 text-white/30">Â© 2026 Illaram. All rights reserved.</p>
      </footer>
    </div>
  );
}