import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react'; // You can use a back arrow icon from lucide-react

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [assignment, setAssignment] = useState(null);

  // Mock assignments data (in real app, this would come from an API)
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

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto bg-gray-700 rounded-lg p-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')} // Navigate to /dashboard
          className="p-2 mb-4 text-gray-300 hover:text-white bg-gray-600 rounded-full transition-all"
        >
          <ArrowLeft size={24} /> {/* Use the ArrowLeft icon */}
        </button>

        <h1 className="text-2xl font-bold mb-4">{assignment.title}</h1>
        <p className="text-gray-400 mb-6">{assignment.date}</p>
        
        <div className="bg-gray-600 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">Feedback</h2>
          <p className="text-gray-200">{assignment.feedback}</p>
        </div>
        
        <div className="bg-gray-600 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Assignment Details</h2>
          <p className="text-gray-200">{assignment.details}</p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;
