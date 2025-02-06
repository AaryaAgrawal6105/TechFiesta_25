import React, { useState } from 'react';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalysisPage = () => {
  const [grades, setGrades] = useState([
    { assignment: 'A1', grade: 85 },
    { assignment: 'A2', grade: 92 },
    { assignment: 'A3', grade: 78 },
    { assignment: 'A4', grade: 88 },
    { assignment: 'A5', grade: 95 }
  ]);

  const calculateStats = () => {
    const average = (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2);
    const highest = Math.max(...grades.map(g => g.grade));
    const lowest = Math.min(...grades.map(g => g.grade));
    return { average, highest, lowest };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-10">
      {/* Page Header */}
      <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-400 tracking-wide">
        📊 Student Performance Analysis
      </h1>

      {/* Stats Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Average Grade', value: stats.average, color: 'text-green-400', border: 'border-green-400' },
          { label: 'Highest Grade', value: stats.highest, color: 'text-blue-400', border: 'border-blue-400' },
          { label: 'Lowest Grade', value: stats.lowest, color: 'text-red-400', border: 'border-red-400' }
        ].map((item, index) => (
          <div 
            key={index} 
            className={`bg-gray-800 border ${item.border} p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-center`}
          >
            <div className="w-24 h-24 rounded-full border-4 border-gray-600 flex items-center justify-center mb-4">
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}%</p>
            </div>
            <p className="text-lg text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Line Chart - Grade Progression */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform transition hover:scale-105">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-300">📈 Grade Progression</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={grades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="assignment" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none', color: 'white' }} />
              <Line type="monotone" dataKey="grade" stroke="#4FD1C5" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Performance Breakdown */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform transition hover:scale-105">
          <h2 className="text-2xl font-semibold mb-4 text-center text-purple-300">📊 Performance Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={grades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="assignment" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none', color: 'white' }} />
              <Bar dataKey="grade" fill="#9F7AEA" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Section - Insights */}
      <div className="bg-gray-800 rounded-xl p-6 mt-12 shadow-lg transform transition hover:scale-105">
        <h2 className="text-2xl font-semibold mb-6 text-center text-yellow-400">📌 Key Insights</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg">
          <li>Your **highest performance** was in **Assignment 5** with **{stats.highest}%**.</li>
          <li>Your **average performance** is **{stats.average}%**, which is **above passing**.</li>
          <li>Your **lowest grade** was **{stats.lowest}%**, consider reviewing the material.</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisPage;
