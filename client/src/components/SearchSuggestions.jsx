import React, { useState } from 'react';
import { FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';

export default function SearchSuggestions({ onSuggestionClick, type = 'location' }) {
  // Popular locations and search suggestions
  const locationSuggestions = [
    { name: 'Koramangala, Bangalore', type: 'area' },
    { name: 'Whitefield, Bangalore', type: 'area' },
    { name: 'Pune, Maharashtra', type: 'city' },
    { name: 'Hyderabad, Telangana', type: 'city' },
    { name: 'Chennai, Tamil Nadu', type: 'city' },
    { name: 'Delhi', type: 'city' },
    { name: 'Gurgaon, Haryana', type: 'area' },
    { name: 'Noida, UP', type: 'area' },
    { name: 'Mumbai, Maharashtra', type: 'city' },
    { name: 'Indore, MP', type: 'city' }
  ];

  const searchSuggestions = [
    { name: 'Girls PG', icon: '👩', description: 'PGs for female students' },
    { name: 'Boys PG', icon: '👨', description: 'PGs for male students' },
    { name: 'AC Rooms', icon: '❄️', description: 'Air conditioned rooms' },
    { name: 'WiFi PG', icon: '📶', description: 'High-speed internet' },
    { name: 'Mess Facility', icon: '🍽️', description: 'Food included' },
    { name: 'Near Metro', icon: '🚇', description: 'Metro connectivity' },
    { name: 'Furnished PG', icon: '🛏️', description: 'Fully furnished rooms' },
    { name: 'Single Room', icon: '🏠', description: 'Private rooms' }
  ];

  const suggestions = type === 'location' ? locationSuggestions : searchSuggestions;

  return (
    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto'>
      <div className='p-3 border-b border-gray-200 dark:border-gray-700'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
          {type === 'location' ? '📍 Popular Locations' : '🔍 Popular Searches'}
        </h4>
      </div>
      <div className='py-2'>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.name)}
            className='w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-200'
          >
            {type === 'location' ? (
              <>
                <FaMapMarkerAlt className='w-4 h-4 text-gray-400' />
                <div>
                  <div className='text-sm text-gray-800 dark:text-gray-200'>{suggestion.name}</div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 capitalize'>{suggestion.type}</div>
                </div>
              </>
            ) : (
              <>
                <span className='text-lg'>{suggestion.icon}</span>
                <div>
                  <div className='text-sm text-gray-800 dark:text-gray-200'>{suggestion.name}</div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>{suggestion.description}</div>
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
