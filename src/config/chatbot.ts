export interface ChatbotMeetingConfig {
  enabled: boolean;
  provider: "google" | "zoom" | "calendly" | "custom";
  bookingUrl: string;
}

export interface ChatbotConfig {
  name: string;
  subtitle: string;
  contactEmail: string;
  whatsappNumber: string;
  whatsappNotice: string;
  whatsappUrl: string;
  meeting: ChatbotMeetingConfig;
}

export const chatbotConfig: ChatbotConfig = {
  name: "Krait Assistant",
  subtitle: "Krait Abyss Guide",
  contactEmail: "kraitabyss07@gmail.com",
  whatsappNumber: "+91 73866 13995",
  whatsappNotice: "Text messages only (No calls)",
  whatsappUrl: "https://wa.me/917386613995?text=Hello%20Krait%20Abyss%20Support%2C%20I%20have%20an%20issue",
  meeting: {
    enabled: false,
    provider: "google",
    bookingUrl: "",
  },
};
