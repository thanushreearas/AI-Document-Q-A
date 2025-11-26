import React, { useState, useEffect } from 'react';
import { documentsAPI, qaAPI } from '../utils/api';
import { getUser } from '../utils/auth';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDocuments: 0,
        totalQuestions: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const user = getUser();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch documents
            const documentsResponse = await documentsAPI.list();
            const documents = documentsResponse.data.documents;
            
            // Fetch Q&A history
            const qaResponse = await qaAPI.getHistory();
            const qaHistory = qaResponse.data.history;
            
            setStats({
                totalDocuments: documents.length,
                totalQuestions: qaHistory.length,
                recentActivity: qaHistory.slice(0, 5) // Last 5 activities
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Documents', 'Questions Asked'],
        datasets: [
            {
                label: 'Count',
                data: [stats.totalDocuments, stats.totalQuestions],
                backgroundColor: ['#2563eb', '#3b82f6'],
                borderColor: ['#1d4ed8', '#2563eb'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Activity Overview',
            },
        },
    };

    const doughnutData = {
        labels: ['Documents', 'Questions'],
        datasets: [
            {
                data: [stats.totalDocuments, stats.totalQuestions],
                backgroundColor: ['#2563eb', '#3b82f6'],
                borderColor: ['#1d4ed8', '#2563eb'],
                borderWidth: 2,
            },
        ],
    };

    if (loading) {
        return (
            <div className="main-content">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="container">
                <div className="mb-4">
                    <h1 style={{ color: 'var(--black)', marginBottom: '0.5rem' }}>
                        Welcome back, {user?.username}! 👋
                    </h1>
                    <p style={{ color: 'var(--gray-600)' }}>
                        Here's an overview of your AI Document Q&A activity
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-3 mb-4">
                    <div className="card">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
                            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
                                {stats.totalDocuments}
                            </h3>
                            <p style={{ color: 'var(--gray-600)' }}>Documents Uploaded</p>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❓</div>
                            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
                                {stats.totalQuestions}
                            </h3>
                            <p style={{ color: 'var(--gray-600)' }}>Questions Asked</p>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
                            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
                                AI-Powered
                            </h3>
                            <p style={{ color: 'var(--gray-600)' }}>Smart Answers</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-2 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Activity Overview</h3>
                        </div>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Usage Distribution</h3>
                        </div>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '250px', height: '250px' }}>
                                <Doughnut data={doughnutData} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Activity</h3>
                    </div>
                    
                    {stats.recentActivity.length === 0 ? (
                        <div className="text-center p-4">
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                            <p>No recent activity</p>
                            <p style={{ color: 'var(--gray-600)' }}>
                                Upload a document and start asking questions!
                            </p>
                        </div>
                    ) : (
                        <div>
                            {stats.recentActivity.map((activity, index) => (
                                <div
                                    key={activity.qa_id}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: index < stats.recentActivity.length - 1 
                                            ? '1px solid var(--gray-200)' 
                                            : 'none'
                                    }}
                                >
                                    <div className="flex-between mb-1">
                                        <small style={{ color: 'var(--gray-600)' }}>
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </small>
                                        <span style={{ 
                                            color: activity.success ? 'var(--success)' : 'var(--error)',
                                            fontSize: '0.875rem'
                                        }}>
                                            {activity.success ? '✅ Success' : '❌ Failed'}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <strong>Q: </strong>
                                        {activity.question.length > 100 
                                            ? activity.question.substring(0, 100) + '...' 
                                            : activity.question}
                                    </div>
                                    <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                        <strong>A: </strong>
                                        {activity.answer.length > 150 
                                            ? activity.answer.substring(0, 150) + '...' 
                                            : activity.answer}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card mt-4">
                    <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div className="flex gap-2">
                        <a href="/documents" className="btn btn-primary">
                            📄 Upload Document
                        </a>
                        <a href="/qa" className="btn btn-secondary">
                            ❓ Ask Questions
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;