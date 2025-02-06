import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-darker p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl font-bold">SE</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Student Evaluation</h1>
          <p className="text-lg text-gray-400 mb-8">
            Streamline your academic assignments with our intelligent evaluation system.
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/register')}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full border border-primary hover:bg-primary/10 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;