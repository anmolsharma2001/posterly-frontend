import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const stats = [
  { id: 1, title: 'Total Users', value: '12,450', change: '+14%', color: 'purple' },
  { id: 2, title: 'Active Sessions', value: '3,275', change: '+8%', color: 'blue' },
  { id: 3, title: 'Revenue', value: '$45,200', change: '+22%', color: 'pink' },
  { id: 4, title: 'Growth', value: '28%', change: '+4%', color: 'orange' },
];

const schedule = [
  { id: 1, title: 'Design Sync', time: '10:00 AM - 11:30 AM', type: 'meeting', color: 'purple' },
  { id: 2, title: 'Component Review', time: '1:00 PM - 2:00 PM', type: 'code', color: 'blue' },
  { id: 3, title: 'User Testing', time: '3:30 PM - 5:00 PM', type: 'research', color: 'pink' },
];

// Reusable animated gradient card
const GradientCard = ({ title, value, change, colorIndex }) => {
  const gradients = {
    purple: 'bg-gradient-to-br from-cd_purple to-[#8A7CFF]',
    blue: 'bg-gradient-to-br from-cd_blue to-[#6EC8FF]',
    pink: 'bg-gradient-to-br from-cd_pink to-[#FF92C2]',
    orange: 'bg-gradient-to-br from-cd_orange to-[#FFD18C]',
  };

  const bgClass = gradients[colorIndex] || gradients.purple;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl p-6 text-white shadow-lg ${bgClass} relative overflow-hidden`}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="relative z-10">
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold mb-4">{value}</h3>
        <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <span>{change}</span>
          <span>this week</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function ColorfulDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-cd_lavender flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/40 hidden md:flex flex-col p-6 shadow-[10px_0_30px_rgba(108,99,255,0.05)]"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cd_purple to-cd_blue flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cd_purple/30">
            D
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cd_purple to-cd_blue">
            DashLite
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {['Overview', 'Analytics', 'Schedule', 'Settings'].map((item, i) => (
            <button
              key={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.toLowerCase() 
                  ? 'bg-cd_purple/10 text-cd_purple font-semibold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeTab === item.toLowerCase() ? 'bg-cd_purple' : 'bg-transparent'}`} />
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-gradient-to-br from-cd_orange to-cd_pink p-5 rounded-2xl text-white shadow-lg shadow-cd_orange/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h4 className="font-bold mb-1 relative z-10">Upgrade to Pro</h4>
          <p className="text-xs text-white/80 mb-3 relative z-10">Get access to all features</p>
          <button className="bg-white text-cd_pink text-xs font-bold px-4 py-2 rounded-lg w-full shadow-sm hover:shadow-md transition-shadow relative z-10">
            Upgrade Now
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Hello, Anmol 👋</h1>
            <p className="text-slate-500 text-sm">Here's what's happening today.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 bg-white/80 border border-white/40 backdrop-blur-sm rounded-full text-sm outline-none focus:ring-2 focus:ring-cd_purple/30 w-64 shadow-sm transition-all focus:w-72"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-1.5 pr-4 rounded-full border border-white/40 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Anmol&backgroundColor=e2e8f0" 
                alt="Profile" 
                className="w-8 h-8 rounded-full bg-slate-100"
              />
              <span className="text-sm font-semibold text-slate-700">Anmol</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.id}
            >
              <GradientCard {...stat} colorIndex={stat.color} />
            </motion.div>
          ))}
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area (Mock) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl shadow-slate-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Activity Overview</h2>
              <select className="bg-cd_lavender border-none rounded-lg text-sm px-3 py-1.5 focus:ring-0 cursor-pointer text-slate-600 font-medium outline-none">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end gap-4 justify-between pt-10 px-2">
              {/* Mock Bar Chart */}
              {[40, 70, 45, 90, 65, 85, 55].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + (i * 0.05), duration: 0.8, type: "spring" }}
                    className="w-full bg-cd_purple/20 rounded-t-lg relative group-hover:bg-cd_purple/30 transition-colors"
                  >
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-cd_purple to-cd_blue rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${height * 0.8}%` }}
                    />
                  </motion.div>
                  <span className="text-xs text-slate-400 font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Calendar & Schedule */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Mini Calendar Widget */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">March 2026</h3>
                <div className="flex gap-2">
                  <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs hover:bg-slate-200">&lt;</button>
                  <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs hover:bg-slate-200">&gt;</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 border-b border-slate-100 pb-2 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
                {/* Empty days */}
                <div className="text-slate-300">1</div>
                {/* Valid days */}
                {[2,3,4,5,6,7].map(d => <div key={d} className="py-1 hover:bg-slate-50 cursor-pointer rounded-full">{d}</div>)}
                <div className="py-1 bg-gradient-to-br from-cd_teal to-cd_blue text-white rounded-full shadow-md shadow-cd_teal/30">8</div>
                {[9,10,11,12,13,14].map(d => <div key={d} className="py-1 hover:bg-slate-50 cursor-pointer rounded-full">{d}</div>)}
              </div>
            </div>

            {/* Schedule Layout */}
            <div className="bg-cd_gray_card rounded-3xl p-6 shadow-inner flex-1 border border-white">
              <h3 className="font-bold text-slate-800 mb-4">Today's Schedule</h3>
              <div className="space-y-4">
                {schedule.map((item, i) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    key={item.id} 
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden cursor-pointer"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${item.color}-500`} 
                         style={{ backgroundColor: item.color === 'purple' ? '#6C63FF' : item.color === 'blue' ? '#4DA8FF' : '#FF6FAF' }} />
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}
