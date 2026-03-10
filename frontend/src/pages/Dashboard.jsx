import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Trophy, Activity, TrendingUp, Award, BarChart3, Plus, Share2, Target, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get('/api/user/stats'),
        axios.get('/api/activities')
      ]);
      
      setStats(statsResponse.data);
      setActivities(activitiesResponse.data.slice(-7)); // Last 7 activities
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShareMessage = () => {
    return `I earned ${user.totalPoints} Green Points helping the planet 🌍 Join me at GREENPOINT!`;
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareOnTwitter = () => {
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
  };

  const getActivityIcon = (category) => {
    const icons = {
      'Transport': '🚌',
      'Food': '🥗',
      'Waste': '♻️',
      'Energy': '💡'
    };
    return icons[category] || '🌱';
  };

  const getBadgeEmoji = (badge) => {
    return badge.split(' ')[0];
  };

  const getBadgeName = (badge) => {
    return badge.split(' ').slice(1).join(' ');
  };

  // Prepare chart data
  const weeklyData = activities.slice(-7).map((activity, index) => ({
    day: `Day ${index + 1}`,
    points: activity.points,
    co2: activity.co2Saved
  }));

  const categoryData = stats ? Object.entries(stats.categoryStats).map(([category, data]) => ({
    name: category,
    value: data.points,
    count: data.count
  })) : [];

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.username}! 🌱
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your environmental impact and climb the leaderboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-8 w-8 text-eco-green" />
              <span className="text-2xl font-bold text-eco-green">{user.totalPoints}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Green Points</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keep earning more!</p>
          </div>

          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-eco-blue" />
              <span className="text-2xl font-bold text-eco-blue">{user.badges.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Badges Earned</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Great progress!</p>
          </div>

          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{stats?.totalActivities || 0}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activities</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total completed</p>
          </div>

          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">{stats?.monthlyCO2Saved?.toFixed(1) || 0}kg</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly CO₂ Saved</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Environmental impact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badges Section */}
          <div className="lg:col-span-1">
            <div className="eco-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Badges</h2>
                <Award className="h-6 w-6 text-eco-green" />
              </div>
              
              {user.badges.length > 0 ? (
                <div className="space-y-3">
                  {user.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-eco-light dark:bg-eco-dark rounded-lg">
                      <span className="text-2xl">{getBadgeEmoji(badge)}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{getBadgeName(badge)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Unlocked!</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">Complete activities to earn your first badge!</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Badge:</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg">🌿 Green Starter</span>
                  <span className="text-sm text-eco-green font-medium">100 points</span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-eco-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((user.totalPoints / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Chart */}
            <div className="eco-card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Weekly Activity</h2>
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="points" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-500">No activities yet. Start logging to see your progress!</p>
                </div>
              )}
            </div>

            {/* Category Distribution */}
            <div className="eco-card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Category Breakdown</h2>
              {categoryData.length > 0 ? (
                <div className="flex items-center justify-between">
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {categoryData.map((category, index) => (
                      <div key={category.name} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}: {category.count} activities
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-500">No data available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 eco-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
            <Link to="/activity" className="eco-button text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Log Activity
            </Link>
          </div>
          
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getActivityIcon(activity.category)}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.activityName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(activity.date).toLocaleDateString()} • {activity.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-eco-green">+{activity.points} pts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.co2Saved}kg CO₂</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No activities logged yet</p>
              <Link to="/activity" className="eco-button">
                <Plus className="h-4 w-4 mr-2" />
                Log Your First Activity
              </Link>
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="mt-8 eco-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share Your Impact</h3>
              <p className="text-gray-600 dark:text-gray-400">Inspire others to join the movement</p>
            </div>
            <button
              onClick={() => setShowShareModal(true)}
              className="eco-button flex items-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Progress
            </button>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share Your Green Impact</h3>
              <div className="bg-eco-light dark:bg-eco-dark rounded-lg p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300">{getShareMessage()}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={shareOnWhatsApp}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  WhatsApp
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
