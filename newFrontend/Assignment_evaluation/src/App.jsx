// src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <div className="min-h-screen bg-dark text-white">
            <AppRoutes />
          </div>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;