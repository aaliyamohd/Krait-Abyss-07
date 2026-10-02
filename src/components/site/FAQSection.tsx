import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export type FAQItem = {
  question: string;
  answer: string;
};

export const homepageFAQs: FAQItem[] = [
  {
    question: "What does Krait Abyss build?",
    answer:
      "We build custom digital products, web applications, AI agents, automation workflows (n8n), SaaS dashboards, backend APIs, mobile-responsive websites, and creative media pipelines tailored to business requirements.",
  },
  {
    question: "Can you build AI agents & AI chatbots?",
    answer:
      "Yes. We design and deploy autonomous AI agents, multi-agent systems, RAG-based document search assistants, customer support chatbots, and lead-generation AI tools.",
  },
  {
    question: "Can you automate our business workflows?",
    answer:
      "Absolutely. We build n8n workflows, API integrations, lead automation, CRM sync, WhatsApp/email automation, and custom data processing pipelines.",
  },
  {
    question: "Do you work with startups as well as established companies?",
    answer:
      "Whether you're a startup with a small idea or an established company solving a complex technical problem, we're ready to build with you.",
  },
  {
    question: "Can you work on small projects?",
    answer:
      "Yes. We handle targeted scopes, MVPs, website redesigns, custom automation setups, and small feature builds alongside large system developments.",
  },
  {
    question: "Do you build SaaS products and internal business tools?",
    answer:
      "Yes. We build full-stack SaaS platforms, admin dashboards, internal portals, authentication systems, and database architectures.",
  },
  {
    question: "Can you work on Web3 / blockchain projects?",
    answer:
      "Yes. We offer Web3 application development, smart contract integrations, Web3 dashboards, and wallet connection interfaces as an additional capability.",
  },
  {
    question: "How do we start a project with Krait Abyss?",
    answer:
      "You can click 'START A PROJECT' to request a service directly via our Client Portal, or email us at kraitabyss07@gmail.com. Our team responds within 24 hours.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="border-t border-border/80 bg-black/80 py-20">
      <div className="mx-auto max-w-4xl px-5">
        <div className="text-center mb-12">
          <p className="eyebrow tracking-[0.2em] text-steel flex items-center justify-center gap-2">
            <HelpCircle className="h-3.5 w-3.5" /> FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Everything You Need To Know
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Clear answers about our capabilities, workflows, and project engagement.
          </p>
        </div>

        <div className="space-y-3">
          {homepageFAQs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/70 bg-card/60 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-medium text-foreground transition-colors hover:bg-muted/30 focus:outline-none"
                >
                  <span className="text-sm font-semibold tracking-tight leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-steel transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/40 bg-background/50 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
