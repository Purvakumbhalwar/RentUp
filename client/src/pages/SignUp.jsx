import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({ role: 'tenant' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='animate-fadeIn'>
          {/* Header */}
          <div className='text-center'>
            <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
              Create Account
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>Join RentUp and start your journey</p>
          </div>

          {/* Form */}
          <div className='mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Role Selection */}
              <div className='space-y-3'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center'>
                  <FaUserTag className='w-4 h-4 mr-2' />
                  I am a...
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                    formData.role === 'tenant'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}>
                    <input
                      type='radio'
                      id='role'
                      name='role'
                      value='tenant'
                      className='hidden'
                      checked={formData.role === 'tenant'}
                      onChange={handleChange}
                    />
                    <div className='font-medium'>Student/Tenant</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Looking for PG</div>
                  </label>
                  <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                    formData.role === 'owner'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}>
                    <input
                      type='radio'
                      id='role'
                      name='role'
                      value='owner'
                      className='hidden'
                      checked={formData.role === 'owner'}
                      onChange={handleChange}
                    />
                    <div className='font-medium'>PG Owner</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>List my property</div>
                  </label>
                </div>
              </div>

              {/* Username */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center'>
                  <FaUser className='w-4 h-4 mr-2' />
                  Username
                </label>
                <input
                  type='text'
                  placeholder='Enter your username'
                  className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  id='username'
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center'>
                  <FaEnvelope className='w-4 h-4 mr-2' />
                  Email
                </label>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  id='email'
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center'>
                  <FaLock className='w-4 h-4 mr-2' />
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Create a strong password'
                  className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  id='password'
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                className='w-full btn-primary py-4 px-4 rounded-xl font-medium text-lg hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200'
              >
                {loading ? (
                  <div className='flex items-center justify-center space-x-2'>
                    <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></div>
                    <span>Creating Account...</span>
                  </div>
                ) : 'Create Account'}
              </button>

              {/* OAuth */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>Or continue with</span>
                </div>
              </div>
              <OAuth />
            </form>

            {/* Sign In Link */}
            <div className='mt-6 text-center'>
              <p className='text-gray-600 dark:text-gray-400'>
                Already have an account?{' '}
                <Link to='/sign-in' className='text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors duration-200'>
                  Sign In
                </Link>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <p className='text-red-700 dark:text-red-400 text-sm'>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
