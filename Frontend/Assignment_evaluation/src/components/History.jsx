import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUI } from '../contexts/UIContext';

const History = () => {
  const { setIsHistoryOpen } = useUI();

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
          {/* Example history items */}
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item * 0.1 }}
              className="bg-dark-lighter p-4 rounded-lg hover:bg-dark-lighter/70 cursor-pointer transition-colors"
            >
              <h3 className="font-medium mb-1">Assignment {item}</h3>
              <p className="text-sm text-gray-400">Submitted 2 days ago</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default History;