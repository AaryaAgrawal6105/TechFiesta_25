import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';

const AssignmentCard = ({ assignment, onSelect }) => {
  return (
    <Link
      to={`/assignment/${assignment.id}`}
      onClick={() => onSelect(assignment)}
      className="bg-dark-lighter p-4 rounded-lg hover:bg-dark-lighter/70 cursor-pointer 
                 transition-colors flex items-center space-x-3"
    >
      <FileText size={20} className="text-blue-400" />
      <div>
        <h3 className="font-medium mb-1">{assignment.title}</h3>
        <p className="text-sm text-gray-400">{assignment.date}</p>
      </div>
    </Link>
  );
};

const History = ({ onSelectAssignment, analysisButton }) => {
  const { setIsHistoryOpen } = useUI();

  const assignments = [
    { 
      id: 1, 
      title: 'Math Assignment', 
      date: 'Feb 1, 2024', 
      feedback: 'Excellent problem-solving skills demonstrated in algebraic calculations.' 
    },
    { 
      id: 2, 
      title: 'Coding Project', 
      date: 'Jan 15, 2024', 
      feedback: 'Strong implementation of data structures and clean code principles.' 
    },
    { 
      id: 3, 
      title: 'Literature Essay', 
      date: 'Jan 25, 2024', 
      feedback: 'Insightful analysis of narrative themes and character development.' 
    }
  ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 left-0 h-full w-80 bg-dark shadow-2xl z-50"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">History</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsHistoryOpen(false)}
            className="p-2 hover:bg-dark-lighter rounded-full transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              onSelect={(selectedAssignment) => {
                onSelectAssignment(selectedAssignment);
                setIsHistoryOpen(false);
              }} 
            />
          ))}

          {analysisButton}
        </div>
      </div>
    </motion.div>
  );
};

export default History;