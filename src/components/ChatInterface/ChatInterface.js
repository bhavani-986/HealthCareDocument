import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend, FiTrash2 } from 'react-icons/fi'; // Import FiTrash2 for the button icon
import MessageBubble from '../MessageBubble/MessageBubble';
import LoadingSpinner from '../Shared/LoadingSpinner'; 
import { useDocumentChat } from '../../context/DocumentChatContext';

// --- Styled Components ---
const ChatContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  overflow: hidden;
  position: relative;
`;

const MessagesArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 15px; /* Space for scrollbar */
  margin-bottom: 10px;
`;

const InputArea = styled.form`
  display: flex;
  align-items: flex-end; /* Align textarea and button to the bottom */
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChatInput = styled.textarea`
  flex-grow: 1;
  border: none;
  padding: 10px;
  resize: none;
  font-size: 16px;
  max-height: 100px;
  overflow-y: auto;
  min-height: 40px;

  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-left: 10px;
  transition: background-color 0.3s;
  opacity: ${props => props.disabled ? 0.6 : 1};
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

// New Styled Component for Clear Chat Button
const ClearChatButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 5px; /* Slightly closer to chat area */
  align-self: flex-end; /* Align to the right side of ChatContainer */
  display: flex;
  align-items: center;

  &:hover {
    color: #dc3545; /* Red on hover */
  }
  
  &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
  }

  svg {
    margin-right: 5px;
  }
`;


const TypingIndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #6c757d;
  font-size: 14px;
`;

const CharacterCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${props => props.$isOverLimit ? '#dc3545' : '#6c757d'};
  padding: 5px 0 0;
`;

const ErrorBanner = styled.div`
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
`;


/**
 * @component
 * Main chat area for displaying messages and handling user input.
 */
const ChatInterface = ({ messages, onSendMessage, isLoading }) => {
  const { state, actions } = useDocumentChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const maxChars = 500;

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Clear the global error after 5 seconds if one exists
    const timer = setTimeout(() => actions.setError(null), 5000);
    return () => clearTimeout(timer);
  }, [messages, isLoading, state.error]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading) {
      onSendMessage(trimmedInput);
      setInput('');
      // Reset textarea height after sending message
      if (e.target && e.target.elements && e.target.elements[0]) {
         e.target.elements[0].style.height = '40px'; 
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Auto-adjust textarea height
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleCitationClick = (sources) => {
      // Find the document name from the first source (e.g., "discharge_summary.pdf - Page 2")
      const docName = sources[0].split(' - ')[0];
      actions.showPreview(docName, sources);
  };

  return (
    <ChatContainer>
      {state.error && <ErrorBanner>{state.error}</ErrorBanner>}
      
      {/* CLEAR CHAT BUTTON: Visible only if there is conversation history beyond the welcome message */}
      {state.messages.length > 1 && (
        <ClearChatButton onClick={actions.clearChat} disabled={isLoading}>
            <FiTrash2 size={16} /> Clear Chat History
        </ClearChatButton>
      )}

      <MessagesArea>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onCitationClick={handleCitationClick} />
        ))}
        
        {/* The isLoading typing indicator block is intentionally removed */}
        
        <div ref={messagesEndRef} />
      </MessagesArea>

      <InputArea onSubmit={handleSubmit}>
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value.substring(0, maxChars))}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents"
          rows={1}
          disabled={isLoading || state.documents.length === 0}
        />
        <SendButton type="submit" disabled={!input.trim() || isLoading || state.documents.length === 0}>
          <FiSend size={20} />
        </SendButton>
      </InputArea>
      <CharacterCount $isOverLimit={input.length === maxChars}>
        {input.length}/{maxChars} characters
      </CharacterCount>
      {state.documents.length === 0 && (
          <p style={{textAlign: 'center', color: '#dc3545', fontSize: '14px', marginTop: '5px'}}>
              Please upload documents to enable chat.
          </p>
      )}
    </ChatContainer>
  );
};

export default ChatInterface;