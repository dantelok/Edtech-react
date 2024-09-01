import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from 'react-router-dom';
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AutoGraderPage from "./pages/AutoGraderPage.jsx";
import StudentAnalysisPage from "./pages/StudentAnalysisPage.jsx";

// Import AuthProvider and PrivateRoute components
import AuthProvider from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Set up Apollo Client
const client = new ApolloClient({
  // uri: 'http://localhost:4000', // Ensure this is the correct URI for your GraphQL server
  uri: 'https://edtech-react.onrender.com/',
  cache: new InMemoryCache(),
});

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                {/* Non-protected routes */}
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute> {/* Protect all routes inside MainLayout */}
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    {/*<Route path="/tasks" element={<TaskPage />} />*/}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/autograder" element={<AutoGraderPage />} />
                    <Route path="/student-analysis" element={<StudentAnalysisPage />} />
                </Route>

                {/* Fallback for unknown routes */}
                <Route path="*" element={<NotFoundPage />} />
            </>
        )
    );

    return (
        <ApolloProvider client={client}>
            <AuthProvider> {/* Ensure AuthProvider wraps the app */}
                <RouterProvider router={router} />
            </AuthProvider>
        </ApolloProvider>
    );
};

export default App;