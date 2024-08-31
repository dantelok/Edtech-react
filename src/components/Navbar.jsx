import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Navbar = () => {
    const navigate = useNavigate();

    const linkClass = ({ isActive }) =>
        isActive
            ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
            : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

    // Function to handle logout
    const handleLogout = () => {
        // Remove the token or any user data stored in localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // If you have stored user data

        // Redirect to home or sign-in page after logout
        navigate('/signin'); // Redirect to the sign-in page
    };

    return (
        <nav className='bg-indigo-700 border-b border-indigo-500'>
            <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
                <div className='flex h-20 items-center justify-between'>
                    {/* Logo and Navigation Links */}
                    <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
                        <NavLink className='flex flex-shrink-0 items-center mr-4' to='/'>
                            <img className='h-10 w-auto' src={logo} alt='React Jobs' />
                            <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                                EdTech
                            </span>
                        </NavLink>
                        <div className='md:ml-auto'>
                            <div className='flex space-x-2'>
                                <NavLink to='/' className={linkClass}>
                                    Home
                                </NavLink>
                                <NavLink to='/calendar' className={linkClass}>
                                    Calendar
                                </NavLink>
                                {/*<NavLink to='/tasks' className={linkClass}>*/}
                                {/*    Tasks*/}
                                {/*</NavLink>*/}
                                <NavLink to='/profile' className={linkClass}>
                                    Profile
                                </NavLink>

                                <button
                                    onClick={handleLogout}
                                    className='text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
                                >
                                    Logout
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;