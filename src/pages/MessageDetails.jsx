import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { messageService } from '../services/messageService';

function MessageDetails() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await messageService.getMessageById(id);
        setMessage(data);

        // Mark as read if not already
        if (!data.read) {
          await messageService.markAsRead(id);
        }
      } catch (err) {
        console.error('Failed to fetch message:', err);
        setError('Failed to load message');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <Link to="/messages">
          <button>Back to Messages</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Message</h1>
        <Link to="/messages">
          <button>Back to Messages</button>
        </Link>
      </div>

      <div className="white-box">
        <p><strong>From:</strong> {message?.senderName || message?.senderId}</p>
        <p><strong>To:</strong> {message?.recipientName || message?.recipientId}</p>
        <p><strong>Date:</strong> {new Date(message?.createdAt).toLocaleString()}</p>
        <p><strong>Subject:</strong> {message?.subject || '(No subject)'}</p>
        <hr style={{ margin: '12px 0' }} />
        <p style={{ whiteSpace: 'pre-wrap' }}>{message?.content}</p>
      </div>
    </div>
  );
}

export default MessageDetails;
