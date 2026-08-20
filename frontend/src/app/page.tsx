import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-teal-700">Illaram</span>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-600 hover:text-teal-700">Login</Link>
            <Link href="/register" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Register</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Find a partner, not just a profile.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A modern Tamil matrimony platform where trust, culture, and meaningful connections come first.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-medium">
            Get Started
          </Link>
          <Link href="/profiles" className="bg-white text-teal-700 border border-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 font-medium">
            Browse Profiles
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-20">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl mb-2">✅</div>
          <h3 className="font-semibold text-gray-800">100% Selfie Verified</h3>
          <p className="text-sm text-gray-600 mt-1">Every profile is verified to ensure authenticity.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl mb-2">🔒</div>
          <h3 className="font-semibold text-gray-800">Privacy First</h3>
          <p className="text-sm text-gray-600 mt-1">Photos remain blurred until mutual interest is established.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl mb-2">🌏</div>
          <h3 className="font-semibold text-gray-800">Built for Tamils Worldwide</h3>
          <p className="text-sm text-gray-600 mt-1">Cultural values with a modern, global mindset.</p>
        </div>
      </section>
    </div>
  );
}