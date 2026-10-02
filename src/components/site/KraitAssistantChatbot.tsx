import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { X, RotateCcw, Send, Mail, ArrowUpRight, Bot, Calendar, ExternalLink, MessageCircle } from "lucide-react";
import logo from "@/assets/krait-logo.png";
import { chatbotConfig } from "@/config/chatbot";
import { getChatbotResponse, type ChatbotResponse } from "@/services/chatbotService";

export type Message = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  isFallback?: boolean;
  hasContactAction?: boolean;
  showFinalActions?: boolean;
  meetingConfig?: typeof chatbotConfig.meeting;
  timestamp: string;
  suggestions?: string[];
};

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "welcome-1",
  sender: "assistant",
  text: "Hey! 👋 I'm the Krait Assistant. I can help with common questions about our services, development, AI/ML, SaaS, team, and how to contact or work with us.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  suggestions: [
    "What services do you provide?",
    "Do you build websites?",
    "Do you provide AI solutions?",
    "Do you build SaaS platforms?",
    "Who handles development?",
    "How can I work with Krait Abyss?",
  ],
};

const CATEGORY_PILLS = [
  { label: "Services", query: "What services do you provide?" },
  { label: "Web Dev", query: "Do you build websites?" },
  { label: "AI & Agents", query: "Do you provide AI solutions?" },
  { label: "SaaS", query: "Do you build SaaS platforms?" },
  { label: "Backend & AWS", query: "Do you provide backend development?" },
  { label: "Marketing", query: "Do you provide digital marketing?" },
  { label: "Team", query: "Who is in the Krait Abyss team?" },
  { label: "Contact", query: "How can I contact you?" },
];

