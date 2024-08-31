import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { AuthContext } from '../components/AuthProvider';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SignInPage = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [loginMutation] = useMutation(LOGIN_MUTATION);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await loginMutation({
                variables: {
                    email,
                    password,
                },
            });

            if (data?.login?.token) {
                // Store the token and handle login
                login(data.login.token);

                // Redirect after successful login
                navigate('/');
            } else {
                setError('Login failed');
            }
        } catch (error) {
            setError('An error occurred during login');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full"
                >
                    Sign In
                </button>
            </form>

            {/* Link to sign-up page */}
            <p className="mt-4 text-center">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-500 hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

export default SignInPage;