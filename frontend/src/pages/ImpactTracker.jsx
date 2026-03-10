import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, TreePine, Globe, Droplets, Wind, BarChart3, Target, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const ImpactTracker = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get('/api/user/stats'),
        axios.get('/api/activities')
      ]);
      
      setStats(statsResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyData = () => {
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getMonth() === month.getMonth() && 
               activityDate.getFullYear() === month.getFullYear();
      });
      
      monthlyData.push({
        month: month.toLocaleDateString('en', { month: 'short' }),
        activities: monthActivities.length,
        points: monthActivities.reduce((sum, a) => sum + a.points, 0),
        co2: monthActivities.reduce((sum, a) => sum + a.co2Saved, 0)
      });
    }
    
    return monthlyData;
  };

  const getWeeklyData = () => {
    const weeklyData = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      
      const weekActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });
      
      weeklyData.push({
        week: `Week ${7 - i}`,
        activities: weekActivities.length,
        points: weekActivities.reduce((sum, a) => sum + a.points, 0),
        co2: weekActivities.reduce((sum, a) => sum + a.co2Saved, 0)
      });
    }
    
    return weeklyData;
  };

  const getChartData = () => {
    return timeRange === 'month' ? getMonthlyData() : getWeeklyData();
  };

  const getCategoryData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.categoryStats).map(([category, data]) => ({
      name: category,
      value: data.count,
      points: data.points,
      co2: (data.points * 0.1).toFixed(1) // Simplified CO2 calculation
    }));
  };

  const getImpactEquivalents = () => {
    const totalCO2 = stats?.totalCO2Saved || 0;
    
    return {
      trees: Math.round(totalCO2 * 0.8), // Roughly 0.8 trees per kg CO2
      gallons: Math.round(totalCO2 * 0.22), // Roughly 0.22 gallons of gasoline per kg CO2
      miles: Math.round(totalCO2 * 2.5), // Roughly 2.5 miles driven per kg CO2
      days: Math.round(totalCO2 * 0.5) // Roughly half a day of household energy per kg CO2
    };
  };

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
      </div>
    );
  }

  const equivalents = getImpactEquivalents();
  const chartData = getChartData();
  const categoryData = getCategoryData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Environmental Impact
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            See how your eco-friendly actions are making a real difference for the planet
          </p>
        </div>

        {/* Main Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Leaf className="h-8 w-8 text-eco-green" />
              <span className="text-2xl font-bold text-eco-green">{stats?.totalCO2Saved?.toFixed(1) || 0}kg</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total CO₂ Saved</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Lifetime impact</p>
          </div>

          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <TreePine className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{equivalents.trees}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trees Equivalent</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your impact equals this many trees</p>
          </div>

          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Wind className="h-8 w-8 text-eco-blue" />
              <span className="text-2xl font-bold text-eco-blue">{equivalents.gallons}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gallons of Gas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Fuel emissions saved</p>
          </div>

          <div className="eco-card p-6">
            <div className="flex items-center justify-between mb-4">
              <Globe className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{equivalents.miles}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Miles Not Driven</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Car emissions avoided</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                timeRange === 'week'
                  ? 'bg-eco-green text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Last 6 Weeks
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                timeRange === 'month'
                  ? 'bg-eco-green text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Last 6 Months
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Trend Chart */}
          <div className="eco-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Activity Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'month' ? 'month' : 'week'} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="activities" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CO2 Savings Chart */}
          <div className="eco-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              CO₂ Savings Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'month' ? 'month' : 'week'} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="co2" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="eco-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Impact by Category
            </h2>
            {categoryData.length > 0 ? (
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="60%" height={250}>
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
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.value} activities
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {category.co2}kg CO₂
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No data available yet</p>
              </div>
            )}
          </div>

          {/* Points Progress */}
          <div className="eco-card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Points Progress
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeRange === 'month' ? 'month' : 'week'} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impact Equivalents */}
        <div className="eco-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Your Impact in Perspective
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-eco-light dark:bg-eco-dark rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <TreePine className="h-10 w-10 text-eco-green" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Trees Planted Equivalent
              </h3>
              <p className="text-3xl font-bold text-eco-green mb-2">{equivalents.trees}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Trees that would absorb the same CO₂
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Wind className="h-10 w-10 text-eco-blue" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gallons of Gasoline
              </h3>
              <p className="text-3xl font-bold text-eco-blue mb-2">{equivalents.gallons}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Worth of gas emissions saved
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Miles Not Driven
              </h3>
              <p className="text-3xl font-bold text-purple-500 mb-2">{equivalents.miles}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Car miles emissions avoided
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Days of Energy
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mb-2">{equivalents.days}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Household energy days saved
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="eco-card p-8 text-center">
          <Award className="h-12 w-12 text-eco-green mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Keep Making a Difference!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Every eco-friendly action counts. You're already making a significant impact on our planet. 
            Continue logging your activities and inspire others to join the movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/activity"
              className="eco-button inline-flex items-center justify-center"
            >
              Log New Activity
            </Link>
            <Link
              to="/leaderboard"
              className="eco-button-secondary inline-flex items-center justify-center"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
