import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { login } from '../utils/auth';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authAPI.register(registerData);
            const { access_token, user } = response.data;
            
            login(access_token, user);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.error || 'Registration failed');
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
                            <h2 className="card-title">Register</h2>
                            <p style={{ color: 'var(--gray-600)' }}>
                                Create your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

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
                                    placeholder="Enter your password (min 6 characters)"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
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
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            <p>
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    style={{ 
                                        color: 'var(--primary-blue)',
                                        textDecoration: 'none',
                                        fontWeight: '500'
                                    }}
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;