import React from 'react'
import { useSelector } from 'react-redux'
import { 
  FaHome, 
  FaUsers, 
  FaShieldAlt, 
  FaMapMarkedAlt, 
  FaWifi, 
  FaUtensils,
  FaBed,
  FaCar,
  FaGraduationCap,
  FaHeart,
  FaCheckCircle,
  FaStar
} from 'react-icons/fa'

export default function About() {
  const { currentUser } = useSelector((state) => state.user);
  
  const features = [
    {
      icon: <FaGraduationCap className='w-8 h-8 text-blue-600' />,
      title: 'Student-Focused',
      description: 'Specially designed for students with affordable PG options near colleges and universities.'
    },
    {
      icon: <FaShieldAlt className='w-8 h-8 text-green-600' />,
      title: 'Verified Listings',
      description: 'All our PG accommodations are verified for safety, cleanliness, and authenticity.'
    },
    {
      icon: <FaMapMarkedAlt className='w-8 h-8 text-purple-600' />,
      title: 'Prime Locations',
      description: 'Find PGs in prime locations with easy access to colleges, libraries, and transport.'
    },
    {
      icon: <FaUsers className='w-8 h-8 text-orange-600' />,
      title: 'Community Living',
      description: 'Connect with like-minded students and build lasting friendships in shared spaces.'
    },
    {
      icon: <FaWifi className='w-8 h-8 text-cyan-600' />,
      title: 'Modern Amenities',
      description: 'High-speed WiFi, study rooms, recreational areas, and all modern facilities.'
    },
    {
      icon: <FaHeart className='w-8 h-8 text-red-600' />,
      title: 'Home Away from Home',
      description: 'Comfortable, safe, and welcoming environment that feels like home.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Happy Students' },
    { number: '500+', label: 'Verified PGs' },
    { number: '50+', label: 'Cities Covered' },
    { number: '98%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20'>
        <div className='absolute inset-0 bg-black opacity-10'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='animate-fadeIn'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-6'>
              About <span className='text-cyan-200'>RentUp</span>
            </h1>
            <p className='text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90'>
              India's Premier Student PG Finding Platform
            </p>
            <div className='w-24 h-1 bg-cyan-300 mx-auto rounded-full'></div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className='py-16 px-4 max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='animate-slideIn'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6'>
              Empowering Students to Find Their Perfect PG
            </h2>
            <div className='space-y-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed'>
              <p>
                RentUp is a revolutionary platform designed specifically for students seeking comfortable, 
                affordable, and secure PG (Paying Guest) accommodations across India. We understand the 
                unique challenges students face when searching for the perfect place to call home during 
                their academic journey.
              </p>
              <p>
                Our mission is to bridge the gap between students and quality PG providers, ensuring 
                every student finds a safe, comfortable, and conducive living environment that supports 
                their educational goals and personal growth.
              </p>
              <p>
                With thousands of verified listings, transparent pricing in Indian Rupees, and a 
                user-friendly platform, RentUp makes finding your ideal PG as easy as a few clicks.
              </p>
            </div>
          </div>
          
          <div className='relative animate-fadeIn'>
            <div className='bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 shadow-xl'>
              <div className='grid grid-cols-2 gap-6'>
                {stats.map((stat, index) => (
                  <div key={index} className='text-center'>
                    <div className='text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                      {stat.number}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='py-16 bg-white dark:bg-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12 animate-fadeIn'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4'>
              Why Choose RentUp?
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              We're committed to making your PG search experience seamless, safe, and successful.
            </p>
          </div>
          
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className='group bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transform hover:scale-105 transition-all duration-300 animate-fadeIn'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className='flex items-center mb-4'>
                  <div className='p-3 bg-white dark:bg-gray-600 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-200'>
                    {feature.icon}
                  </div>
                </div>
                <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className='py-16 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12 animate-fadeIn'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4'>
              Our Commitment to Students
            </h2>
          </div>
          
          <div className='grid lg:grid-cols-3 gap-8'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center animate-slideIn'>
              <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaCheckCircle className='w-8 h-8 text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-3'>Quality Assurance</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Every PG listing is personally verified by our team to ensure quality, safety, and accuracy.
              </p>
            </div>
            
            <div className='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center animate-slideIn' style={{ animationDelay: '200ms' }}>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaStar className='w-8 h-8 text-green-600 dark:text-green-400' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-3'>Student-First Approach</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Our platform is built with students in mind, offering affordable options and flexible terms.
              </p>
            </div>
            
            <div className='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center animate-slideIn' style={{ animationDelay: '400ms' }}>
              <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FaHeart className='w-8 h-8 text-purple-600 dark:text-purple-400' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-3'>24/7 Support</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Our dedicated support team is always available to help you with any queries or concerns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className='py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
            Ready to Find Your Perfect PG?
          </h2>
          <p className='text-xl mb-8 opacity-90'>
            Join thousands of students who have found their ideal accommodation through RentUp.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='/search'
              className='bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg'
            >
              Browse PGs
            </a>
            {/* Only show List Your PG for owners or users without role */}
            {(!currentUser?.role || currentUser?.role === 'owner') && (
              <a
                href='/create-listing'
                className='border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105'
              >
                List Your PG
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
