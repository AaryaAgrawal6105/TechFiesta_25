import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);

  // Mock assignments data (would be fetched from API in real app)
  const assignments = [
    { 
      id: 1, 
      title: 'Math Assignment', 
      date: 'Feb 1, 2024', 
      feedback: 'Excellent problem-solving skills demonstrated in algebraic calculations.',
      details: 'Solved complex algebraic equations with clear step-by-step solutions.'
    },
    { 
      id: 2, 
      title: 'Coding Project', 
      date: 'Jan 15, 2024', 
      feedback: 'Strong implementation of data structures and clean code principles.',
      details: 'Developed a comprehensive data structure implementation with efficient algorithms.'
    },
    { 
      id: 3, 
      title: 'Literature Essay', 
      date: 'Jan 25, 2024', 
      feedback: 'Insightful analysis of narrative themes and character development.',
      details: 'Analyzed the deeper symbolic meanings and character arcs in the assigned novel.'
    }
  ];

  useEffect(() => {
    const foundAssignment = assignments.find(a => a.id === parseInt(id));
    setAssignment(foundAssignment);
  }, [id]);

  if (!assignment) return <div className="text-white text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-xl rounded-xl p-8 transition-all transform hover:scale-105">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-300 hover:text-white bg-gray-700 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-600 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Assignment Title */}
        <h1 className="text-4xl font-extrabold text-blue-400 mb-3">{assignment.title}</h1>
        <p className="text-gray-400 text-lg mb-6">{assignment.date}</p>
        
        {/* Feedback Section */}
        <div className="bg-gray-700 bg-opacity-80 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-blue-500">
          <h2 className="text-2xl font-semibold text-green-400 mb-3">📢 Feedback</h2>
          <p className="text-gray-200 text-lg">{assignment.feedback}</p>
        </div>

        {/* Assignment Details */}
        <div className="bg-gray-700 bg-opacity-80 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-purple-500 mt-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">📜 Assignment Grades</h2>
          <p className="text-gray-200 text-lg">{assignment.details}</p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;
