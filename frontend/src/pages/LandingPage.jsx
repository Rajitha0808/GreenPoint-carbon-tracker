import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Trophy, Users, TrendingUp, Award, Globe, Bike, Recycle, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-eco-light via-white to-eco-blue/10 dark:from-gray-900 dark:via-gray-800 dark:to-eco-dark/50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-eco-green rounded-full animate-pulse-slow">
              <Leaf className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your Impact.
            <span className="text-eco-green"> Earn Green Points.</span>
            <br />
            Save the Planet.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Turn everyday eco-friendly actions into a fun challenge. Join thousands of urban youth making a real difference for our planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="eco-button text-lg px-8 py-4 inline-flex items-center justify-center">
              Start Tracking
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/leaderboard" className="eco-button-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
              <Trophy className="mr-2 h-5 w-5" />
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="p-6 bg-eco-light dark:bg-eco-dark rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-eco-green dark:text-eco-light">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Log Activities</h3>
              <p className="text-gray-600 dark:text-gray-300">Record your eco-friendly actions like cycling, recycling, or using public transport.</p>
            </div>
            <div className="text-center group">
              <div className="p-6 bg-eco-light dark:bg-eco-dark rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-eco-green dark:text-eco-light">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Earn Points</h3>
              <p className="text-gray-600 dark:text-gray-300">Get instant green points for every sustainable activity you complete.</p>
            </div>
            <div className="text-center group">
              <div className="p-6 bg-eco-light dark:bg-eco-dark rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-eco-green dark:text-eco-light">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Climb Rankings</h3>
              <p className="text-gray-600 dark:text-gray-300">Compete with friends, unlock badges, and become a climate champion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sustainable Habits Matter */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Why Sustainable Habits Matter
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Globe className="h-6 w-6 text-eco-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Climate Action</h3>
                    <p className="text-gray-600 dark:text-gray-300">Small daily actions collectively reduce carbon emissions and combat climate change.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-eco-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Impact</h3>
                    <p className="text-gray-600 dark:text-gray-300">Join a movement of young people creating sustainable urban communities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="h-6 w-6 text-eco-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personal Growth</h3>
                    <p className="text-gray-600 dark:text-gray-300">Build lifelong habits that benefit both your health and the environment.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-eco-light dark:bg-eco-dark rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-eco-green dark:text-eco-light mb-2">2.5M+</div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">KG CO₂ Saved by Our Community</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">1M+</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Activities Logged</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">100+</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Rewards */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Gamification Rewards
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="eco-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Eco Beginner</h3>
              <p className="text-eco-green font-bold mb-2">50 Points</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Start your eco journey</p>
            </div>
            <div className="eco-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Green Starter</h3>
              <p className="text-eco-green font-bold mb-2">100 Points</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Building green habits</p>
            </div>
            <div className="eco-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Eco Warrior</h3>
              <p className="text-eco-green font-bold mb-2">250 Points</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Making real impact</p>
            </div>
            <div className="eco-card p-6 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Climate Champion</h3>
              <p className="text-eco-green font-bold mb-2">1000 Points</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Leading the change</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Categories */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Track Your Eco Activities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <Bike className="h-12 w-12 text-eco-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transport</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Bus, Cycling, Walking</p>
              <span className="eco-badge">20 Points</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <Leaf className="h-12 w-12 text-eco-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Food</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Vegan, Vegetarian</p>
              <span className="eco-badge">15 Points</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <Recycle className="h-12 w-12 text-eco-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Waste</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Recycling, Reusing</p>
              <span className="eco-badge">10 Points</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
              <Lightbulb className="h-12 w-12 text-eco-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Energy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Saving Electricity</p>
              <span className="eco-badge">10 Points</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-eco-green to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Join thousands of young people turning their daily actions into positive environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-eco-green hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 inline-flex items-center justify-center">
              Get Started Now
              <CheckCircle className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/leaderboard" className="border-2 border-white text-white hover:bg-white hover:text-eco-green font-bold py-4 px-8 rounded-lg text-lg transition-all inline-flex items-center justify-center">
              See Top Contributors
              <Trophy className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
