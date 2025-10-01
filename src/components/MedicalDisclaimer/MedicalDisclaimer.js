import React from 'react';
import styled from 'styled-components';
import { useDocumentChat } from '../../context/DocumentChatContext';

// --- Styled Components ---
const DisclaimerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

const DisclaimerCard = styled.div`
  background: white;
  color: #333;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  border-top: 5px solid #dc3545;
`;

const AcceptButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 25px;
  margin-top: 25px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.1s;

  &:hover {
    background-color: #0056b3;
  }
  &:active {
      transform: scale(0.98);
  }
`;

/**
 * @component
 * Prominently displays a medical disclaimer that must be accepted to use the app.
 */
const MedicalDisclaimer = () => {
  const { actions } = useDocumentChat();

  return (
    <DisclaimerWrapper>
      <DisclaimerCard>
        <h2>⚠️ Medical Disclaimer ⚠️</h2>
        <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
          This application is for informational purposes only.
        </p>
        <p>
          It is not intended to be a substitute for professional **medical advice**, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.
        </p>
        <p style={{ fontSize: '14px', marginTop: '20px' }}>
          By clicking 'I Understand and Accept', you agree to our terms and acknowledge that you will not use this tool for making medical decisions.
        </p>
        <AcceptButton onClick={actions.acceptDisclaimer}>
          I Understand and Accept
        </AcceptButton>
      </DisclaimerCard>
    </DisclaimerWrapper>
  );
};

export default MedicalDisclaimer;