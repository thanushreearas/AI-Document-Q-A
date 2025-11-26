import React, { useState } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';

const Documents = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadSuccess = (document) => {
        // Trigger refresh of document list
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="main-content">
            <div className="container">
                <div className="mb-4">
                    <h1 style={{ color: 'var(--black)', marginBottom: '0.5rem' }}>
                        Document Management 📄
                    </h1>
                    <p style={{ color: 'var(--gray-600)' }}>
                        Upload and manage your documents for AI-powered Q&A
                    </p>
                </div>

                <div className="grid grid-2">
                    {/* Upload Section */}
                    <div>
                        <DocumentUpload onUploadSuccess={handleUploadSuccess} />
                        
                        {/* Upload Guidelines */}
                        <div className="card mt-3">
                            <div className="card-header">
                                <h3 className="card-title">📋 Upload Guidelines</h3>
                            </div>
                            <ul style={{ 
                                listStyle: 'none', 
                                padding: 0,
                                lineHeight: '1.8'
                            }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    ✅ <strong>Supported formats:</strong> PDF, DOCX, TXT
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    📏 <strong>Maximum size:</strong> 1GB per file
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    🔒 <strong>Privacy:</strong> Your documents are secure
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    🤖 <strong>Processing:</strong> AI extracts text automatically
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    ❓ <strong>Usage:</strong> Ask questions after upload
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Document List Section */}
                    <div>
                        <DocumentList refreshTrigger={refreshTrigger} />
                        
                        {/* Tips */}
                        <div className="card mt-3">
                            <div className="card-header">
                                <h3 className="card-title">💡 Tips</h3>
                            </div>
                            <ul style={{ 
                                listStyle: 'none', 
                                padding: 0,
                                lineHeight: '1.8'
                            }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    📝 <strong>Clear text:</strong> Ensure documents have readable text
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    🎯 <strong>Relevant content:</strong> Upload documents you want to query
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    🔍 <strong>Organization:</strong> Use descriptive filenames
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    ⚡ <strong>Processing:</strong> Large files may take longer to process
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Features Overview */}
                <div className="card mt-4">
                    <div className="card-header">
                        <h3 className="card-title">🚀 What You Can Do</h3>
                    </div>
                    <div className="grid grid-3">
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Upload</h4>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                Drag & drop or click to upload your documents
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Process</h4>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                AI automatically extracts and chunks your content
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❓</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Query</h4>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                Ask questions and get intelligent answers
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documents;