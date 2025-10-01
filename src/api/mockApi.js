// --- Mock Data ---
const mockDocuments = [
  {
    id: '1',
    name: 'discharge_summary.pdf',
    type: 'application/pdf',
    size: 245760,
    uploadDate: '2024-09-20T10:30:00Z',
    status: 'processed',
    content: 'Patient was prescribed Lisinopril 10mg. Diagnosis was Hypertension. Treatment plan includes follow-up in 2 weeks.',
  },
  {
    id: '2',
    name: 'lab_results.txt',
    type: 'text/plain',
    size: 50000,
    uploadDate: '2024-09-20T10:45:00Z',
    status: 'processed',
    content: 'Allergies: Penicillin. Lab results show high cholesterol and a low Vitamin D count.',
  },
];

const mockMessages = [
  {
    id: '1',
    type: 'system',
    content: 'Welcome! Upload your healthcare documents to begin chatting about their content.',
    timestamp: '2024-09-20T10:59:00Z'
  },
];

// --- Mock Utility ---
const simulateLatency = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// --- Document Endpoints ---

/**
 * GET /api/documents
 */
export const fetchDocuments = () => {
  return mockDocuments;
};

/**
 * POST /api/documents/upload
 */
export const postDocumentUpload = async (file) => {
  await simulateLatency(1500);

  // Simulate successful upload and processing
  const newDoc = {
    id: (mockDocuments.length + 1).toString(),
    name: file.name,
    type: file.type,
    size: file.size,
    uploadDate: new Date().toISOString(),
    status: 'processed',
    content: `Mock content for ${file.name}: Ready for analysis.`,
  };

  mockDocuments.push(newDoc);
  return newDoc;
};

/**
 * DELETE /api/documents/{id}
 */
export const deleteDocument = async (id) => {
  await simulateLatency(300);

  const index = mockDocuments.findIndex(doc => doc.id === id);
  if (index !== -1) {
    mockDocuments.splice(index, 1);
    return { success: true };
  }
  throw new Error('Document not found');
};

// --- Chat Endpoints ---

/**
 * GET /api/chat/history
 */
export const getChatHistory = () => {
  return mockMessages;
};

/**
 * POST /api/chat/message
 */
export const postChatMessage = async (userContent, currentDocuments) => {
  await simulateLatency(2000);

  let systemContent = `I analyzed your query: "${userContent}". `;
  let sources = [];

  const contentLower = userContent.toLowerCase();

  if (contentLower.includes('medication') || contentLower.includes('prescribed')) {
    systemContent = 'The discharge summary indicates the patient was prescribed **Lisinopril 10mg**.';
    sources = ['discharge_summary.pdf - Page 3'];
  } else if (contentLower.includes('allergies')) {
    systemContent = 'An allergy to **Penicillin** is clearly mentioned in the lab reports.';
    sources = ['lab_results.txt - Line 10'];
  } else if (contentLower.includes('diagnosis')) {
    systemContent = 'The primary diagnosis found in the discharge summary is **Hypertension**.';
    sources = ['discharge_summary.pdf - Page 1'];
  } else if (contentLower.includes('summarize') || contentLower.includes('treatment plan')) {
    systemContent = 'The treatment plan includes a **follow-up in 2 weeks** as per the discharge summary.';
    sources = ['discharge_summary.pdf - Page 5'];
  } else if (contentLower.includes('lab results')) {
    systemContent = 'The lab results show high cholesterol and a low Vitamin D count.';
    sources = ['lab_results.txt - Line 15'];
  } else {
    systemContent += 'Please be more specific or ask about medication, diagnosis, or allergies.';
  }

  const systemMessage = {
    id: Date.now().toString(),
    type: 'system',
    content: systemContent,
    timestamp: new Date().toISOString(),
    sources: sources.length > 0 ? sources : undefined,
  };

  mockMessages.push(systemMessage);
  return systemMessage;
};