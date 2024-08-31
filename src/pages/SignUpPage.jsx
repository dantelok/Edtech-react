import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
    }
  }
`;

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [signUp] = useMutation(SIGNUP_MUTATION);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await signUp({
                variables: {
                    email,
                    password,
                },
            });
            toast.success('User created successfully!');

            if (data?.signUp?.token) {
                // Store the token in localStorage or context
                localStorage.setItem('token', data.signUp.token);

                // Redirect to sign-in page after successful sign-up
                // Wait for 3 seconds before navigating to the sign-in page
                setTimeout(() => {
                    navigate('/signin');
                }, 3000);  // 3000ms = 3 seconds
            }
        } catch (error) {
            // Check if the error message contains "User already exists"
            const errorMessage = error?.message || 'Registration failed';
            console.error('GraphQL Error:', errorMessage);

            if (errorMessage.includes('User already exists')) {
                toast.error('User already exists!'); // Show toast message for existing user
            } else {
                toast.error('An error occurred during registration');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg">
            <ToastContainer /> {/* ToastContainer is needed for toasts to appear */}
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
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
                    Sign Up
                </button>
            </form>

            {/* Link to sign-in page */}
            <p className="mt-4 text-center">
                Already have an account?{' '}
                <Link to="/signin" className="text-indigo-500 hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    );
};

export default SignUpPage;