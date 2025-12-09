import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { journalService } from '../services/journalService';

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await patientService.getPatientById(id);
        setPatient(patientData);

        const entries = await journalService.getEntriesByPatientId(id);
        setJournalEntries(entries);
      } catch (err) {
        console.error('Failed to fetch patient details:', err);
        setError('Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <Link to="/patients">
          <button>Back to Patients</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Patient Details</h1>
        <Link to="/patients">
          <button>Back to Patients</button>
        </Link>
      </div>

      <div className="white-box">
        <h2>{patient?.firstName} {patient?.lastName}</h2>
        <p>Date of Birth: {patient?.dateOfBirth}</p>
        {patient?.address && <p>Address: {patient.address}</p>}
        {patient?.phoneNumber && <p>Phone: {patient.phoneNumber}</p>}
      </div>

      <div className="white-box">
        <div className="page-header">
          <h2>Journal Entries</h2>
          <Link to={`/patients/${id}/journal/create`}>
            <button>New Entry</button>
          </Link>
        </div>

        {journalEntries.length === 0 ? (
          <p>No journal entries found.</p>
        ) : (
          journalEntries.map((entry) => (
            <div key={entry.id} className="list-item">
              <strong>{entry.title}</strong>
              <p>{entry.content}</p>
              <small>
                {new Date(entry.createdAt).toLocaleDateString()} by {entry.createdBy}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientDetails;
