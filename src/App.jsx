import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientDetails from './pages/PatientDetails';
import CreateJournalEntry from './pages/CreateJournalEntry';
import Messages from './pages/Messages';
import ComposeMessage from './pages/ComposeMessage';
import MessageDetails from './pages/MessageDetails';
import SearchPatients from './components/SearchPatients.jsx';
import CreatePatient from './pages/CreatePatient';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Patient routes - endast för DOCTOR och STAFF */}
                    <Route
                        path="/patients"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <PatientList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/search"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <SearchPatients />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/create"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <CreatePatient />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/:id"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <PatientDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/:patientId/journal/create"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <CreateJournalEntry />
                            </ProtectedRoute>
                        }
                    />

                    {/* Message routes - alla inloggade användare */}
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages/compose"
                        element={
                            <ProtectedRoute>
                                <ComposeMessage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages/:id"
                        element={
                            <ProtectedRoute>
                                <MessageDetails />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;