export function KraitAssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastCategory, setLastCategory] = useState<string | undefined>();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    try {
      // Query Chatbot Service with conversational intent & knowledge base search
      const res: ChatbotResponse = await getChatbotResponse(text, lastCategory);

      if (res.category) {
        setLastCategory(res.category);
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      if (res.isFallback !== undefined) assistantMsg.isFallback = res.isFallback;
      if (res.hasContactAction !== undefined) assistantMsg.hasContactAction = res.hasContactAction;
      if (res.showFinalActions !== undefined) assistantMsg.showFinalActions = res.showFinalActions;
      if (res.meetingConfig !== undefined) assistantMsg.meetingConfig = res.meetingConfig;
      if (res.suggestions !== undefined) assistantMsg.suggestions = res.suggestions;

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Controlled Fallback on unexpected runtime error
      setMessages((prev) => [
        ...prev,
        {
          id: `fallback-${Date.now()}`,
          sender: "assistant",
          text: "I don't have enough information to answer that accurately, but our help team can help you with it.",
          isFallback: true,
          hasContactAction: true,
          showFinalActions: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleScheduleMeetClick = () => {
    if (chatbotConfig.meeting.enabled && chatbotConfig.meeting.bookingUrl.trim().length > 0) {
      window.open(chatbotConfig.meeting.bookingUrl, "_blank");
    } else {
      handleSendMessage("Schedule a meet");
    }
  };

  const handleContactTeamClick = () => {
    window.location.href = `mailto:${chatbotConfig.contactEmail}`;
    handleSendMessage("Contact the team");
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setInputMessage("");
    setLastCategory(undefined);
  };

  return (
    <div className="fixed top-20 right-6 z-50 font-sans">
      {/* --- Collapsed Trigger Button --- */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Krait Assistant"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-card/95 border border-border/80 text-foreground shadow-[0_0_25px_rgba(15,23,42,0.8)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(30,41,59,0.9)] focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {/* Cybernetic Krait Assistant Icon */}
          <div className="relative flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          {/* Hover Badge */}
          <span className="absolute right-16 hidden whitespace-nowrap rounded-md bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground border border-border/80 shadow-lg group-hover:block">
            {chatbotConfig.name}
          </span>
        </button>
      )}

      {/* --- Expanded Chat Window --- */}
      {isOpen && (
        <div className="flex h-[540px] max-h-[84vh] w-[calc(100vw-2.5rem)] sm:w-[395px] flex-col rounded-2xl border border-border/80 bg-black/95 text-foreground shadow-[0_0_45px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 bg-card/80 px-4 py-3.5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 overflow-hidden bg-black">
                <img src={logo} alt="Krait Assistant Logo" className="h-full w-full object-cover" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                  {chatbotConfig.name}
                </h3>
                <p className="text-[11px] text-muted-foreground">{chatbotConfig.subtitle}</p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear chat"
                aria-label="Clear chat"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus:outline-none"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chatbot"
                aria-label="Close chatbot"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Category Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-card/30 px-3 py-2 text-[11px] scrollbar-none">
            <span className="text-muted-foreground/60 text-[10px] font-medium uppercase tracking-wider shrink-0 mr-1">
              Explore:
            </span>
            {CATEGORY_PILLS.map((cp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(cp.query)}
                className="shrink-0 rounded-full border border-border/60 bg-background/50 px-2.5 py-0.5 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
              >
                {cp.label}
              </button>
            ))}
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-border/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed transition-all ${
                    msg.sender === "user"
                      ? "bg-primary/20 text-foreground border border-primary/30 rounded-tr-none"
                      : "bg-muted/40 text-foreground border border-border/60 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Mail & WhatsApp Links Preview */}
                  {(msg.text.includes(chatbotConfig.contactEmail) || msg.hasContactAction) && (
                    <div className="mt-2.5 space-y-1.5 font-mono text-[11px]">
                      <div className="text-emerald-400">
                        <a
                          href={`mailto:${chatbotConfig.contactEmail}`}
                          className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-emerald-300"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>{chatbotConfig.contactEmail}</span>
                        </a>
                      </div>
                      <div className="text-emerald-400 flex items-center gap-1.5 flex-wrap">
                        <a
                          href={chatbotConfig.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-emerald-300 font-semibold"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp {chatbotConfig.whatsappNumber}</span>
                        </a>
                        <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/60 font-sans">
                          (Text messages only)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Configured Booking Link Action if active */}
                  {msg.meetingConfig &&
                    msg.meetingConfig.enabled &&
                    msg.meetingConfig.bookingUrl && (
                      <div className="mt-3">
                        <a
                          href={msg.meetingConfig.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-all shadow-sm"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Open{" "}
                            {msg.meetingConfig.provider === "google"
                              ? "Google Meet"
                              : msg.meetingConfig.provider === "zoom"
                                ? "Zoom"
                                : "Meeting Scheduler"}
                          </span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                  {/* FINAL ACTION UI — START A PROJECT, REQUEST A CALL, or CONTACT KRAIT */}
                  {msg.sender === "assistant" && msg.showFinalActions && (
                    <div className="mt-3.5 rounded-xl border border-border/80 bg-background/90 p-3 space-y-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">
                        Would you like to take the next step?
                      </p>
                      <div className="flex flex-col gap-2">
                        {/* Option 1: START A PROJECT */}
                        <a
                          href="/contact"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-3.5 py-2.5 text-xs font-semibold text-background shadow-sm transition-all hover:opacity-90 font-mono uppercase tracking-wider"
                        >
                          <span>START A PROJECT</span>
                        </a>

                        {/* Option 2: REQUEST A CALL */}
                        <a
                          href="/book-call"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs font-medium text-steel shadow-sm transition-all hover:bg-slate-800 hover:text-foreground font-mono uppercase tracking-wider"
                        >
                          <Calendar className="h-4 w-4 text-emerald-400" />
                          <span>REQUEST A CALL</span>
                        </a>

                        {/* Option 3: CONTACT KRAIT */}
                        <a
                          href="/contact"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:bg-secondary hover:text-foreground font-mono uppercase tracking-wider"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>CONTACT KRAIT</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Standard EXPLORE Smart Suggestions (only when NOT in Final Actions mode) */}
                  {msg.sender === "assistant" &&
                    !msg.showFinalActions &&
                    msg.suggestions &&
                    msg.suggestions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1.5">
                        <p className="text-[10px] font-medium text-muted-foreground/80">
                          You can also ask:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(sug)}
                              className="rounded-md border border-border/70 bg-card/60 px-2 py-1 text-[11px] text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground text-left"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <span className="mt-1 text-[10px] text-muted-foreground/60 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-tl-none bg-muted/40 border border-border/60 px-4 py-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse delay-150"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-2 border-t border-border/80 bg-card/60 px-3 py-2.5 backdrop-blur-xl"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Krait Assistant..."
              className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
