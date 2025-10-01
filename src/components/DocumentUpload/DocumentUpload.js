import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiUploadCloud } from 'react-icons/fi';

// --- Constants ---
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// --- Styled Components ---
const Dropzone = styled.div`
  border: 2px dashed ${props => props.$isDragging ? '#007bff' : '#ccc'};
  border-radius: 8px;
  padding: 25px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
  background-color: ${props => props.$isDragging ? '#f0f8ff' : 'white'};
  margin-bottom: 15px;

  &:hover {
    border-color: #007bff;
  }
`;

const IconWrapper = styled.div`
  font-size: 36px;
  color: #007bff;
  margin-bottom: 5px;
`;

const UploadMessage = styled.p`
  color: #6c757d;
  font-size: 13px;
  margin: 5px 0 0;
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

/**
 * @component
 * Handles file drag-and-drop and selection for document upload.
 */
const DocumentUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const validateFile = (file) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setUploadError(`Invalid type. Only PDF, DOCX, and TXT are allowed.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File is too large. Max size is 5MB.`);
      return false;
    }
    setUploadError('');
    return true;
  };

  const handleFiles = useCallback((files) => {
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  return (
    <>
      <Dropzone
        $isDragging={isDragging}
        onDragOver={handleDragEnter}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-input').click()}
      >
        <IconWrapper><FiUploadCloud /></IconWrapper>
        <p style={{ fontWeight: 'bold', margin: '0' }}>Drag 'n' drop here, or click to select</p>
        <UploadMessage>
          (PDF, DOCX, TXT | Max 5MB)
        </UploadMessage>
        <FileInput
          id="file-upload-input"
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
        />
      </Dropzone>
      {uploadError && <p style={{ color: '#dc3545', fontSize: '13px', marginTop: '-10px' }}>{uploadError}</p>}
    </>
  );
};

export default DocumentUpload;