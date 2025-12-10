import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { patientService } from '../services/patientService';

function CreatePatient() {
    const navigate = useNavigate();
    const [useKafka, setUseKafka] = useState(true); // Default: använd Kafka
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        personalNumber: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let result;
            if (useKafka) {
                // Använd Kafka-endpoint (asynkront)
                result = await patientService.createPatient(formData);
                setSuccess('Patient-skapande skickat till Kafka! Patienten skapas asynkront.');
            } else {
                // Använd direkt REST (synkront)
                result = await patientService.createPatientDirect(formData);
                setSuccess('Patient skapad direkt!');
            }

            console.log('Result:', result);

            // Vänta lite innan navigering (speciellt för Kafka)
            setTimeout(() => {
                navigate('/patients');
            }, useKafka ? 2000 : 500);

        } catch (err) {
            console.error('Failed to create patient:', err);
            setError(err.response?.data || 'Kunde inte skapa patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Skapa Ny Patient</h1>
                <Link to="/patients">
                    <button>Avbryt</button>
                </Link>
            </div>

            <div className="white-box" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={useKafka}
                        onChange={(e) => setUseKafka(e.target.checked)}
                    />
                    <span>
            Använd Kafka (asynkront)
            <small style={{ color: '#666', marginLeft: '8px' }}>
              {useKafka
                  ? '→ Skickar CREATE-kommando via Kafka topic'
                  : '→ Direkt REST-anrop'}
            </small>
          </span>
                </label>
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p style={{ color: 'green', margin: '8px 0' }}>{success}</p>}

            <form onSubmit={handleSubmit} className="white-box">
                <div className="form-group">
                    <label htmlFor="firstName">Förnamn *</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Efternamn *</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="personalNumber">Personnummer *</label>
                    <input
                        type="text"
                        id="personalNumber"
                        name="personalNumber"
                        value={formData.personalNumber}
                        onChange={handleChange}
                        placeholder="YYYYMMDD-XXXX"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfBirth">Födelsedatum</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-post</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Telefon</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Adress</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading
                        ? (useKafka ? 'Skickar till Kafka...' : 'Skapar...')
                        : (useKafka ? 'Skapa via Kafka' : 'Skapa direkt')}
                </button>
            </form>
        </div>
    );
}

export default CreatePatient;