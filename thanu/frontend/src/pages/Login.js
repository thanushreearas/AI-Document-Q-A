import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { login } from '../utils/auth';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            const { access_token, user } = response.data;
            
            login(access_token, user);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content">
            <div className="container">
                <div style={{ 
                    maxWidth: '400px', 
                    margin: '0 auto',
                    paddingTop: '2rem'
                }}>
                    <div className="card">
                        <div className="card-header text-center">
                            <h2 className="card-title">Login</h2>
                            <p style={{ color: 'var(--gray-600)' }}>
                                Sign in to your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            <p>
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    style={{ 
                                        color: 'var(--primary-blue)',
                                        textDecoration: 'none',
                                        fontWeight: '500'
                                    }}
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;