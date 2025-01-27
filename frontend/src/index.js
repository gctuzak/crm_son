import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/antd-overrides.css';  // Ant Design stil override'ları
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
