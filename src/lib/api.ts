const API_BASE_URL = 'https://sayhey-chatbot.onrender.com';

export interface ChatRequest {
  message: string;
  user_id: string;
}

export interface ChatResponse {
  response: string;
}

export const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}; 