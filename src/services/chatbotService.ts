import { chatbotFAQs, type ChatbotFAQ, type ChatbotFAQCategory } from "@/data/chatbot-faq";
import { chatbotConfig } from "@/config/chatbot";
import { handleChatServerMessage } from "@/services/apiChatServer";
import { detectConversationalIntent } from "@/services/intentDetector";

export interface ChatbotResponse {
  text: string;
  isFallback?: boolean;
  hasContactAction?: boolean;
  showFinalActions?: boolean;
  meetingConfig?: typeof chatbotConfig.meeting;
  faqId?: string;
  category?: string;
  suggestions?: string[];
}

/**
 * Searches local Krait Abyss knowledge base with keyword and fuzzy matching.
 */
export function findFAQMatch(userQuery: string): ChatbotFAQ | null {
  const query = userQuery.toLowerCase().trim();
  if (!query) return null;

  const words = query
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  let bestFAQ: ChatbotFAQ | null = null;
  let highestScore = 0;

  for (const faq of chatbotFAQs) {
    let score = 0;
    const faqQ = faq.question.toLowerCase();

    // 1. Exact or near-exact question match
    if (query === faqQ) {
      score += 100;
    } else if (query.includes(faqQ) || faqQ.includes(query)) {
      score += 50;
    }

    // 2. Keyword match scoring
    for (const keyword of faq.keywords) {
      const kw = keyword.toLowerCase();
      if (query === kw) {
        score += 35;
      } else if (query.includes(kw)) {
        score += 15 + kw.length * 2;
      } else {
        // Partial word match
        for (const word of words) {
          if (word === kw || kw.includes(word)) {
            score += 8;
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestFAQ = faq;
    }
  }

  // Threshold required for a confident local match
  if (highestScore >= 16 && bestFAQ) {
    return bestFAQ;
  }

  return null;
}

/**
 * Generates context-aware smart follow-up suggestions for the EXPLORE phase.
 */
export function getCategorySuggestions(category?: ChatbotFAQCategory | string): string[] {
  switch (category) {
    case "AI/ML":
    case "AI Agents":
    case "Automation":
      return [
        "Do you build AI agents?",
        "Do you work with LLMs?",
        "Can you integrate AI into websites?",
        "Do you build websites?",
        "How can I work with Krait Abyss?",
      ];
    case "Web Development":
    case "UI/UX":
    case "Websites":
      return [
        "Do you create UI/UX designs?",
        "Can you build web applications?",
        "Do you build SaaS platforms?",
        "Do you provide AI solutions?",
        "How can I work with Krait Abyss?",
      ];
    case "Software Development":
    case "SaaS":
    case "Backend":
    case "APIs":
    case "AWS/Cloud":
    case "Database":
      return [
        "Can you add payment systems?",
        "Do you work with AWS?",
        "Do you provide backend development?",
        "Who handles backend?",
        "How can I work with Krait Abyss?",
      ];
    case "Team":
      return [
        "What services do you provide?",
        "What type of projects do you work on?",
        "How can I work with Krait Abyss?",
        "How to contact the team?",
      ];
    case "Digital Marketing":
    case "Social Media":
    case "Research":
      return [
        "Do you build websites?",
        "Do you provide AI solutions?",
        "Who handles digital marketing?",
        "How can I work with Krait Abyss?",
      ];
    default:
      return [
        "What services do you provide?",
        "Do you build websites?",
        "Do you provide AI solutions?",
        "Who is in the team?",
        "How can I work with Krait Abyss?",
      ];
  }
}

/**
 * Main Chatbot Service query handler.
 * Priority Flow:
 * 1. Action & Intent Detection (Meeting, Next Steps, Contact, Greetings, Thanks, More Info).
 * 2. Local FAQ Knowledge Base search (50+ entries).
 * 3. Optional Server LLM fallback.
 * 4. Controlled Contact Fallback (when genuinely unknown).
 */
export async function getChatbotResponse(
  userMessage: string,
  lastCategory?: string,
): Promise<ChatbotResponse> {
  const trimmed = userMessage.trim();

  // 1. Detect Action & Conversational Intent Layer FIRST
  const intentRes = detectConversationalIntent(trimmed);

  // A. MEETING REQUEST INTENT
  if (intentRes.intent === "MEETING_REQUEST") {
    if (chatbotConfig.meeting.enabled && chatbotConfig.meeting.bookingUrl.trim().length > 0) {
      return {
        text: "Absolutely. You can schedule a meeting with the Krait Abyss team to discuss your project, requirements, or collaboration.",
        showFinalActions: true,
        meetingConfig: chatbotConfig.meeting,
      };
    } else {
      return {
        text: "Meeting scheduling isn't configured yet, but our team can arrange a meeting with you directly.",
        showFinalActions: true,
        hasContactAction: true,
      };
    }
  }

  // B. NEXT STEPS / CONVERSION INTENT
  if (intentRes.intent === "NEXT_STEPS_REQUEST") {
    return {
      text: "Absolutely! If you'd like to discuss a project or collaboration, you can connect with the Krait Abyss team in either of these ways:",
      showFinalActions: true,
    };
  }

  // C. ISSUE / SUPPORT REQUEST INTENT
  if (intentRes.intent === "ISSUE_SUPPORT_REQUEST") {
    return {
      text: `If you are facing an issue or need direct support, you can reach out to us directly:\n\n✉️ Direct Email: ${chatbotConfig.contactEmail}\n💬 WhatsApp: ${chatbotConfig.whatsappNumber} (${chatbotConfig.whatsappNotice})`,
      hasContactAction: true,
      showFinalActions: true,
    };
  }

  // D. CONTACT REQUEST INTENT
  if (intentRes.intent === "CONTACT_REQUEST") {
    return {
      text: `Sure! You can reach the Krait Abyss team directly via email or WhatsApp:\n\n✉️ Direct Email: ${chatbotConfig.contactEmail}\n💬 WhatsApp: ${chatbotConfig.whatsappNumber} (${chatbotConfig.whatsappNotice})`,
      hasContactAction: true,
      showFinalActions: true,
    };
  }

  // D. GREETINGS & ACKNOWLEDGEMENTS
  if (intentRes.intent === "GREETING") {
    return {
      text: "Hey! 👋 I'm the Krait Assistant. What would you like to explore?",
      suggestions: [
        "What services do you provide?",
        "Do you build websites?",
        "Do you provide AI solutions?",
        "Who is in the team?",
        "How can I work with Krait Abyss?",
      ],
    };
  }

  if (intentRes.intent === "ACKNOWLEDGEMENT") {
    return {
      text: "Glad to help! What would you like to know next?",
      suggestions: [
        "What services do you provide?",
        "Do you build websites?",
        "Do you provide AI solutions?",
        "Who is in the team?",
        "How can I work with Krait Abyss?",
      ],
    };
  }

  if (intentRes.intent === "THANKS") {
    return {
      text: "You're welcome! If you'd like to explore more, you can ask me about our services, development, AI solutions, team, or how to work with Krait Abyss.",
      suggestions: [
        "What services do you provide?",
        "Who is in the team?",
        "How can I work with Krait Abyss?",
        "How to contact the team?",
      ],
    };
  }

  if (intentRes.intent === "MORE_INFORMATION") {
    const contextualLead = lastCategory
      ? `Besides ${lastCategory.toLowerCase()}, here are some other things you can ask me about:`
      : "Sure! Here are some other things you can ask me about:";

    return {
      text: contextualLead,
      suggestions: [
        "Do you provide AI solutions?",
        "Do you build SaaS platforms?",
        "Do you work with AWS?",
        "Who is in the team?",
        "How can I work with Krait Abyss?",
      ],
    };
  }

  if (intentRes.intent === "WHAT_CAN_YOU_DO") {
    return {
      text: "I can help you explore Krait Abyss, including our services, web and software development, AI/ML, SaaS, backend and cloud work, digital marketing, research, team responsibilities, and how to contact or work with us.",
      suggestions: [
        "What services do you provide?",
        "Do you build websites?",
        "Do you provide AI solutions?",
        "Who is in the team?",
        "How can I work with Krait Abyss?",
      ],
    };
  }

  // 2. Search FAQ Knowledge Base
  const matchedFAQ = findFAQMatch(trimmed);

  if (matchedFAQ) {
    // If the matched question is specifically about working with us or contacting us, trigger final actions
    if (matchedFAQ.id.includes("collaboration") || matchedFAQ.id.includes("contact")) {
      return {
        text: matchedFAQ.answer,
        showFinalActions: true,
        hasContactAction: Boolean(matchedFAQ.hasContactAction),
        faqId: matchedFAQ.id,
        category: matchedFAQ.category,
      };
    }

    const suggestions =
      matchedFAQ.relatedSuggestions || getCategorySuggestions(matchedFAQ.category);
    return {
      text: matchedFAQ.answer,
      hasContactAction: Boolean(matchedFAQ.hasContactAction),
      faqId: matchedFAQ.id,
      category: matchedFAQ.category,
      suggestions,
    };
  }

  // 3. Optional Server LLM Call
  try {
    const res = await handleChatServerMessage({ data: { message: trimmed } });
    if (res && res.text && !res.isFallback) {
      return {
        text: res.text,
        hasContactAction: Boolean((res as any)?.hasContactAction),
        suggestions: getCategorySuggestions(lastCategory),
      };
    }
  } catch {
    // Server function unconfigured or unavailable; safely proceed to controlled fallback
  }

  // 4. Controlled Fallback State (Exact required wording)
  return {
    text: "I don't have enough information to answer that accurately, but our help team can help you with it.",
    isFallback: true,
    showFinalActions: true,
    hasContactAction: true,
  };
}
