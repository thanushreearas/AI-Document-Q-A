import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import QA from './pages/QA';
import { isAuthenticated } from './utils/auth';

import './styles/globals.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                
                <Routes>
                    {/* Public Routes */}
                    <Route 
                        path="/login" 
                        element={
                            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
                        } 
                    />
                    <Route 
                        path="/register" 
                        element={
                            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />
                        } 
                    />
                    
                    {/* Protected Routes */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/documents" 
                        element={
                            <ProtectedRoute>
                                <Documents />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/qa" 
                        element={
                            <ProtectedRoute>
                                <QA />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Default Route */}
                    <Route 
                        path="/" 
                        element={
                            isAuthenticated() ? 
                                <Navigate to="/dashboard" replace /> : 
                                <Navigate to="/login" replace />
                        } 
                    />
                    
                    {/* Catch all route */}
                    <Route 
                        path="*" 
                        element={<Navigate to="/" replace />} 
                    />
                </Routes>

                {/* Toast Notifications */}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    toastStyle={{
                        backgroundColor: 'var(--white)',
                        color: 'var(--black)',
                        border: '1px solid var(--gray-200)'
                    }}
                />
            </div>
        </Router>
    );
}

export default App;