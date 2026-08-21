import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-cream font-body text-ink overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="blob blob1 w-[480px] h-[480px] -top-32 -left-32" />
        <div className="blob blob2 w-[520px] h-[520px] top-10 -right-40" />
        <div className="blob blob3 w-[380px] h-[380px] bottom-0 left-1/3" />

        <div className="max-w-5xl mx-auto px-6 py-24 text-center relative z-10">
          <span className="inline-block text-xs tracking-[0.2em] uppercase glass rounded-full px-5 py-2 mb-8 text-ink/70">
            வணக்கம் · Vanakkam
          </span>
          <h1 className="font-display font-medium text-5xl md:text-7xl leading-[1.05] mb-6">
            Two families.<br /><span className="grad-text italic">One thread.</span>
          </h1>
          <p className="max-w-lg mx-auto text-muted text-lg mb-12">
            Illaram matches on what actually holds a Tamil marriage together — language, horoscope, values and family.
          </p>

          <div className="flex items-center justify-center gap-6 mb-14">
            <div className="w-20 h-20 rounded-full glass glow-peach flex items-center justify-center text-3xl">👩🏽</div>
            <svg viewBox="0 0 100 30" className="w-20 h-8 overflow-visible">
              <defs>
                <linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF8B6B" />
                  <stop offset="100%" stopColor="#5B8DEF" />
                </linearGradient>
              </defs>
              <path d="M0 15 Q 50 -5 100 15" fill="none" stroke="url(#threadGrad)" strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
              </path>
            </svg>
            <div className="w-20 h-20 rounded-full glass glow-blue flex items-center justify-center text-3xl">👨🏽</div>
          </div>

          <Link href="/register" className="inline-block bg-gradient-to-r from-peach to-blue text-white px-10 py-4 rounded-full font-medium glow-peach hover:scale-105 transition-transform">
            Find Your Match — Free
          </Link>
        </div>
      </section>

      {/* STANDALONE SEARCH */}
      <section className="relative bg-cream py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-black/5 shadow-[0_20px_60px_-15px_rgba(91,141,239,0.25)] p-6 md:p-8">
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-6 text-center md:text-left">Find your match</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-4 items-end">
              <div className="border-b-2 border-transparent focus-within:border-peach transition pb-1">
                <label className="block text-[10px] uppercase tracking-wide text-muted mb-1">Looking for</label>
                <select className="w-full bg-transparent text-base font-medium focus:outline-none py-1">
                  <option>Bride</option>
                  <option>Groom</option>
                </select>
              </div>
              <div className="border-b-2 border-transparent focus-within:border-peach transition pb-1">
                <label className="block text-[10px] uppercase tracking-wide text-muted mb-1">Age</label>
                <select className="w-full bg-transparent text-base font-medium focus:outline-none py-1">
                  <option>25 – 32</option>
                </select>
              </div>
              <div className="border-b-2 border-transparent focus-within:border-blue transition pb-1">
                <label className="block text-[10px] uppercase tracking-wide text-muted mb-1">Mother tongue</label>
                <select className="w-full bg-transparent text-base font-medium focus:outline-none py-1">
                  <option>Tamil</option>
                  <option>Telugu</option>
                </select>
              </div>
              <div className="border-b-2 border-transparent focus-within:border-blue transition pb-1">
                <label className="block text-[10px] uppercase tracking-wide text-muted mb-1">Location</label>
                <select className="w-full bg-transparent text-base font-medium focus:outline-none py-1">
                  <option>Chennai</option>
                  <option>Overseas</option>
                </select>
              </div>
              <button className="bg-gradient-to-r from-peach to-blue text-white text-sm font-medium px-6 py-3.5 rounded-xl hover:opacity-90 transition whitespace-nowrap w-full lg:w-auto">
                Explore matches
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PULSE / TRUST STRIP */}
      <section className="relative pt-4 pb-16 overflow-hidden">
        <div className="blob blob2 w-[300px] h-[300px] -top-20 right-0 opacity-20" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <p className="font-display text-3xl font-medium grad-text">128</p>
            <p className="text-sm text-muted mt-1">interests sent today</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <p className="font-display text-3xl font-medium grad-text">3,400+</p>
            <p className="text-sm text-muted mt-1">verified profiles this month</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <p className="font-display text-3xl font-medium grad-text">47</p>
            <p className="text-sm text-muted mt-1">families matched this week</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-14">How Illaram works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass rounded-3xl p-8 hover:glow-peach transition">
            <span className="font-display text-5xl grad-text">01</span>
            <h3 className="text-xl font-semibold mt-4">Create your profile</h3>
            <p className="text-muted mt-2">Tell us about yourself and your family — in your own words.</p>
          </div>
          <div className="glass rounded-3xl p-8 hover:glow-blue transition">
            <span className="font-display text-5xl grad-text">02</span>
            <h3 className="text-xl font-semibold mt-4">Discover compatible people</h3>
            <p className="text-muted mt-2">Match on horoscope, values, lifestyle and preferences.</p>
          </div>
          <div className="glass rounded-3xl p-8 hover:glow-peach transition">
            <span className="font-display text-5xl grad-text">03</span>
            <h3 className="text-xl font-semibold mt-4">Connect with confidence</h3>
            <p className="text-muted mt-2">Express interest, connect mutually, involve family when ready.</p>
          </div>
        </div>
      </section>

      {/* COMPATIBILITY */}
      <section className="relative py-20 overflow-hidden">
        <div className="blob blob1 w-[350px] h-[350px] top-0 -left-20 opacity-25" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-14">Compatibility goes deeper</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-peach">Culture</h3>
              <ul className="space-y-2 text-sm text-ink/80">
                <li>Tamil language</li><li>Festivals</li><li>Native place</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-blue">Traditions</h3>
              <ul className="space-y-2 text-sm text-ink/80">
                <li>Rasi &amp; Nakshatram</li><li>Gothram</li><li>Subcaste</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-peach">Values</h3>
              <ul className="space-y-2 text-sm text-ink/80">
                <li>Family</li><li>Spirituality</li><li>Expectations</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-blue">Future</h3>
              <ul className="space-y-2 text-sm text-ink/80">
                <li>Career</li><li>Location</li><li>Family involvement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE PREVIEW */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-14">A profile that feels real</h2>
        <div className="glass glow-peach rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-br from-peach-light to-blue-light h-40 flex items-center justify-center text-5xl">👩🏽</div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-2xl font-bold">Ananya, 28</h3>
              <span className="bg-gradient-to-r from-peach to-blue text-white px-3 py-1 rounded-full text-xs">✓ Verified</span>
            </div>
            <p className="text-muted mb-4">Chennai · Software Engineer</p>
            <p className="italic text-ink/70 mb-6">"Family-oriented, curious about the world and happiest around people I love."</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-ink/80">
              <span>Mother tongue: Tamil</span>
              <span>Rasi: Available</span>
              <span>Family: Important</span>
              <span>Location: Chennai</span>
            </div>
            <button className="mt-8 w-full bg-gradient-to-r from-peach to-blue text-white py-3 rounded-xl font-medium hover:opacity-90 transition">View Profile</button>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="relative py-20 overflow-hidden">
        <div className="blob blob2 w-[400px] h-[400px] -bottom-32 right-0 opacity-25" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Your story. Your privacy.</h2>
            <p className="text-muted mb-6">Your photos don't have to be public. You control who you connect with, and when.</p>
            <ul className="space-y-2 text-sm text-ink/80">
              <li>🔒 Private photo</li>
              <li>👁️ Visible after mutual interest</li>
              <li>🎛️ You decide</li>
            </ul>
          </div>
          <div className="glass rounded-3xl p-8 flex flex-col items-center">
            <div className="w-40 h-40 bg-gradient-to-br from-peach-light to-blue-light rounded-2xl mb-4 blur-sm flex items-center justify-center text-4xl">🔒</div>
            <p className="font-medium">Private photo</p>
            <p className="text-sm text-muted">Visible after mutual interest</p>
          </div>
        </div>
      </section>

      {/* MATCH */}
      <section className="relative max-w-4xl mx-auto px-6 py-24 text-center overflow-hidden">
        <div className="blob blob3 w-[350px] h-[350px] top-0 left-1/2 -translate-x-1/2 opacity-30" />
        <div className="relative z-10">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="w-24 h-24 glass glow-peach rounded-full flex items-center justify-center text-4xl">👩🏽</div>
            <span className="text-3xl">💫</span>
            <div className="w-24 h-24 glass glow-blue rounded-full flex items-center justify-center text-4xl">👨🏽</div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl grad-text mb-2">The thread is tied.</h2>
          <p className="text-muted mb-8">Both of you are interested in getting to know each other.</p>
          <button className="bg-gradient-to-r from-peach to-blue text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform">Start a conversation</button>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-display italic text-2xl md:text-3xl leading-relaxed mb-6">
          "We connected through shared values, and discovered our families had more in common than we expected."
        </p>
        <p className="text-sm grad-text font-medium">Priya &amp; Arjun — Chennai</p>
      </section>

      {/* PREMIUM */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-deep to-ink text-white">
        <div className="blob blob1 w-[400px] h-[400px] -top-32 left-0 opacity-30" />
        <div className="blob blob2 w-[350px] h-[350px] bottom-0 right-0 opacity-30" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl mb-4">When you're ready to go further.</h2>
          <p className="text-white/70 mb-10">Unlimited interests · Advanced filters · Enhanced discovery · Additional privacy controls</p>
          <Link href="/premium" className="inline-block bg-gradient-to-r from-peach to-peach-light text-ink px-10 py-4 rounded-full font-medium glow-peach hover:scale-105 transition-transform">Explore Premium</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is Illaram only for Tamil people?', a: 'Designed primarily for Tamils worldwide, but open to anyone who values Tamil culture and tradition.' },
            { q: 'Does Illaram support horoscope matching?', a: 'Yes — Rasi, Nakshatram, Gothram and subcaste filters, with fuller compatibility scoring on the roadmap.' },
            { q: 'Are my photos private?', a: 'Blurred by default until mutual interest is established.' },
            { q: 'Is Illaram free?', a: 'Basic features are free. Premium unlocks unlimited interests and advanced filters.' },
          ].map((item) => (
            <details key={item.q} className="glass rounded-2xl p-5">
              <summary className="font-medium cursor-pointer">{item.q}</summary>
              <p className="text-sm text-muted mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 text-center overflow-hidden">
        <div className="blob blob1 w-[450px] h-[450px] top-0 left-1/4 opacity-30" />
        <div className="blob blob2 w-[450px] h-[450px] bottom-0 right-1/4 opacity-30" />
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-8">Maybe your person<br /><span className="grad-text italic">is closer than you think.</span></h2>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-gradient-to-r from-peach to-blue text-white px-8 py-3.5 rounded-full font-medium glow-peach hover:scale-105 transition-transform">Create your profile</Link>
            <Link href="/profiles" className="glass px-8 py-3.5 rounded-full font-medium hover:glow-blue transition">Explore Illaram</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-white/60 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
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
        <p className="text-center text-[11px] mt-10 text-white/30">© 2026 Illaram. All rights reserved.</p>
      </footer>
    </div>
  );
}