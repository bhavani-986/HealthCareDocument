import React from 'react';
import styled from 'styled-components';
import { FiFileText, FiXCircle } from 'react-icons/fi';
import { useDocumentChat } from '../../context/DocumentChatContext';

// Utility to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- Styled Components ---
const ListContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 5px;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-width: 0;
`;

const FileIcon = styled.span`
  color: #007bff;
  font-size: 20px;
  margin-right: 10px;
`;

const FileDetails = styled.div`
  overflow: hidden;
  white-space: nowrap;
`;

const FileName = styled.p`
  font-weight: bold;
  margin: 0;
  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const FileMetadata = styled.p`
  font-size: 12px;
  color: #6c757d;
  margin: 2px 0 0;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  margin-left: 15px;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: #a71d2a;
  }
`;

/**
 * @component
 * Displays the list of uploaded documents and allows for deletion.
 */
const DocumentList = () => {
  const { state, actions } = useDocumentChat();

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the document: ${name}?`)) {
      // In a real app, you'd call the delete API here, then update state on success.
      actions.deleteDocument(id);
    }
  };

  if (state.documents.length === 0) {
    return <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '20px' }}>No documents uploaded yet. Start by uploading files above.</p>;
  }

  return (
    <ListContainer>
      {state.documents.map(doc => (
        <DocumentItem key={doc.id}>
          <FileInfo>
            <FileIcon><FiFileText /></FileIcon>
            <FileDetails>
              <FileName title={doc.name}>{doc.name}</FileName>
              <FileMetadata>
                {formatFileSize(doc.size)} | {doc.type.split('/').pop().toUpperCase()} | Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
              </FileMetadata>
            </FileDetails>
          </FileInfo>
          <DeleteButton
            onClick={() => handleDelete(doc.id, doc.name)}
            title={`Delete ${doc.name}`}
          >
            <FiXCircle />
          </DeleteButton>
        </DocumentItem>
      ))}
    </ListContainer>
  );
};

export default DocumentList;