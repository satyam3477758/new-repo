interface AIRequestOptions {
  model: string;
  messages: Array<{
    role: string;
    content: string | Array<{ type: string; text?: string; image_url?: { url: string; detail?: string } }>;
  }>;
  max_tokens?: number;
  temperature?: number;
}

// Backend URL — defaults to Render deployment, override with VITE_BACKEND_URL if needed
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://new-repo-74oe.onrender.com';

export async function callAI(options: AIRequestOptions): Promise<string> {
  // Proxy through backend to keep API key secret
  const response = await fetch(`${BACKEND_URL}/api/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error(`AI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message;
  
  // Some models return content directly, others use reasoning field
  const content = message?.content || message?.reasoning || null;

  if (!content) {
    console.error('Unexpected AI response structure:', JSON.stringify(data));
    throw new Error('Empty response from AI');
  }

  return content;
}
