import React from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { useDocumentChat } from '../../context/DocumentChatContext';

// --- Styled Components ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  height: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
`;

const ModalHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: #007bff;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: 'Georgia', serif;
  line-height: 1.6;
  font-size: 16px;
`;

const CitationInfo = styled.p`
  font-size: 14px;
  color: #dc3545;
  margin-top: 10px;
  border-left: 3px solid #dc3545;
  padding-left: 10px;
`;


// --- Helper Function ---
// Simple content highlighting logic
const highlightContent = (content, citations) => {
    // For this mock, we'll try to highlight keywords based on common mock responses
    const keywords = ['Lisinopril 10mg', 'Penicillin', 'Hypertension', 'follow-up in 2 weeks', 'high cholesterol', 'Vitamin D'];
    
    // Convert content to JSX with highlights
    let html = content;
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        html = html.replace(regex, `<span class="highlight-citation">$1</span>`);
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};


/**
 * @component
 * Modal component to display the document content and highlight cited text.
 */
const DocumentPreview = () => {
  const { state, actions } = useDocumentChat();

  if (!state.previewDocument) return null;

  const doc = state.previewDocument;
  const citations = state.previewCitations;
  const citationList = citations ? citations.join('; ') : 'N/A';
  
  // Style for the highlighted text (must be outside Styled Components for dynamic rendering)
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `.highlight-citation { background-color: #ffeb3b; padding: 2px 0; font-weight: bold; border-radius: 2px; }`;
  document.head.appendChild(styleSheet);


  return (
    <Overlay onClick={actions.closePreview}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h3>Document Preview: {doc.name}</h3>
          <CloseButton onClick={actions.closePreview}><FiX /></CloseButton>
        </ModalHeader>
        <ContentArea>
          <p style={{ fontWeight: 'bold' }}>Full Document Content:</p>
          {highlightContent(doc.content, citations)}
          <CitationInfo>
              Cited Source Location(s): {citationList}
          </CitationInfo>
          <p style={{marginTop: '20px', fontSize: '13px', color: '#6c757d'}}>
            *This is mock document content. In a real application, you would render the PDF/DOCX content here.
          </p>
        </ContentArea>
      </Modal>
    </Overlay>
  );
};

export default DocumentPreview;