import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Redirect to login if user is not authenticated
        return <div>Loading...</div>
    }

    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" />;
    }

    // If authenticated, render the child components
    return children;
};

export default ProtectedRoute;