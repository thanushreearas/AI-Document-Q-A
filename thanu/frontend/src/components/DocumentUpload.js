import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentsAPI } from '../utils/api';
import { toast } from 'react-toastify';

const DocumentUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Validate file size (1GB limit)
        if (file.size > 1024 * 1024 * 1024) {
            toast.error('File size must be less than 1GB');
            return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only PDF, DOCX, and TXT files are allowed');
            return;
        }

        setUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await documentsAPI.upload(formData);
            toast.success('Document uploaded successfully!');
            
            if (onUploadSuccess) {
                onUploadSuccess(response.data.document);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        multiple: false,
        disabled: uploading
    });

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Upload Document</h3>
            </div>
            
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed var(--primary-blue)',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    backgroundColor: isDragActive ? 'var(--bg-blue)' : 'var(--white)',
                    transition: 'all 0.3s'
                }}
            >
                <input {...getInputProps()} />
                
                {uploading ? (
                    <div>
                        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                        <p>Uploading and processing document...</p>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                        {isDragActive ? (
                            <p>Drop the document here...</p>
                        ) : (
                            <div>
                                <p><strong>Click to select</strong> or drag and drop a document</p>
                                <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                                    Supports PDF, DOCX, TXT files (up to 1GB)
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentUpload;