import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout, isAuthenticated } from '../utils/auth';

const Header = () => {
    const navigate = useNavigate();
    const user = getUser();
    const authenticated = isAuthenticated();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        AI Document Q&A
                    </Link>
                    
                    <nav>
                        {authenticated ? (
                            <ul className="nav-links">
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/documents">Documents</Link></li>
                                <li><Link to="/qa">Q&A</Link></li>
                                <li>
                                    <span style={{ color: 'var(--gray-600)' }}>
                                        Welcome, {user?.username}
                                    </span>
                                </li>
                                <li>
                                    <button 
                                        onClick={handleLogout}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        ) : (
                            <ul className="nav-links">
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </ul>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;