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
  // Always call OpenRouter directly — works in local dev
  // In production (Vercel), the /api/ai proxy is also available but this works too
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://agroconnect.app',
      'X-Title': 'AgroConnect',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from AI');
  }

  return content;
}
