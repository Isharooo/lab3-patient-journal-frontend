import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/messageService';

function Messages() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (activeTab === 'inbox') {
          data = await messageService.getReceivedMessages(user.id);
        } else {
          data = await messageService.getSentMessages(user.id);
        }
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchMessages();
    }
  }, [activeTab, user]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Messages</h1>
        <Link to="/messages/compose">
          <button>New Message</button>
        </Link>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          Inbox
        </button>
        <button
          className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="white-box">
        {loading ? (
          <p>Loading...</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{activeTab === 'inbox' ? 'From' : 'To'}</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>
                    {activeTab === 'inbox'
                      ? message.senderName || message.senderId
                      : message.recipientName || message.recipientId}
                  </td>
                  <td>
                    <Link to={`/messages/${message.id}`}>
                      {message.subject || '(No subject)'}
                    </Link>
                  </td>
                  <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                  <td>{message.read ? 'Read' : 'Unread'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Messages;
