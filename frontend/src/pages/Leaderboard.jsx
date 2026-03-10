import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Users, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all-time');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getBadgeEmoji = (badges) => {
    if (badges.length === 0) return '';
    return badges[badges.length - 1].split(' ')[0];
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
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-eco-green" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GREENPOINT Leaderboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Celebrating our eco-warriors and climate champions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="eco-card p-6 text-center">
            <Users className="h-8 w-8 text-eco-green mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {leaderboard.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Active Participants</p>
          </div>
          <div className="eco-card p-6 text-center">
            <TrendingUp className="h-8 w-8 text-eco-blue mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {leaderboard.length > 0 ? leaderboard[0].totalPoints : 0}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Highest Score</p>
          </div>
          <div className="eco-card p-6 text-center">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {leaderboard.filter(u => u.badges.length >= 3).length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Eco Warriors</p>
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setTimeFilter('all-time')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                timeFilter === 'all-time'
                  ? 'bg-eco-green text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                timeFilter === 'monthly'
                  ? 'bg-eco-green text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Top 3 Winners */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 2nd Place */}
            <div className="eco-card p-6 text-center transform hover:scale-105 transition-transform">
              <div className="mb-4">
                <Medal className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getRankBadge(2)}`}>
                2nd Place
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {leaderboard[1]?.username}
              </h3>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                {leaderboard[1]?.totalPoints} pts
              </p>
              <div className="flex justify-center space-x-1 mb-3">
                {leaderboard[1]?.badges.slice(-3).map((badge, index) => (
                  <span key={index} className="text-2xl">{getBadgeEmoji([badge])}</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {leaderboard[1]?.badges.length} badges earned
              </p>
            </div>

            {/* 1st Place */}
            <div className="eco-card p-6 text-center transform hover:scale-105 transition-transform border-2 border-yellow-400 shadow-xl">
              <div className="mb-4">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto" />
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getRankBadge(1)}`}>
                🏆 Champion
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {leaderboard[0]?.username}
              </h3>
              <p className="text-3xl font-bold text-eco-green mb-2">
                {leaderboard[0]?.totalPoints} pts
              </p>
              <div className="flex justify-center space-x-1 mb-3">
                {leaderboard[0]?.badges.slice(-3).map((badge, index) => (
                  <span key={index} className="text-2xl">{getBadgeEmoji([badge])}</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {leaderboard[0]?.badges.length} badges earned
              </p>
            </div>

            {/* 3rd Place */}
            <div className="eco-card p-6 text-center transform hover:scale-105 transition-transform">
              <div className="mb-4">
                <Award className="h-12 w-12 text-orange-600 mx-auto" />
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getRankBadge(3)}`}>
                3rd Place
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {leaderboard[2]?.username}
              </h3>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                {leaderboard[2]?.totalPoints} pts
              </p>
              <div className="flex justify-center space-x-1 mb-3">
                {leaderboard[2]?.badges.slice(-3).map((badge, index) => (
                  <span key={index} className="text-2xl">{getBadgeEmoji([badge])}</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {leaderboard[2]?.badges.length} badges earned
              </p>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="eco-card overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Full Rankings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Badges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((user, index) => (
                  <tr
                    key={user.username}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      index < 3 ? 'bg-gradient-to-r from-transparent to-transparent' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankIcon(index + 1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-eco-green flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Eco Warrior
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-bold">
                        {user.totalPoints}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        points
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {user.badges.slice(-3).map((badge, badgeIndex) => (
                          <span key={badgeIndex} className="text-lg" title={badge}>
                            {getBadgeEmoji([badge])}
                          </span>
                        ))}
                        {user.badges.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{user.badges.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.badges.length} total
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index < 3 && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {index === 0 ? '🏆 Champion' : index === 1 ? '🥈 Runner-up' : '🥉 Third Place'}
                        </span>
                      )}
                      {index >= 3 && index < 10 && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Top 10
                        </span>
                      )}
                      {index >= 10 && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Rising Star
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        {leaderboard.length > 0 && (
          <div className="mt-12 text-center">
            <div className="eco-card p-8">
              <Trophy className="h-12 w-12 text-eco-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Climb the Rankings?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start logging your eco-friendly activities and earn points to reach the top!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="eco-button inline-flex items-center justify-center"
                >
                  Join the Competition
                </a>
                <a
                  href="/activity"
                  className="eco-button-secondary inline-flex items-center justify-center"
                >
                  Log Activity Now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
