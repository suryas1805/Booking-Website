import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/Toast/ToastContainer';
import './App.css';
import { useEffect } from 'react';
import { initOneSignalSDK } from './onesignal';

function App() {

  useEffect(() => {
    initOneSignalSDK();
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <AppRoutes />
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;