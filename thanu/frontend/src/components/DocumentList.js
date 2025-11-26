import React, { useState, useEffect } from 'react';
import { documentsAPI } from '../utils/api';
import { toast } from 'react-toastify';

const DocumentList = ({ onDocumentSelect, refreshTrigger }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, [refreshTrigger]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await documentsAPI.list();
            setDocuments(response.data.documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (documentId, filename) => {
        if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
            return;
        }

        try {
            await documentsAPI.delete(documentId);
            toast.success('Document deleted successfully');
            setDocuments(documents.filter(doc => doc.document_id !== documentId));
            
            if (selectedDoc?.document_id === documentId) {
                setSelectedDoc(null);
                if (onDocumentSelect) {
                    onDocumentSelect(null);
                }
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error('Failed to delete document');
        }
    };

    const handleSelect = (document) => {
        setSelectedDoc(document);
        if (onDocumentSelect) {
            onDocumentSelect(document);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="card">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Your Documents ({documents.length})</h3>
            </div>
            
            {documents.length === 0 ? (
                <div className="text-center p-4">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                    <p>No documents uploaded yet</p>
                    <p style={{ color: 'var(--gray-600)' }}>Upload your first document to get started</p>
                </div>
            ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {documents.map((doc) => (
                        <div
                            key={doc.document_id}
                            style={{
                                padding: '1rem',
                                border: selectedDoc?.document_id === doc.document_id 
                                    ? '2px solid var(--primary-blue)' 
                                    : '1px solid var(--gray-200)',
                                borderRadius: '0.5rem',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                backgroundColor: selectedDoc?.document_id === doc.document_id 
                                    ? 'var(--bg-blue)' 
                                    : 'var(--white)',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => handleSelect(doc)}
                        >
                            <div className="flex-between">
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ 
                                        marginBottom: '0.5rem',
                                        color: 'var(--black)',
                                        fontSize: '1rem'
                                    }}>
                                        📄 {doc.filename}
                                    </h4>
                                    <div style={{ 
                                        fontSize: '0.875rem', 
                                        color: 'var(--gray-600)',
                                        display: 'flex',
                                        gap: '1rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span>Size: {formatFileSize(doc.file_size)}</span>
                                        <span>Chunks: {doc.chunks_count}</span>
                                        <span>Uploaded: {formatDate(doc.uploaded_at)}</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(doc.document_id, doc.filename);
                                    }}
                                    className="btn btn-danger"
                                    style={{ 
                                        padding: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentList;