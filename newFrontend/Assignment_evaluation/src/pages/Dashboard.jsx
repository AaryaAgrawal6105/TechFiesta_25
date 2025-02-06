import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, User, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import History from '../components/History';
import { BarChart } from 'lucide-react';

import Profile from '../components/Profile';

const FileUpload = ({ onUpload }) => (
  <div className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
    <input 
      type="file" 
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          onUpload(file);
        }
      }}
      className="hidden"
      id="file-upload"
    />
    <label 
      htmlFor="file-upload" 
      className="cursor-pointer flex items-center justify-center space-x-2 text-gray-300 hover:text-gray-200"
    >
      <Upload size={24} />
      <span>Upload File</span>
    </label>
  </div>
);

const Dashboard = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentType, setAssignmentType] = useState('');
  const [feedback, setFeedback] = useState('No assignment selected');

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    setFeedback(assignment.feedback);
    setAssignmentType(''); // Reset assignment type
    setIsHistoryOpen(false);
  };

  const handleFileUpload = (file) => {
    setFeedback(`File "${file.name}" uploaded successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
          >
            <Menu size={24} className="text-white" />
          </button>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
          >
            <User size={24} className="text-gray-300" />
          </button>
        </div>
        
        <motion.div 
          className={`transition-all duration-300 ${(isHistoryOpen || isProfileOpen) ? 'blur-sm' : ''}`}
        >
          <div className="bg-gray-600 rounded-2xl p-6 mb-6 min-h-[400px] shadow-lg border-white">
            {selectedAssignment ? (
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  {selectedAssignment.title} Feedback
                </h3>
                <p className="text-gray-200">{feedback}</p>
              </div>
            ) : (
              <p className="text-white">{feedback}</p>
            )}
          </div>
          
          {!selectedAssignment && (
            <div className="space-y-6">
              <select
                value={assignmentType}
                onChange={(e) => setAssignmentType(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-200 text-gray-300 
                           focus:outline-none focus:ring-2 focus:ring-gray-600 
                           transition-all duration-300"
              >
                <option value="" disabled>Select Assignment Type</option>
                <option value="code">Code</option>
                <option value="text">Text</option>
                <option value="math">Mathematical Expression</option>
              </select>
              
              {assignmentType && (
                <FileUpload onUpload={handleFileUpload} />
              )}
            </div>
          )}
        </motion.div>
        
        <AnimatePresence>
          {isHistoryOpen && (
            <History 
              onSelectAssignment={handleAssignmentSelect} 
              onClose={() => setIsHistoryOpen(false)}
              analysisButton={(
                <Link 
                  to="/analysis" 
                  className="w-full flex items-center justify-start space-x-3 
                             p-3 bg-gray-300 hover:bg-gray-400 rounded-lg 
                             text-black hover:text-white transition-all"
                >
                  <BarChart size={20} />
                  <span>View Analysis</span>
                </Link>
              )}
            />
          )}
          {isProfileOpen && <Profile />}
          
          {(isHistoryOpen || isProfileOpen) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsHistoryOpen(false);
                setIsProfileOpen(false);
              }}
              className="fixed inset-0 bg-black/70 z-40"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;