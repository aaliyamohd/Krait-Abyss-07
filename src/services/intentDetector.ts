export type ConversationalIntent =
  | "GREETING"
  | "ACKNOWLEDGEMENT"
  | "THANKS"
  | "MORE_INFORMATION"
  | "WHAT_CAN_YOU_DO"
  | "MEETING_REQUEST"
  | "CONTACT_REQUEST"
  | "ISSUE_SUPPORT_REQUEST"
  | "NEXT_STEPS_REQUEST"
  | "CATEGORY_REQUEST"
  | "FAQ_QUERY"
  | "UNKNOWN";

export type IntentResult = {
  intent: ConversationalIntent;
  category?: string;
};

const ISSUE_SUPPORT_PHRASES = [
  "facing an issue",
  "facing issue",
  "issue",
  "facing an error",
  "error",
  "problem",
  "bug",
  "not working",
  "help",
  "support",
  "whatsapp",
  "text",
  "direct mail",
  "mail",
  "trouble",
  "complain",
  "complaint",
];

const GREETING_PHRASES = [
  "hi",
  "hello",
  "hey",
  "hey there",
  "good morning",
  "good evening",
  "good afternoon",
  "yo",
  "greetings",
];

const ACKNOWLEDGEMENT_PHRASES = [
  "ok",
  "okay",
  "oh okay",
  "oh, okay",
  "alright",
  "got it",
  "understood",
  "cool",
  "nice",
  "makes sense",
  "k",
  "fine",
  "super",
  "awesome",
  "perfect",
];

const THANKS_PHRASES = [
  "thanks",
  "thank you",
  "thank you!",
  "thanks!",
  "thx",
  "many thanks",
  "thank u",
  "great thanks",
];

const MORE_INFO_PHRASES = [
  "what else?",
  "anything else?",
  "what else can you do?",
  "tell me more",
  "tell me something else",
  "what more?",
  "what else do you provide?",
  "anything more?",
  "next",
  "show me more",
  "more",
  "continue",
  "and?",
  "then?",
  "what next?",
  "that's it?",
  "what else",
  "anything else",
  "what more",
];

const WHAT_CAN_YOU_DO_PHRASES = [
  "what can you do?",
  "how can you help?",
  "what can i ask?",
  "what should i ask?",
  "what can you tell me?",
  "what can you do",
  "how can you help",
  "what can i ask",
];

const MEETING_PHRASES = [
  "schedule a meet",
  "schedule a meeting",
  "i want a meeting",
  "can i schedule a google meet?",
  "can we have a zoom call?",
  "book a meeting",
  "let's schedule a call",
  "can i talk to the team?",
  "can we have a meeting?",
  "i want a meeting",
  "schedule a call",
  "meet",
  "schedule",
  "book call",
  "book meet",
  "meeting",
  "google meet",
  "zoom call",
  "calendly",
  "schedule call",
  "schedule meet",
];

const CONTACT_PHRASES = [
  "contact the team",
  "send an email",
  "email the team",
  "how do i contact you?",
  "i want to contact krait abyss",
  "give me your email",
  "i want to talk to someone",
  "contact",
  "reach out",
  "email",
  "email team",
  "contact team",
  "contact us",
  "help team email",
];

const NEXT_STEPS_PHRASES = [
  "i want to work with you",
  "i want a project",
  "i want to discuss a project",
  "i want to collaborate",
  "i want to talk to the team",
  "i need more information",
  "can we discuss this?",
  "can i speak with someone?",
  "i want to hire you",
  "i want to start a project",
  "i want to contact you",
  "can we have a meeting?",
  "let's talk",
  "how do i get started?",
  "what is the next step?",
  "how can i work with krait abyss",
  "how to work with krait abyss",
  "how can i work with you",
  "work with us",
  "start a project",
  "hire",
  "next step",
  "what's next",
  "next steps",
  "how to work with us",
  "how do we start",
];

/**
 * Detects short conversational intents and action triggers BEFORE attempting FAQ keyword matching.
 */
export function detectConversationalIntent(rawMessage: string): IntentResult {
  const query = rawMessage
    .toLowerCase()
    .trim()
    .replace(/[^\w\s?]/g, "");

  // 1. Exact or pattern matches for Meeting Requests
  if (MEETING_PHRASES.some((phrase) => query === phrase || query.includes(phrase))) {
    return { intent: "MEETING_REQUEST" };
  }

  // 2. Exact or pattern matches for Next Steps / Conversion Requests
  if (NEXT_STEPS_PHRASES.some((phrase) => query === phrase || query.includes(phrase))) {
    return { intent: "NEXT_STEPS_REQUEST" };
  }

  // 3. Exact or pattern matches for Issue / Support Requests
  if (ISSUE_SUPPORT_PHRASES.some((phrase) => query === phrase || query.includes(phrase))) {
    return { intent: "ISSUE_SUPPORT_REQUEST" };
  }

  // 4. Exact or pattern matches for Contact Requests
  if (CONTACT_PHRASES.some((phrase) => query === phrase || query.includes(phrase))) {
    return { intent: "CONTACT_REQUEST" };
  }

  // 4. Greetings
  if (GREETING_PHRASES.includes(query)) {
    return { intent: "GREETING" };
  }

  // 5. Acknowledgements
  if (ACKNOWLEDGEMENT_PHRASES.includes(query)) {
    return { intent: "ACKNOWLEDGEMENT" };
  }

  // 6. Thanks
  if (THANKS_PHRASES.some((phrase) => query === phrase || query.startsWith(phrase))) {
    return { intent: "THANKS" };
  }

  // 7. More info / Tell me more
  if (MORE_INFO_PHRASES.some((phrase) => query === phrase || query.includes(phrase))) {
    return { intent: "MORE_INFORMATION" };
  }

  // 8. What can you do?
  if (WHAT_CAN_YOU_DO_PHRASES.some((phrase) => query === phrase || query.includes(phrase))) {
    return { intent: "WHAT_CAN_YOU_DO" };
  }

  return { intent: "UNKNOWN" };
}
