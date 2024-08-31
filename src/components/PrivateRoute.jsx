import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider'; // Adjust the path accordingly

const PrivateRoute = ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = useContext(AuthContext); // Destructure user from AuthContext

    if (user === undefined || user === null) {
        return <Navigate to="/signin" />; // If no user, redirect to sign in page
    }

    return children; // If user is logged in, render the children components
};

export default PrivateRoute;