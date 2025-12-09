import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../services/patientService';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getAllPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Patients</h1>

      {error && <p className="error">{error}</p>}

      <div className="white-box">
        {patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{patient.dateOfBirth}</td>
                  <td>
                    <Link to={`/patients/${patient.id}`}>
                      <button>View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PatientList;
