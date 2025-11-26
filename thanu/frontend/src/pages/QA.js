import React, { useState } from 'react';
import DocumentList from '../components/DocumentList';
import QAInterface from '../components/QAInterface';

const QA = () => {
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleDocumentSelect = (document) => {
        setSelectedDocument(document);
    };

    return (
        <div className="main-content">
            <div className="container">
                <div className="mb-4">
                    <h1 style={{ color: 'var(--black)', marginBottom: '0.5rem' }}>
                        AI Q&A Interface ❓
                    </h1>
                    <p style={{ color: 'var(--gray-600)' }}>
                        Select a document and ask intelligent questions powered by AI
                    </p>
                </div>

                <div className="grid grid-2">
                    {/* Document Selection */}
                    <div>
                        <DocumentList 
                            onDocumentSelect={handleDocumentSelect}
                            refreshTrigger={0}
                        />
                        
                        {/* Q&A Tips */}
                        <div className="card mt-3">
                            <div className="card-header">
                                <h3 className="card-title">💡 Q&A Tips</h3>
                            </div>
                            <ul style={{ 
                                listStyle: 'none', 
                                padding: 0,
                                lineHeight: '1.8'
                            }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    🎯 <strong>Be specific:</strong> Ask clear, focused questions
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    📝 <strong>Context matters:</strong> Questions about document content work best
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    🔍 <strong>Try different angles:</strong> Rephrase if needed
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    📊 <strong>Summaries:</strong> Generate document overviews
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    📚 <strong>History:</strong> Review past Q&A sessions
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Q&A Interface */}
                    <div>
                        <QAInterface selectedDocument={selectedDocument} />
                    </div>
                </div>

                {/* Example Questions */}
                {selectedDocument && (
                    <div className="card mt-4">
                        <div className="card-header">
                            <h3 className="card-title">💭 Example Questions</h3>
                        </div>
                        <div className="grid grid-2">
                            <div>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>
                                    General Questions:
                                </h4>
                                <ul style={{ 
                                    listStyle: 'none', 
                                    padding: 0,
                                    lineHeight: '1.6'
                                }}>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "What is the main topic of this document?"
                                    </li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "Can you summarize the key points?"
                                    </li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "What are the important dates mentioned?"
                                    </li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "Who are the main people or organizations?"
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>
                                    Specific Questions:
                                </h4>
                                <ul style={{ 
                                    listStyle: 'none', 
                                    padding: 0,
                                    lineHeight: '1.6'
                                }}>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "What does the document say about [topic]?"
                                    </li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "Find information about [specific term]"
                                    </li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "What are the requirements for [process]?"
                                    </li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        • "Explain the relationship between [A] and [B]"
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Features */}
                <div className="card mt-4">
                    <div className="card-header">
                        <h3 className="card-title">🤖 AI Features</h3>
                    </div>
                    <div className="grid grid-3">
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Smart Understanding</h4>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                AI understands context and provides relevant answers
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Document Summaries</h4>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                Generate comprehensive summaries of your documents
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Q&A History</h4>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                                Keep track of all your questions and answers
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QA;