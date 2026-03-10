import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, Leaf, Recycle, Lightbulb, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ActivityLog = () => {
  const { user, setUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const activities = {
    Transport: [
      { name: 'Used bus instead of car', points: 20 },
      { name: 'Cycled to destination', points: 20 },
      { name: 'Walked instead of driving', points: 20 }
    ],
    Food: [
      { name: 'Ate a vegan meal', points: 15 },
      { name: 'Ate vegetarian meal', points: 15 },
      { name: 'Used locally sourced food', points: 15 }
    ],
    Waste: [
      { name: 'Recycled plastic', points: 10 },
      { name: 'Reused items instead of buying new', points: 10 },
      { name: 'Composted organic waste', points: 10 }
    ],
    Energy: [
      { name: 'Turned off unused lights', points: 10 },
      { name: 'Used energy-efficient appliances', points: 10 },
      { name: 'Reduced air conditioning usage', points: 10 }
    ]
  };

  const categoryIcons = {
    Transport: <Bike className="h-6 w-6" />,
    Food: <Leaf className="h-6 w-6" />,
    Waste: <Recycle className="h-6 w-6" />,
    Energy: <Lightbulb className="h-6 w-6" />
  };

  const categoryColors = {
    Transport: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    Food: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Waste: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    Energy: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedActivity) {
      setError('Please select both a category and an activity');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const activity = activities[selectedCategory].find(a => a.name === selectedActivity);
      const response = await axios.post('/api/activities', {
        activityName: activity.name,
        category: selectedCategory,
        points: activity.points
      });

      setSuccess(`Great job! You earned ${activity.points} green points!`);
      
      // Update user context with new points and badges
      setUser(prev => ({
        ...prev,
        totalPoints: response.data.totalPoints,
        badges: response.data.badges
      }));

      // Reset form
      setSelectedCategory('');
      setSelectedActivity('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to log activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Log Your Eco Activity
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your sustainable actions and earn green points
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Current Points Display */}
        <div className="mb-8 eco-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Current Points</h2>
              <p className="text-3xl font-bold text-eco-green mt-2">{user.totalPoints} Green Points</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
              <p className="text-2xl font-bold text-eco-blue">{user.badges.length}</p>
            </div>
          </div>
        </div>

        {/* Activity Form */}
        <div className="eco-card p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose a Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(activities).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedActivity('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === category
                        ? 'border-eco-green bg-eco-light dark:bg-eco-dark'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-lg ${categoryColors[category]}`}>
                        {categoryIcons[category]}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Selection */}
            {selectedCategory && (
              <div className="animate-slide-up">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select Your Activity
                </h3>
                <div className="space-y-3">
                  {activities[selectedCategory].map((activity) => (
                    <button
                      key={activity.name}
                      type="button"
                      onClick={() => setSelectedActivity(activity.name)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedActivity === activity.name
                          ? 'border-eco-green bg-eco-light dark:bg-eco-dark'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedCategory}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-eco-green text-white">
                            +{activity.points} pts
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedActivity && (
              <div className="animate-slide-up">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full eco-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Logging Activity...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Log Activity & Earn Points
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Points System Info */}
        <div className="mt-8 eco-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Points System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(activities).map(([category, categoryActivities]) => (
              <div key={category} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${categoryColors[category]}`}>
                  {categoryIcons[category]}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {categoryActivities[0].points} points per activity
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            className="eco-button-secondary flex items-center justify-center"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/history"
            className="eco-button flex items-center justify-center"
          >
            View Activity History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
