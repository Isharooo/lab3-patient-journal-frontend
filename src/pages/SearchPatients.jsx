import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchService } from '../services/searchService';

function SearchPatients() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all'); // all, name, condition, personalNumber
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [serviceStatus, setServiceStatus] = useState(null);

    // Kolla search-service health vid mount
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const status = await searchService.checkHealth();
                setServiceStatus(status);
            } catch (err) {
                console.error('Search service unavailable:', err);
                setServiceStatus('unavailable');
            }
        };
        checkHealth();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let data;
            switch (searchType) {
                case 'name':
                    data = await searchService.searchPatientsByName(firstName, lastName);
                    break;
                case 'condition':
                    data = await searchService.searchPatientsByCondition(searchQuery);
                    break;
                case 'personalNumber':
                    data = await searchService.searchPatientsByPersonalNumber(searchQuery);
                    break;
                default:
                    data = await searchService.searchPatients(searchQuery);
            }
            setResults(data);
        } catch (err) {
            console.error('Search failed:', err);
            setError('Sökningen misslyckades. Kontrollera att search-service är igång.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Sök Patienter</h1>
                {serviceStatus && (
                    <span style={{
                        color: serviceStatus === 'unavailable' ? 'red' : 'green',
                        fontSize: '0.8em'
                    }}>
            Search Service: {serviceStatus === 'unavailable' ? '❌ Offline' : '✓ Online'}
          </span>
                )}
            </div>

            <div className="white-box">
                <div className="form-group">
                    <label>Söktyp</label>
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="all">Fritext (alla fält)</option>
                        <option value="name">Namn</option>
                        <option value="condition">Diagnos/Condition</option>
                        <option value="personalNumber">Personnummer</option>
                    </select>
                </div>

                <form onSubmit={handleSearch}>
                    {searchType === 'name' ? (
                        <div className="button-group" style={{ marginBottom: '12px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Förnamn</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Förnamn..."
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Efternamn</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Efternamn..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>
                                {searchType === 'condition' && 'Sök diagnos'}
                                {searchType === 'personalNumber' && 'Personnummer'}
                                {searchType === 'all' && 'Sökord'}
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    searchType === 'condition'
                                        ? 'T.ex. diabetes, migrän...'
                                        : searchType === 'personalNumber'
                                            ? 'T.ex. 199001...'
                                            : 'Sök i alla fält...'
                                }
                            />
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Söker...' : 'Sök'}
                    </button>
                </form>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="white-box">
                <h2>Sökresultat ({results.length})</h2>
                {results.length === 0 ? (
                    <p>Inga resultat hittades.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Namn</th>
                            <th>Personnummer</th>
                            <th>Email</th>
                            <th>Åtgärder</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((patient) => (
                            <tr key={patient.id || patient.originalPatientId}>
                                <td>{patient.firstName} {patient.lastName}</td>
                                <td>{patient.personalNumber}</td>
                                <td>{patient.email || '-'}</td>
                                <td>
                                    <Link to={`/patients/${patient.originalPatientId || patient.id}`}>
                                        <button>Visa</button>
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

export default SearchPatients;