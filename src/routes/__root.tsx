import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AbyssBackground } from "@/components/site/AbyssBackground";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { KraitAssistantChatbot } from "@/components/site/KraitAssistantChatbot";
import { AdaptiveDeviceIndicator } from "@/components/site/AdaptiveDeviceIndicator";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Krait Abyss | AI, Automation, Software & Digital Solutions" },
      {
        name: "description",
        content:
          "A technology studio building websites, AI agents, automation pipelines, SaaS platforms and digital products.",
      },
      { name: "author", content: "Krait Abyss Studio" },
      { property: "og:title", content: "Krait Abyss | AI, Automation & Software Solutions" },
      {
        property: "og:description",
        content:
          "A technology studio building websites, AI agents, automation pipelines, SaaS platforms and digital products.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/krait-logo.png", type: "image/png" },
      { rel: "shortcut icon", href: "/krait-logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/krait-logo.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://kraitabyss.com/#organization",
        "name": "Krait Abyss",
        "url": "https://kraitabyss.com",
        "logo": "https://kraitabyss.com/krait-logo.png",
        "description": "Intelligent digital systems, AI agents, automation pipelines, SaaS platforms, and modern web applications.",
        "sameAs": [
          "https://www.linkedin.com/in/krait-abyss-35b390432/",
          "https://www.instagram.com/kraitabyss/"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "kraitabyss07@gmail.com",
          "telephone": "+91-7386613995",
          "contactType": "customer service"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://kraitabyss.com/#website",
        "url": "https://kraitabyss.com",
        "name": "Krait Abyss",
        "publisher": {
          "@id": "https://kraitabyss.com/#organization"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AbyssBackground />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
        <AdaptiveDeviceIndicator />
        <KraitAssistantChatbot />
      </div>
    </QueryClientProvider>
  );
}
