import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
      <div className="container">
        <h1>Dashboard fungerar!</h1>
        <p>Inloggad som: {user?.username}</p>
        <p>Roll: {user?.role}</p>
      </div>
  );
}

export default Dashboard;