import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, authenticated, logout, isPatient } = useAuth();

  if (!authenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Patient Journal</div>
      <div className="navbar-menu">
        <Link to="/dashboard">Dashboard</Link>
        {!isPatient && <Link to="/patients">Patients</Link>}
        <Link to="/messages">Messages</Link>
        <span className="navbar-user">
          {user?.firstName} {user?.lastName} ({user?.role})
        </span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
