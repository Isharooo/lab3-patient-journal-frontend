import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientService } from '../services/patientService';
import { journalService } from '../services/journalService';
import { messageService } from '../services/messageService';

function Dashboard() {
  const { user, isPatient, isDoctor, isStaff } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await messageService.getUnreadCount(user.id);
        setUnreadCount(count);

        if (isPatient) {
          const patient = await patientService.getPatientByUserId(user.id);
          setPatientData(patient);
          if (patient?.id) {
            const entries = await journalService.getEntriesByPatientId(patient.id);
            setJournalEntries(entries);
          }
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user, isPatient]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.firstName} {user?.lastName}</p>
      <p>Role: {user?.role}</p>

      {error && <p className="error">{error}</p>}

      <div className="white-box">
        <h2>Quick Actions</h2>
        <div className="button-group">
          <Link to="/messages">
            <button>Messages {unreadCount > 0 && `(${unreadCount} unread)`}</button>
          </Link>
          <Link to="/messages/compose">
            <button>New Message</button>
          </Link>
          {(isDoctor || isStaff) && (
            <Link to="/patients">
              <button>View Patients</button>
            </Link>
          )}
        </div>
      </div>

      {isPatient && patientData && (
        <>
          <div className="white-box">
            <h2>My Information</h2>
            <p>Name: {patientData.firstName} {patientData.lastName}</p>
            <p>Date of Birth: {patientData.dateOfBirth}</p>
          </div>

          <div className="white-box">
            <h2>My Journal Entries</h2>
            {journalEntries.length === 0 ? (
              <p>No journal entries found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  {journalEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td>{entry.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
