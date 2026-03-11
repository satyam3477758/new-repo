const OPENROUTER_API_KEY = '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';

interface AIRequestOptions {
  model: string;
  messages: Array<{
    role: string;
    content: string | Array<{ type: string; text?: string; image_url?: { url: string; detail?: string } }>;
  }>;
  max_tokens?: number;
  temperature?: number;
}

export async function callAI(options: AIRequestOptions): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AgroConnect',
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
