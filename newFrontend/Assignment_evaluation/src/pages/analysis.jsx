import React, { useState } from 'react';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalysisPage = () => {
  const [grades, setGrades] = useState([
    { assignment: 'Assignment 1', grade: 85, performance: 'Good' },
    { assignment: 'Assignment 2', grade: 92, performance: 'Excellent' },
    { assignment: 'Assignment 3', grade: 78, performance: 'Average' },
    { assignment: 'Assignment 4', grade: 88, performance: 'Very Good' },
    { assignment: 'Assignment 5', grade: 95, performance: 'Excellent' }
  ]);

  const calculateStats = () => {
    const average = (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2);
    const highest = Math.max(...grades.map(g => g.grade));
    const lowest = Math.min(...grades.map(g => g.grade));

    return { average, highest, lowest };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Grade Analysis</h1>
      
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400">Average Grade</p>
            <p className="text-2xl font-bold text-green-400">{stats.average}%</p>
          </div>
          <div>
            <p className="text-gray-400">Highest Grade</p>
            <p className="text-2xl font-bold text-blue-400">{stats.highest}%</p>
          </div>
          <div>
            <p className="text-gray-400">Lowest Grade</p>
            <p className="text-2xl font-bold text-red-400">{stats.lowest}%</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-700 rounded-lg p-6 h-[400px]">
          <h2 className="text-xl font-semibold mb-4 text-center">Grade Progression</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={grades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="assignment" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}
                itemStyle={{ color: 'white' }}
              />
              <Line 
                type="monotone" 
                dataKey="grade" 
                stroke="#10b981" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 h-[400px]">
          <h2 className="text-xl font-semibold mb-4 text-center">Performance Breakdown</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={grades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="assignment" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}
                itemStyle={{ color: 'white' }}
              />
              <Bar 
                dataKey="grade" 
                fill="#3182ce" 
                activeBar={{ fill: '#4299e1' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;