import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { journalService } from '../services/journalService';
import ImageUpload from '../components/ImageUpload';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [useKafka, setUseKafka] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await patientService.getPatientById(id);
        setPatient(patientData);

        const entries = await journalService.getEntriesByPatientId(id);
        setJournalEntries(entries);
      } catch (err) {
        console.error('Failed to fetch patient details:', err);
        setError('Kunde inte ladda patientdetaljer');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Är du säker på att du vill ta bort denna patient?')) {
      return;
    }

    try {
      if (useKafka) {
        await patientService.deletePatient(id);
        setDeleteMessage('DELETE-kommando skickat till Kafka. Patienten tas bort asynkront.');
      } else {
        await patientService.deletePatientDirect(id);
        setDeleteMessage('Patient borttagen.');
      }

      setTimeout(() => {
        navigate('/patients');
      }, useKafka ? 2000 : 500);
    } catch (err) {
      console.error('Failed to delete patient:', err);
      setError('Kunde inte ta bort patient');
    }
  };

  const handleImageUploaded = (imageData) => {
    console.log('Image uploaded for patient:', imageData);
    // Här kan du spara referensen till bilden i patientens journal etc.
  };

  if (loading) {
    return <div className="container">Laddar...</div>;
  }

  if (error) {
    return (
        <div className="container">
          <p className="error">{error}</p>
          <Link to="/patients">
            <button>Tillbaka till patienter</button>
          </Link>
        </div>
    );
  }

  return (
      <div className="container">
        <div className="page-header">
          <h1>Patientdetaljer</h1>
          <Link to="/patients">
            <button>Tillbaka till patienter</button>
          </Link>
        </div>

        {deleteMessage && (
            <p style={{ color: 'green', margin: '8px 0' }}>{deleteMessage}</p>
        )}

        <div className="white-box">
          <h2>{patient?.firstName} {patient?.lastName}</h2>
          <p><strong>Personnummer:</strong> {patient?.personalNumber}</p>
          <p><strong>Födelsedatum:</strong> {patient?.dateOfBirth}</p>
          {patient?.email && <p><strong>E-post:</strong> {patient.email}</p>}
          {patient?.phoneNumber && <p><strong>Telefon:</strong> {patient.phoneNumber}</p>}
          {patient?.address && <p><strong>Adress:</strong> {patient.address}</p>}

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #ccc' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                  type="checkbox"
                  checked={useKafka}
                  onChange={(e) => setUseKafka(e.target.checked)}
              />
              <span>Använd Kafka för ändringar</span>
            </label>
            <div className="button-group">
              <button onClick={() => setShowImageUpload(!showImageUpload)}>
                {showImageUpload ? 'Dölj bilduppladdning' : 'Ladda upp bild'}
              </button>
              <button
                  onClick={handleDelete}
                  style={{ background: '#dc3545', color: 'white', border: 'none' }}
              >
                Ta bort patient {useKafka ? '(Kafka)' : '(Direkt)'}
              </button>
            </div>
          </div>
        </div>

        {showImageUpload && (
            <ImageUpload
                patientId={id}
                onImageUploaded={handleImageUploaded}
            />
        )}

        <div className="white-box">
          <div className="page-header">
            <h2>Journalanteckningar</h2>
            <Link to={`/patients/${id}/journal/create`}>
              <button>Ny anteckning</button>
            </Link>
          </div>

          {journalEntries.length === 0 ? (
              <p>Inga journalanteckningar hittades.</p>
          ) : (
              journalEntries.map((entry) => (
                  <div key={entry.id} className="list-item">
                    <strong>{entry.title || entry.diagnosis || 'Anteckning'}</strong>
                    <p>{entry.note || entry.content}</p>
                    {entry.diagnosis && <p><em>Diagnos: {entry.diagnosis}</em></p>}
                    {entry.treatment && <p><em>Behandling: {entry.treatment}</em></p>}
                    <small>
                      {new Date(entry.createdAt).toLocaleDateString('sv-SE')}
                      {entry.createdBy && ` av ${entry.createdBy}`}
                    </small>
                  </div>
              ))
          )}
        </div>
      </div>
  );
}

export default PatientDetails;