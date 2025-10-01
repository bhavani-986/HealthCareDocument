import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DocumentChatProvider, useDocumentChat } from './context/DocumentChatContext';
import MedicalDisclaimer from './components/MedicalDisclaimer/MedicalDisclaimer';
import DocumentUpload from './components/DocumentUpload/DocumentUpload';
import DocumentList from './components/DocumentList/DocumentList';
import ChatInterface from './components/ChatInterface/ChatInterface';
import DocumentPreview from './components/DocumentPreview/DocumentPreview';
import LoadingSpinner from './components/Shared/LoadingSpinner';
import { fetchDocuments, postDocumentUpload, postChatMessage } from './api/mockApi'; // getChatHistory removed
import { FiLock } from 'react-icons/fi';

// --- Styled Components ---
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f4f7f9;
`;

// Left sidebar for documents
const Sidebar = styled.div`
  width: 350px;
  min-width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #eee;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 300px;
  }
  
  @media (max-width: 768px) {
    /* Hide sidebar on small mobile screens to prioritize chat */
    display: ${props => props.$isMobileView ? 'none' : 'flex'};
    width: 100%;
    position: absolute;
    z-index: 100;
  }
`;

// Main chat area
const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.header`
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #007bff;
  }
`;

const PrivacyIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #28a745;
  margin-top: 5px;
  font-weight: 500;

  svg {
      margin-right: 5px;
  }
`;

const UploadStatus = styled.div`
    padding: 10px;
    background-color: #e9f7ef;
    border: 1px solid #c8e6c9;
    color: #28a745;
    border-radius: 4px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
`;

// --- Custom Hook for Responsive Design ---
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isMobile;
};

// --- Container Component with Logic ---
const DocumentChatContainer = () => {
  const { state, actions } = useDocumentChat();
  const isMobile = useIsMobile();
  const [isUploading, setIsUploading] = useState(false);
  
  // Mock document data needs to be visible to the container for initial load
  const mockDocuments = fetchDocuments();

  // Load initial data
  useEffect(() => {
    // FIX: Only load initial documents. The welcome message is now in the context's initialState.
    actions.setDocuments(fetchDocuments());
    actions.setDocuments(mockDocuments.slice(0, 1)); // Start with one doc for demonstration
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (isUploading) return;
    setIsUploading(true);
    actions.setError(null);

    try {
      // Simulate file upload with progress (not fully implemented here, just start/end)
      const newDoc = await postDocumentUpload(file);
      actions.setDocuments([...state.documents, newDoc]);
    } catch (err) {
      actions.setError('Failed to upload document. Please check file size and type.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content) => {
    actions.setError(null);

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    actions.addMessage(userMessage);
    actions.setLoading(true);

    try {
      const systemResponse = await postChatMessage(content, state.documents);
      actions.addMessage(systemResponse);
    } catch (err) {
      actions.addMessage({ ...userMessage, error: true });
      actions.setError('Failed to get response from chat AI.');
    } finally {
      actions.setLoading(false);
    }
  };


  return (
    <>
      {!state.isDisclaimerAccepted && <MedicalDisclaimer />}

      <AppContainer>
        <Sidebar $isMobileView={isMobile}>
          <h2>Document Management</h2>
          <PrivacyIndicator>
            <FiLock size={14} /> Local processing for data security
          </PrivacyIndicator>
          <div style={{margin: '15px 0'}}>
            <DocumentUpload onFileUpload={handleFileUpload} />
          </div>
          {isUploading && (
              <UploadStatus>
                  <LoadingSpinner size="16px" />
                  <span style={{marginLeft: '10px'}}>Uploading and processing file...</span>
              </UploadStatus>
          )}
          <DocumentList />
        </Sidebar>

        <ChatArea>
          <Header>
            <h1>Healthcare Document Chat</h1>
            <span style={{ fontSize: '13px', color: '#6c757d' }}>
              Information derived from uploaded documents only.
            </span>
          </Header>
          <ChatInterface
            messages={state.messages}
            onSendMessage={handleSendMessage}
            isLoading={state.isLoading}
          />
        </ChatArea>

        {/* Document Preview Modal */}
        <DocumentPreview />
      </AppContainer>
    </>
  );
};

// --- App Root ---
const App = () => (
  <DocumentChatProvider>
    <DocumentChatContainer />
  </DocumentChatProvider>
);

export default App;