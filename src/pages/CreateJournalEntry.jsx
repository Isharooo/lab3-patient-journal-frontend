import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { journalService } from '../services/journalService';

function CreateJournalEntry() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await journalService.createEntry({
        patientId: parseInt(patientId),
        title: formData.title,
        content: formData.content,
        createdBy: user.username,
      });
      navigate(`/patients/${patientId}`);
    } catch (err) {
      console.error('Failed to create journal entry:', err);
      setError('Failed to create journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>New Journal Entry</h1>
        <Link to={`/patients/${patientId}`}>
          <button>Cancel</button>
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="white-box">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Entry'}
        </button>
      </form>
    </div>
  );
}

export default CreateJournalEntry;
