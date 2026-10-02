/**
 * Server AI Provider & Model Configuration for Krait Assistant.
 *
 * To enable AI responses:
 * 1. Add your LLM API key to .env (e.g. LLM_API_KEY=your_api_key_here)
 * 2. Configure the provider and model settings below.
 */
export const serverAiConfig = {
  provider: (process.env["AI_PROVIDER"] || "groq") as "openai" | "anthropic" | "groq" | "custom",
  apiKey: process.env["GROQ_API_KEY"] || process.env["LLM_API_KEY"] || "",
  model: process.env["AI_MODEL"] || "llama-3.3-70b-versatile",
  baseUrl:
    process.env["AI_BASE_URL"] ||
    ((process.env["GROQ_API_KEY"] || process.env["LLM_API_KEY"])?.startsWith("gsk_")
      ? "https://api.groq.com/openai/v1"
      : "https://api.openai.com/v1"),
  enabled: Boolean(
    (process.env["GROQ_API_KEY"] || process.env["LLM_API_KEY"]) &&
      !(process.env["GROQ_API_KEY"] || process.env["LLM_API_KEY"])?.includes("your_server_only") &&
      ((process.env["GROQ_API_KEY"] || process.env["LLM_API_KEY"])?.trim().length ?? 0) > 10,
  ),
  systemPrompt: `You are Krait Assistant, the official website assistant for Krait Abyss technology studio.
Answer concisely, professionally, and accurately using ONLY the provided Krait Abyss context.
Do NOT invent company facts, team members, or services.
If the information is not provided in the context or you cannot answer reliably, state clearly that you don't have enough information to answer accurately.`,
};
