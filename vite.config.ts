import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Local dev middleware to handle /api/ai requests (mimics Vercel serverless)
function apiProxy() {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          try {
            const API_KEY = process.env.OPENROUTER_API_KEY;
            if (!API_KEY) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Set OPENROUTER_API_KEY env variable' }));
              return;
            }

            const parsed = JSON.parse(body);
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://agroconnect.app',
                'X-Title': 'AgroConnect',
              },
              body: JSON.stringify(parsed),
            });

            const data = await response.text();
            res.writeHead(response.status, { 'Content-Type': 'application/json' });
            res.end(data);
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    apiProxy(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
