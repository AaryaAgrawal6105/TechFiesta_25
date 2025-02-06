import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, User, Upload, BarChart, Home, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import History from "../components/History";
import Profile from "../components/Profile";

const FileUpload = ({ onUpload }) => (
  <div className="w-full p-4 border-2 border-dashed border-white/30 rounded-lg text-center backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all">
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
      }}
      className="hidden"
      id="file-upload"
    />
    <label
      htmlFor="file-upload"
      className="cursor-pointer flex items-center justify-center space-x-2 text-white group"
    >
      <Upload className="group-hover:scale-110 transition-transform" size={24} />
      <span>Upload File</span>
    </label>
  </div>
);

const Dashboard = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentType, setAssignmentType] = useState("");
  const [feedback, setFeedback] = useState("No assignment selected");
  const [rubric, setRubric] = useState("");
  const [activeTab, setActiveTab] = useState("feedback");

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    setFeedback(assignment.feedback);
    setAssignmentType("");
    setIsHistoryOpen(false);
  };

  const handleFileUpload = (file) => {
    setFeedback(`File "${file.name}" uploaded successfully!`);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.6; }
            100% { opacity: 0.4; }
          }
          .floating-bg {
            animation: float 6s ease-in-out infinite;
          }
          .pulsing-overlay {
            animation: pulse 4s ease-in-out infinite;
          }
          .glass-effect {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      {/* Background Image with Animation */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 floating-bg">
          <img
            src="https://img.freepik.com/free-vector/blue-technology-particle-background_1017-19389.jpg?t=st=1738864230~exp=1738867830~hmac=3c0aed19dc3a32b3013bc4dcbebba50fd94e5fa3300e997b7b2b62fe02386b2b&w=1380"
            alt="AI Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60 pulsing-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-black/50" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 glass-effect p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <Home size={24} className="text-white" />
              <span className="text-xl font-bold">Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/settings" className="p-2 glass-effect rounded-full hover:bg-white/20 transition-all">
              <Settings size={24} className="text-white" />
            </Link>
            <button className="p-2 glass-effect rounded-full hover:bg-white/20 transition-all">
              <LogOut size={24} className="text-white" />
            </button>
          </div>
        </div>
      </nav>

      <motion.div
        className="relative z-10 container mx-auto px-6 py-8 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <motion.button
            onClick={() => setIsHistoryOpen(true)}
            className="p-3 glass-effect rounded-full hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
          <motion.button
            onClick={() => setIsProfileOpen(true)}
            className="p-3 glass-effect rounded-full hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <User size={24} />
          </motion.button>
        </div>

        <div className="w-full flex justify-start items-center space-x-6 mb-8">
          {["feedback", "assignments"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-4 text-lg font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? "glass-effect bg-white/20"
                  : "glass-effect hover:bg-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <motion.div
          className={`transition-all duration-300 ${
            isHistoryOpen || isProfileOpen ? "blur-sm" : ""
          }`}
        >
          {activeTab === "feedback" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-8 mb-6 min-h-[400px]"
            >
              {selectedAssignment ? (
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {selectedAssignment.title} Feedback
                  </h3>
                  <p className="text-white/90">{feedback}</p>
                </div>
              ) : (
                <p className="text-white/90">{feedback}</p>
              )}
            </motion.div>
          )}

          {activeTab === "assignments" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0"
            >
              <div className="w-full sm:w-1/2">
                <textarea
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  className="w-full h-36 p-4 glass-effect rounded-lg text-white text-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter rubric here..."
                />
              </div>

              <div className="w-full sm:w-1/2 flex flex-col gap-4">
                <select
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                  className="w-full p-4 glass-effect rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="" disabled>Select Assignment Type</option>
                  <option value="code">Code</option>
                  <option value="text">Text</option>
                  <option value="math">Mathematical Expression</option>
                </select>
                {assignmentType && <FileUpload onUpload={handleFileUpload} />}
              </div>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {isHistoryOpen && (
            <History
              onSelectAssignment={handleAssignmentSelect}
              onClose={() => setIsHistoryOpen(false)}
              analysisButton={
                <Link
                  to="/analysis"
                  className="w-full flex items-center justify-start space-x-3 p-4 glass-effect rounded-lg hover:bg-white/20 transition-all"
                >
                  <BarChart size={20} />
                  <span>View Analysis</span>
                </Link>
              }
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard;