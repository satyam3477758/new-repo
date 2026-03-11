package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

// ─── CORS Middleware ──────────────────────────────────────────────────────────

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "*"
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-Info, Apikey")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// ─── Helper: JSON error response ─────────────────────────────────────────────

func jsonError(w http.ResponseWriter, msg string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

// ─── Helper: Proxy to OpenRouter ─────────────────────────────────────────────

func proxyToOpenRouter(w http.ResponseWriter, body []byte, apiKey string) {
	req, err := http.NewRequest("POST", "https://openrouter.ai/api/v1/chat/completions", bytes.NewReader(body))
	if err != nil {
		jsonError(w, "Failed to create request: "+err.Error(), http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("HTTP-Referer", "https://agroconnect.app")
	req.Header.Set("X-Title", "AgroConnect")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		jsonError(w, "OpenRouter request failed: "+err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		jsonError(w, "Failed to read response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)
}

// ─── POST /api/ai ────────────────────────────────────────────────────────────
// Generic AI chat proxy — accepts model, messages, max_tokens, temperature

func handleAI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		jsonError(w, "OPENROUTER_API_KEY environment variable is not set", http.StatusInternalServerError)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		jsonError(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	proxyToOpenRouter(w, body, apiKey)
}

// ─── POST /api/analyze-image ─────────────────────────────────────────────────
// Image analysis endpoint — accepts imageData (base64) and optional prompt

type analyzeImageRequest struct {
	ImageData string `json:"imageData"`
	Prompt    string `json:"prompt,omitempty"`
}

func handleAnalyzeImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		jsonError(w, "OPENROUTER_API_KEY environment variable is not set", http.StatusInternalServerError)
		return
	}

	var req analyzeImageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if req.ImageData == "" {
		jsonError(w, "No image data provided", http.StatusBadRequest)
		return
	}

	prompt := req.Prompt
	if prompt == "" {
		prompt = "Analyze this agricultural image briefly: 1) Crop type, 2) Health status, 3) Growth stage, 4) Visible issues, 5) Recommendations. Be concise."
	}

	// Build OpenRouter request for vision model
	openRouterBody := map[string]interface{}{
		"model": "openai/gpt-4o-mini",
		"messages": []map[string]interface{}{
			{
				"role": "user",
				"content": []map[string]interface{}{
					{"type": "text", "text": prompt},
					{"type": "image_url", "image_url": map[string]string{"url": req.ImageData, "detail": "auto"}},
				},
			},
		},
		"max_tokens":  300,
		"temperature": 0.2,
	}

	body, err := json.Marshal(openRouterBody)
	if err != nil {
		jsonError(w, "Failed to build request", http.StatusInternalServerError)
		return
	}

	proxyToOpenRouter(w, body, apiKey)
}

// ─── Health check ────────────────────────────────────────────────────────────

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// ─── Main ────────────────────────────────────────────────────────────────────

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/ai", corsMiddleware(handleAI))
	mux.HandleFunc("/api/analyze-image", corsMiddleware(handleAnalyzeImage))
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{
				"service": "AgroConnect Backend",
				"status":  "running",
				"routes":  strings.Join([]string{"/api/ai", "/api/analyze-image", "/health"}, ", "),
			})
			return
		}
		http.NotFound(w, r)
	})

	addr := fmt.Sprintf(":%s", port)
	log.Printf("🚀 AgroConnect backend starting on %s", addr)
	log.Printf("   Routes: POST /api/ai, POST /api/analyze-image, GET /health")

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
