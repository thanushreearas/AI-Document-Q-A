import React, { useState, useEffect } from 'react';
import { qaAPI } from '../utils/api';
import { toast } from 'react-toastify';

const QAInterface = ({ selectedDocument }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [summary, setSummary] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);

    useEffect(() => {
        if (selectedDocument) {
            fetchHistory();
            setSummary('');
        }
    }, [selectedDocument]);

    const fetchHistory = async () => {
        if (!selectedDocument) return;
        
        try {
            const response = await qaAPI.getHistory(selectedDocument.document_id);
            setHistory(response.data.history);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        
        if (!question.trim()) {
            toast.error('Please enter a question');
            return;
        }

        if (!selectedDocument) {
            toast.error('Please select a document first');
            return;
        }

        setLoading(true);
        
        try {
            const response = await qaAPI.ask({
                question: question.trim(),
                document_id: selectedDocument.document_id
            });

            setAnswer(response.data.answer);
            setQuestion('');
            
            // Refresh history
            fetchHistory();
            
            toast.success('Question answered successfully!');
        } catch (error) {
            console.error('Error asking question:', error);
            toast.error(error.response?.data?.error || 'Failed to get answer');
        } finally {
            setLoading(false);
        }
    };

    const handleSummarize = async () => {
        if (!selectedDocument) {
            toast.error('Please select a document first');
            return;
        }

        setSummaryLoading(true);
        
        try {
            const response = await qaAPI.summarize(selectedDocument.document_id);
            setSummary(response.data.summary);
            toast.success('Summary generated successfully!');
        } catch (error) {
            console.error('Error generating summary:', error);
            toast.error(error.response?.data?.error || 'Failed to generate summary');
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleDeleteHistory = async (qaId) => {
        try {
            await qaAPI.deleteHistory(qaId);
            setHistory(history.filter(item => item.qa_id !== qaId));
            toast.success('Q&A record deleted');
        } catch (error) {
            console.error('Error deleting history:', error);
            toast.error('Failed to delete record');
        }
    };

    if (!selectedDocument) {
        return (
            <div className="card">
                <div className="text-center p-4">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❓</div>
                    <h3>Select a Document</h3>
                    <p style={{ color: 'var(--gray-600)' }}>
                        Choose a document from the list to start asking questions
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-2">
            {/* Document Info */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📄 {selectedDocument.filename}</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSummarize}
                        disabled={summaryLoading}
                        className="btn btn-secondary"
                    >
                        {summaryLoading ? 'Generating...' : 'Generate Summary'}
                    </button>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">📋 Document Summary</h4>
                    </div>
                    <div style={{ 
                        padding: '1rem',
                        backgroundColor: 'var(--bg-blue)',
                        borderRadius: '0.5rem',
                        lineHeight: '1.6'
                    }}>
                        {summary}
                    </div>
                </div>
            )}

            {/* Q&A Interface */}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">❓ Ask a Question</h4>
                </div>
                
                <form onSubmit={handleAskQuestion}>
                    <div className="form-group">
                        <textarea
                            className="form-textarea"
                            placeholder="Ask any question about the document..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={loading}
                            rows="3"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="btn btn-primary"
                    >
                        {loading ? 'Getting Answer...' : 'Ask Question'}
                    </button>
                </form>

                {/* Current Answer */}
                {answer && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <h5 style={{ marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
                            💡 Answer:
                        </h5>
                        <div style={{ 
                            padding: '1rem',
                            backgroundColor: 'var(--bg-blue)',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid var(--primary-blue)',
                            lineHeight: '1.6'
                        }}>
                            {answer}
                        </div>
                    </div>
                )}
            </div>

            {/* Q&A History */}
            {history.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">📚 Q&A History ({history.length})</h4>
                    </div>
                    
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {history.map((item) => (
                            <div
                                key={item.qa_id}
                                style={{
                                    padding: '1rem',
                                    border: '1px solid var(--gray-200)',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    backgroundColor: 'var(--white)'
                                }}
                            >
                                <div className="flex-between mb-2">
                                    <small style={{ color: 'var(--gray-600)' }}>
                                        {new Date(item.timestamp).toLocaleString()}
                                    </small>
                                    <button
                                        onClick={() => handleDeleteHistory(item.qa_id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--error)',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                                
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <strong style={{ color: 'var(--black)' }}>Q: </strong>
                                    {item.question}
                                </div>
                                
                                <div>
                                    <strong style={{ color: 'var(--primary-blue)' }}>A: </strong>
                                    {item.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QAInterface;