import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Academy() {
  const freeCourses = [
    {
      id: 1,
      title: 'Pi Investment 101',
      description: 'Learn the fundamentals of investing with Pi Network cryptocurrency',
      duration: '2 hours',
      lessons: 8,
      level: 'Beginner',
      icon: '📚',
      category: 'Investment'
    },
    {
      id: 2,
      title: 'Real Estate with Crypto',
      description: 'How to purchase property using cryptocurrency',
      duration: '1.5 hours',
      lessons: 6,
      level: 'Beginner',
      icon: '🏠',
      category: 'Real Estate'
    },
    {
      id: 3,
      title: 'Luxury Travel Planning',
      description: 'Master the art of planning exclusive travel experiences',
      duration: '1 hour',
      lessons: 5,
      level: 'Beginner',
      icon: '✈️',
      category: 'Lifestyle'
    },
    {
      id: 4,
      title: 'B2B Trading Strategies',
      description: 'Essential strategies for business-to-business trading',
      duration: '2.5 hours',
      lessons: 10,
      level: 'Intermediate',
      icon: '🤝',
      category: 'Business'
    }
  ];

  const premiumCourses = [
    {
      id: 5,
      title: 'Advanced Pi Investment Strategies',
      description: 'Deep dive into sophisticated investment techniques',
      duration: '5 hours',
      lessons: 15,
      level: 'Advanced',
      price: 50,
      icon: '💎',
      category: 'Investment'
    },
    {
      id: 6,
      title: 'International Real Estate Mastery',
      description: 'Navigate global property markets with confidence',
      duration: '8 hours',
      lessons: 20,
      level: 'Advanced',
      price: 100,
      icon: '🌍',
      category: 'Real Estate'
    },
    {
      id: 7,
      title: 'Elite Business Networking',
      description: 'Build powerful connections in high-value circles',
      duration: '4 hours',
      lessons: 12,
      level: 'Intermediate',
      price: 75,
      icon: '🎯',
      category: 'Business'
    },
    {
      id: 8,
      title: 'Wealth Management with Pi',
      description: 'Comprehensive wealth management strategies',
      duration: '10 hours',
      lessons: 25,
      level: 'Advanced',
      price: 150,
      icon: '💰',
      category: 'Finance'
    }
  ];

  const certifications = [
    {
      name: 'TEC Certified Pi Investor',
      description: 'Demonstrate expertise in Pi Network investments',
      requirements: '3 courses + exam',
      badge: '🏆',
      benefits: ['Badge on profile', 'Priority deal access', 'Networking events']
    },
    {
      name: 'TEC Real Estate Specialist',
      description: 'Master real estate transactions with cryptocurrency',
      requirements: '4 courses + exam',
      badge: '🎖️',
      benefits: ['Specialist badge', 'Exclusive listings', 'Broker network access']
    },
    {
      name: 'TEC Elite Trader',
      description: 'Advanced trading and business strategies',
      requirements: '5 courses + exam',
      badge: '⭐',
      benefits: ['Elite badge', 'Premium tools', 'Direct advisor access']
    }
  ];

  return (
    <>
      <Head>
        <title>TEC Academy | Learn, Grow, Succeed</title>
        <meta name="description" content="Educational platform for Pi Network investment, real estate, and elite business strategies" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              🎓 TEC Academy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master the skills needed to succeed in luxury business, investment, and elite commerce. 
              Learn from industry experts and earn recognized certifications.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg px-6 py-3">
                <div className="text-2xl font-bold text-[#00ff9d]">50+</div>
                <div className="text-sm text-gray-400">Courses</div>
              </div>
              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg px-6 py-3">
                <div className="text-2xl font-bold text-[#00ff9d]">10,000+</div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
              <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg px-6 py-3">
                <div className="text-2xl font-bold text-[#00ff9d]">3</div>
                <div className="text-sm text-gray-400">Certifications</div>
              </div>
            </div>
          </div>

          {/* Free Courses */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Free Courses</h2>
              <span className="text-[#00ff9d] text-sm">Start learning today</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {freeCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg overflow-hidden hover:border-[#00ff9d] transition-all duration-300 group"
                >
                  <div className="bg-gradient-to-br from-[#00ff9d]/20 to-[#00c6ff]/20 p-6 text-center">
                    <div className="text-5xl mb-2">{course.icon}</div>
                    <span className="inline-block bg-[#00ff9d] text-gray-900 text-xs px-3 py-1 rounded-full font-semibold">
                      FREE
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-[#00ff9d] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span>⏱️ {course.duration}</span>
                      <span>📖 {course.lessons} lessons</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-700 px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                      <button className="text-[#00ff9d] text-sm font-semibold hover:underline">
                        Start →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Premium Courses */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Premium Courses</h2>
              <span className="text-[#00c6ff] text-sm">Advanced learning</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-800 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 group"
                >
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-6 text-center">
                    <div className="text-5xl mb-2">{course.icon}</div>
                    <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {course.price} Pi
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span>⏱️ {course.duration}</span>
                      <span>📖 {course.lessons} lessons</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-700 px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                      <button className="text-purple-400 text-sm font-semibold hover:underline">
                        Enroll →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Earn Certifications</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Complete courses and pass exams to earn recognized TEC certifications. 
                Showcase your expertise and unlock exclusive benefits.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-lg p-8 text-center"
                >
                  <div className="text-6xl mb-4">{cert.badge}</div>
                  <h3 className="text-xl font-bold mb-2 text-yellow-400">{cert.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{cert.description}</p>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-500 mb-2">Requirements:</div>
                    <div className="text-sm font-semibold">{cert.requirements}</div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-xs text-gray-500 mb-2">Benefits:</div>
                    <ul className="space-y-1">
                      {cert.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-yellow-400">✓</span>
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Start Path
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#00ff9d]/10 to-[#00c6ff]/10 border border-[#00ff9d]/30 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join TEC Academy today and gain the knowledge you need to succeed in elite business and investment.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
                Browse Free Courses
              </button>
              <Link
                href="/membership"
                className="border border-[#00ff9d] text-[#00ff9d] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00ff9d]/10 transition-all"
              >
                View Membership Benefits
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
