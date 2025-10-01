import React, { createContext, useReducer, useContext } from 'react';

// --- Initial State and Reducer ---
const initialState = {
  documents: [],
  messages: [
    {
      id: 'system-welcome',
      type: 'system',
      content: 'Welcome! Upload your healthcare documents to begin chatting about their content.',
      timestamp: new Date().toISOString(), 
    },
  ],
  isDisclaimerAccepted: false,
  isLoading: false,
  error: null,
  previewDocument: null,
  previewCitations: null,
};

const documentChatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ACCEPT_DISCLAIMER':
      return { ...state, isDisclaimerAccepted: true };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
      };
    case 'SHOW_PREVIEW':
        return {
            ...state,
            previewDocument: state.documents.find(doc => doc.name === action.payload.docName),
            previewCitations: action.payload.citations,
        };
    case 'CLOSE_PREVIEW':
        return { ...state, previewDocument: null, previewCitations: null };
    // NEW CASE: Resets messages array to only the first message (welcome message)
    case 'CLEAR_CHAT':
      // Safety check: ensure the welcome message exists before trying to clear
      const welcomeMessage = state.messages.length > 0 ? state.messages[0] : initialState.messages[0];
      return { 
        ...state, 
        messages: [welcomeMessage] 
      };
    default:
      return state;
  }
};

// --- Context and Provider ---
const DocumentChatContext = createContext();

export const DocumentChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentChatReducer, initialState);

  // Actions wrapped for easy use
  const actions = {
    setDocuments: (docs) => dispatch({ type: 'SET_DOCUMENTS', payload: docs }),
    addMessage: (message) => dispatch({ type: 'ADD_MESSAGE', payload: message }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    acceptDisclaimer: () => dispatch({ type: 'ACCEPT_DISCLAIMER' }),
    deleteDocument: (id) => dispatch({ type: 'DELETE_DOCUMENT', payload: id }),
    showPreview: (docName, citations) => dispatch({ type: 'SHOW_PREVIEW', payload: { docName, citations } }),
    closePreview: () => dispatch({ type: 'CLOSE_PREVIEW' }),
    clearChat: () => dispatch({ type: 'CLEAR_CHAT' }), // <-- ADDED clearChat ACTION
  };

  return (
    <DocumentChatContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </DocumentChatContext.Provider>
  );
};

// --- Hook for easy consumption ---
export const useDocumentChat = () => useContext(DocumentChatContext);