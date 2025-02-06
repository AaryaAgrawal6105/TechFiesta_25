import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playbackRate={0.75} /* Slows down the video */
          className="w-full h-full object-cover"
        >
          <source src="https://videocdn.cdnpk.net/videos/83d728ee-f7e4-5350-8f55-3017a975db66/horizontal/previews/clear/large.mp4?token=exp=1738869175~hmac=28129f164671c36c9fc0ade3cd83ffd84c486779eca32b9f56482f8f67863025" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-black/50" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            SE
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Student Evaluation</h1>
          <p className="text-lg text-gray-300 mb-8">
            Streamline your academic assignments with our intelligent evaluation system.
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/register')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full border border-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md"
          >
            Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
