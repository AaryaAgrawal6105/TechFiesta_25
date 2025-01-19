// src/pages/Dashboard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Upload, User } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import History from '../components/History';
import Profile from '../components/Profile';
import FileUpload from '../components/FileUpload';

const Dashboard = () => {
  const { isHistoryOpen, setIsHistoryOpen, isProfileOpen, setIsProfileOpen } = useUI();
  const [assignmentType, setAssignmentType] = useState('');
  const [feedback, setFeedback] = useState('No feedback yet');

  return (
    <div className="h-screen bg-dark-darker p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="p-2 hover:bg-dark-lighter rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="p-2 hover:bg-dark-lighter rounded-full transition-colors"
        >
          <User size={24} />
        </button>
      </div>

      <motion.div 
        className={`transition-all duration-300 ${(isHistoryOpen || isProfileOpen) ? 'blur-sm' : ''}`}
      >
        <div className="bg-dark rounded-lg p-6 mb-6 min-h-[400px] shadow-lg">
          <p>{feedback}</p>
        </div>

        <div className="space-y-4">
          <select
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
            className="w-full p-2 rounded bg-dark-lighter border border-dark focus:border-primary focus:outline-none"
          >
            <option value="" disabled>Select Assignment Type</option>
            <option value="code">Code</option>
            <option value="text">Text</option>
            <option value="math">Mathematical Expression</option>
          </select>

          {assignmentType && (
            <FileUpload onUpload={(file) => setFeedback(`File "${file.name}" uploaded successfully!`)} />
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isHistoryOpen && <History />}
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
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;