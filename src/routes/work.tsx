import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Verified Work & Process — Krait Abyss" },
      {
        name: "description",
        content:
          "Explore real-world production systems and client projects engineered by Krait Abyss. Full proof of practical hands-on execution.",
      },
      { property: "og:title", content: "Verified Work & Process — Krait Abyss" },
      {
        property: "og:description",
        content: "Real client projects, enterprise architectures, and milestone delivery process.",
      },
    ],
  }),
  component: WorkLayout,
});

function WorkLayout() {
  return <Outlet />;
}
