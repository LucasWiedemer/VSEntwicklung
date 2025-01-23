import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MovieSelectionPage from './pages/MovieSelectionPage';
import MatchResultsPage from './pages/MatchResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/select-movies" element={<MovieSelectionPage />} />
        <Route path="/match-results" element={<MatchResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
