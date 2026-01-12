import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FileUpload.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FileUpload = ({ onRefinementComplete, loading, setLoading }) => {
  const [textContent, setTextContent] = useState('');
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  const onImageDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    setImages(prev => [...prev, ...imageFiles]);
    toast.success(`${imageFiles.length} image(s) added`);
  }, []);

  const onDocumentDrop = useCallback((acceptedFiles) => {
    const docFiles = acceptedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    setDocuments(prev => [...prev, ...docFiles]);
    toast.success(`${docFiles.length} document(s) added`);
  }, []);

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive
  } = useDropzone({
    onDrop: onImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: true
  });

  const {
    getRootProps: getDocRootProps,
    getInputProps: getDocInputProps,
    isDragActive: isDocDragActive
  } = useDropzone({
    onDrop: onDocumentDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!textContent.trim() && images.length === 0 && documents.length === 0) {
      toast.error('Please provide at least one input (text, image, or document)');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    if (textContent.trim()) {
      formData.append('textContent', textContent);
    }

    images.forEach((image, index) => {
      formData.append('images', image);
    });

    documents.forEach((doc, index) => {
      formData.append('documents', doc);
    });

    try {
      const response = await axios.post(`${API_URL}/prompt/refine`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Prompt refined successfully!');
        onRefinementComplete(response.data.refinedPrompt);
        // Reset form
        setTextContent('');
        setImages([]);
        setDocuments([]);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to refine prompt';
      toast.error(errorMessage);
      console.error('Refinement error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload-container">
      <h2>Input Your Requirements</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        {/* Text Input */}
        <div className="input-section">
          <label htmlFor="textContent">Text Description</label>
          <textarea
            id="textContent"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Enter your project requirements, ideas, or specifications here..."
            rows="6"
            className="text-input"
          />
        </div>

        {/* Image Upload */}
        <div className="input-section">
          <label>Images (Sketches, Screenshots, Designs)</label>
          <div
            {...getImageRootProps()}
            className={`dropzone ${isImageDragActive ? 'active' : ''}`}
          >
            <input {...getImageInputProps()} />
            <p>
              {isImageDragActive
                ? 'Drop images here...'
                : 'Drag & drop images here, or click to select'}
            </p>
            <small>Supports: JPEG, PNG, GIF</small>
          </div>
          {images.length > 0 && (
            <div className="file-list">
              {images.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document Upload */}
        <div className="input-section">
          <label>Documents (PDF, Word)</label>
          <div
            {...getDocRootProps()}
            className={`dropzone ${isDocDragActive ? 'active' : ''}`}
          >
            <input {...getDocInputProps()} />
            <p>
              {isDocDragActive
                ? 'Drop documents here...'
                : 'Drag & drop documents here, or click to select'}
            </p>
            <small>Supports: PDF, DOC, DOCX</small>
          </div>
          {documents.length > 0 && (
            <div className="file-list">
              {documents.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Processing...' : 'Refine Prompt'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;

