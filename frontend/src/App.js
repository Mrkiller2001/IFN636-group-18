import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Bins from './pages/Bins';
import BinHistoryPage from './pages/BinHistory';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bins" element={<Bins />} />
        <Route path="/bins/:id/history" element={<BinHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
