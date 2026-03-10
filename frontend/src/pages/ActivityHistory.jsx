import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, Download, Search, Bike, Leaf, Recycle, Lightbulb, TrendingUp } from 'lucide-react';
import axios from 'axios';

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, categoryFilter, dateFilter]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/activities');
      setActivities(response.data.reverse()); // Most recent first
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category === categoryFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(activity => new Date(activity.date) >= today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(activity => new Date(activity.date) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(activity => new Date(activity.date) >= monthAgo);
    }

    setFilteredActivities(filtered);
  };

  const getActivityIcon = (category) => {
    const icons = {
      'Transport': <Bike className="h-5 w-5" />,
      'Food': <Leaf className="h-5 w-5" />,
      'Waste': <Recycle className="h-5 w-5" />,
      'Energy': <Lightbulb className="h-5 w-5" />
    };
    return icons[category] || <Leaf className="h-5 w-5" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Transport': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Food': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'Waste': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      'Energy': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const getTotalPoints = () => {
    return filteredActivities.reduce((sum, activity) => sum + activity.points, 0);
  };

  const getTotalCO2 = () => {
    return filteredActivities.reduce((sum, activity) => sum + activity.co2Saved, 0);
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Activity', 'Category', 'Points', 'CO2 Saved (kg)'],
      ...filteredActivities.map(activity => [
        new Date(activity.date).toLocaleDateString(),
        activity.activityName,
        activity.category,
        activity.points,
        activity.co2Saved
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greenpoint-activities-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Activity History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and analyze your eco-friendly activities over time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="eco-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredActivities.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-eco-green" />
            </div>
          </div>
          
          <div className="eco-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                <p className="text-2xl font-bold text-eco-green">
                  {getTotalPoints()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-eco-blue" />
            </div>
          </div>
          
          <div className="eco-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">CO₂ Saved</p>
                <p className="text-2xl font-bold text-purple-500">
                  {getTotalCO2().toFixed(1)}kg
                </p>
              </div>
              <Leaf className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="eco-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="eco-input pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="eco-input"
            >
              <option value="all">All Categories</option>
              <option value="Transport">Transport</option>
              <option value="Food">Food</option>
              <option value="Waste">Waste</option>
              <option value="Energy">Energy</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="eco-input"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportData}
              className="eco-button-secondary flex items-center justify-center"
              disabled={filteredActivities.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="eco-card overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Activities ({filteredActivities.length})
            </h2>
          </div>
          
          {filteredActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CO₂ Saved
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(activity.category)}`}>
                            {getActivityIcon(activity.category)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.activityName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-eco-green">
                          +{activity.points} pts
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {activity.co2Saved}kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activities.length === 0 
                  ? "You haven't logged any activities yet. Start your eco journey today!"
                  : "Try adjusting your filters to see more activities."
                }
              </p>
              {activities.length === 0 && (
                <Link to="/activity" className="eco-button inline-flex items-center">
                  Log Your First Activity
                </Link>
              )}
            </div>
          )}
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
            to="/activity"
            className="eco-button flex items-center justify-center"
          >
            Log New Activity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistory;
