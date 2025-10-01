import React from 'react';
import styled, { css } from 'styled-components';
import { FiAlertTriangle, FiBookOpen } from 'react-icons/fi';

// --- Styled Components ---
const BubbleWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.$type === 'user' ? 'flex-end' : 'flex-start'};
  margin: 10px 0;
`;

const BubbleContent = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 20px;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  ${props => props.$type === 'user' && css`
    background-color: #007bff;
    color: white;
    border-bottom-right-radius: 2px;
  `}

  ${props => props.$type === 'system' && css`
    background-color: #e9ecef;
    color: #333;
    border-bottom-left-radius: 2px;
    border: 1px solid #ddd;
  `}
`;

const ContentText = styled.p`
  margin: 0;
  padding-bottom: 5px;
`;

const Timestamp = styled.span`
  display: block;
  font-size: 10px;
  text-align: ${props => props.$type === 'user' ? 'right' : 'left'};
  color: ${props => props.$type === 'user' ? 'rgba(255, 255, 255, 0.7)' : '#6c757d'};
  margin-top: 5px;
`;

const SourceCitation = styled.div`
  margin-top: 10px;
  padding: 8px 10px;
  border-top: 1px solid ${props => props.$type === 'user' ? 'rgba(255, 255, 255, 0.3)' : '#ccc'};
  font-size: 12px;
  color: ${props => props.$type === 'user' ? 'rgba(255, 255, 255, 0.9)' : '#555'};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  svg {
    margin-right: 5px;
  }

  &:hover {
    text-decoration: underline;
    background-color: ${props => props.$type === 'user' ? 'rgba(0, 0, 0, 0.1)' : '#e0e0e0'};
    border-radius: 4px;
  }
`;

const ErrorIndicator = styled(BubbleContent)`
  background-color: #f8d7da !important;
  color: #721c24 !important;
  border: 1px solid #f5c6cb !important;
  display: flex;
  align-items: center;
  max-width: 60%;
`;

/**
 * @component
 * Renders a single chat message bubble.
 */
const MessageBubble = ({ message, onCitationClick }) => {
  const { type, content, timestamp, sources, error } = message;

  const timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (error) {
    return (
      <BubbleWrapper $type={type}>
        <ErrorIndicator $type={type}>
          <FiAlertTriangle style={{ marginRight: '8px' }} />
          <span>**Error:** Message failed to send. Try again.</span>
        </ErrorIndicator>
      </BubbleWrapper>
    );
  }

  return (
    <BubbleWrapper $type={type}>
      <BubbleContent $type={type}>
        <ContentText>{content}</ContentText>
        {sources && sources.length > 0 && (
          <SourceCitation $type={type} onClick={() => onCitationClick(sources)}>
            <FiBookOpen size={14} />
            Source{sources.length > 1 ? 's' : ''} cited. Click for context.
          </SourceCitation>
        )}
        <Timestamp $type={type}>{timeString}</Timestamp>
      </BubbleContent>
    </BubbleWrapper>
  );
};

export default MessageBubble;