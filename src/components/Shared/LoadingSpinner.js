import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  animation: ${rotate} 2s linear infinite;
  display: inline-block;
`;

const LoadingSpinner = ({ size }) => {
  return <Spinner size={size} />;
};

export default LoadingSpinner;