import { createServerFn } from "@tanstack/react-start";
import { serverAiConfig } from "../../server/config/ai";
import { chatbotFAQs } from "@/data/chatbot-faq";

// In-memory rate limiter (10 requests per 60 seconds)
const chatRateLimitTracker = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(key: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = chatRateLimitTracker.get(key);
  if (!record || now > record.resetTime) {
    chatRateLimitTracker.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  if (record.count >= limit) {
    return true;
  }
  record.count += 1;
  return false;
}

const FALLBACK_RESPONSE = {
  isFallback: true,
  hasContactAction: true,
  text: "I don't have enough information to answer that accurately, but our help team can help you with it.",
};

export const handleChatServerMessage = createServerFn({ method: "POST" })
  .validator((data: { message: string; clientIp?: string }) => data)
  .handler(async ({ data }) => {
    const rawMessage = data?.message;

    // 1. Validation & Input Length Limit
    if (!rawMessage || typeof rawMessage !== "string" || rawMessage.trim().length === 0) {
      return { error: "Invalid message payload." };
    }

    const trimmed = rawMessage.trim();

    if (trimmed.length > 500) {
      return {
        isFallback: true,
        text: "Your message exceeds the maximum allowed length (500 characters). Please shorten your question.",
      };
    }

    // 2. Rate Limiting Check
    const rateKey = data?.clientIp || "global_chat_client";
    if (isRateLimited(rateKey)) {
      return {
        isFallback: true,
        text: "You are sending questions too quickly. Please wait a minute before trying again.",
      };
    }

    // 3. Check if LLM API Key is configured in server environment
    if (!serverAiConfig.enabled || !serverAiConfig.apiKey) {
      return FALLBACK_RESPONSE;
    }

    // 4. Execute Timed LLM API Request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s request timeout

    try {
      // eslint-disable-next-line no-control-regex
      const sanitizedUserQuery = trimmed.replace(/[\x00-\x1F\x7F]/g, "");
      const endpointUrl = `${serverAiConfig.baseUrl.replace(/\/+$/, "")}/chat/completions`;

      const aiResponse = await fetch(endpointUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverAiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: serverAiConfig.model,
          messages: [
            { role: "system", content: serverAiConfig.systemPrompt },
            {
              role: "user",
              content: `Context: ${JSON.stringify(chatbotFAQs)}\nUser Question: ${sanitizedUserQuery}`,
            },
          ],
          max_tokens: 250,
          temperature: 0.2,
        }),
      });

      clearTimeout(timeoutId);

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const reply = aiData.choices?.[0]?.message?.content;
        if (reply && typeof reply === "string") {
          return { text: reply.trim(), isFallback: false };
        }
      }
    } catch {
      clearTimeout(timeoutId);
    }

    return FALLBACK_RESPONSE;
  });
