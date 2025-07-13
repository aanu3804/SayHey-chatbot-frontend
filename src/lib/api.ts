
const API_BASE_URL = (import.meta as any).env.DEV 
  ? 'http://127.0.0.1:5000' 
  : 'https://sayhey-chatbot.onrender.com';

export interface ChatRequest {
  message: string;
  user_id: string;
}

export interface ChatResponse {
  response: string;
  session_cancelled?: boolean;
}

export const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  console.log('Sending request to:', `${API_BASE_URL}/chat`);
  console.log('Request payload:', request);
  
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,
    },
    credentials: 'omit',
    body: JSON.stringify(request)
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response body:', errorText);
    
    // Try to parse the error response as JSON
    try {
      const errorData = JSON.parse(errorText);
      // If the response contains a valid response field, return it instead of throwing
      if (errorData.response && errorData.session_cancelled !== undefined) {
        return errorData;
      }
    } catch (e) {
      // If it's not JSON, throw the original error
    }
    
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return response.json();
}; 