import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ✅ Make sure the path is right
import './index.css'; // (Optional CSS)
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</React.StrictMode>
);
