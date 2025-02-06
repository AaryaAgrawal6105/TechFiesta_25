import { motion } from 'framer-motion';
import { X, User, Settings, LogOut } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { setIsProfileOpen } = useUI();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send logout request to backend
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${user?.token}` // Assuming you store JWT token in user context
        }
      });

      // Clear user context and navigate to home
      logout();
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, display an error notification to the user
    }
  };

  const menuItems = [
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-80 bg-dark shadow-2xl z-50"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Profile</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsProfileOpen(false)}
            className="p-2 hover:bg-dark-lighter rounded-full transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <User size={40} className="text-primary" />
          </motion.div>
          <h3 className="text-xl font-bold">{user?.name || 'John Doe'}</h3>
          <p className="text-gray-400">{user?.email || 'john@example.com'}</p>
        </div>

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              onClick={item.onClick}
              className="w-full flex items-center p-3 hover:bg-dark-lighter rounded-lg transition-colors"
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
