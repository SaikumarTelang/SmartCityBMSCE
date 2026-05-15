import { Trophy, Star, Zap, Award, TrendingUp } from 'lucide-react';

export default function Milestones({ updateAuth }) {
  const userRank = 'Gold Citizen';
  const totalPoints = 320;
  const nextRankPoints = 500;

  const badges = [
    { id: 1, name: 'First Report', icon: Star, unlocked: true, points: 50 },
    { id: 2, name: 'Quick Fixer', icon: Zap, unlocked: true, points: 100 },
    { id: 3, name: 'City Hero', icon: Trophy, unlocked: false, points: 200 },
    { id: 4, name: 'Legend', icon: Award, unlocked: false, points: 500 },
  ];

  const progress = (totalPoints / nextRankPoints) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Milestones</h1>
        <p className="text-slate-600">Track your civic engagement and earn badges</p>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-amber-100 font-medium mb-1">Current Rank</p>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8" />
              {userRank}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-amber-100 font-medium mb-1">Total Points</p>
            <p className="text-4xl font-bold">{totalPoints}</p>
          </div>
        </div>
        <div className="mb-2 flex justify-between text-sm font-medium">
          <span>Progress to Platinum</span>
          <span>{totalPoints}/{nextRankPoints} points</span>
        </div>
        <div className="h-3 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Weekly Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Reports Filed</span>
              <span className="font-bold text-slate-900">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Issues Resolved</span>
              <span className="font-bold text-emerald-600">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Points Earned</span>
              <span className="font-bold text-amber-600">+85</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Leaderboard</h3>
          </div>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Arjun P.', points: 1250 },
              { rank: 2, name: 'You', points: 320 },
              { rank: 3, name: 'Neha S.', points: 280 },
            ].map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                    user.rank === 2 ? 'bg-slate-200 text-slate-700' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {user.rank}
                  </span>
                  <span className={`font-medium ${user.name === 'You' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {user.name}
                  </span>
                </div>
                <span className="font-bold text-slate-900">{user.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-6 rounded-xl text-center border-2 transition-all ${
                badge.unlocked
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                badge.unlocked ? 'bg-emerald-500' : 'bg-slate-300'
              }`}>
                <badge.icon className={`w-8 h-8 ${badge.unlocked ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">{badge.name}</h4>
              <p className="text-sm text-slate-500">{badge.points} pts</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
