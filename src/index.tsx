import React from 'react';
import ReactDOM from 'react-dom';
import { DailyTarotReading } from './components/DailyTarotReading';
import './styles/tarot-card.css';

// Main application component
const App: React.FC = () => {
  return (
    <div className="mystic-arcana-app">
      <header className="app-header">
        <h1>Mystic Arcana</h1>
        <p>Your daily connection to the mystic realm</p>
      </header>
      
      <main className="app-main">
        <DailyTarotReading />
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Mystic Arcana</p>
      </footer>
    </div>
  );
};

// Render the app
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);