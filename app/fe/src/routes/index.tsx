import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

// interface Feature {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }

// const features: Feature[] = [
//   {
//     icon: <Sparkles className="h-6 w-6" />,
//     title: "AI-Powered Quotes",
//     description: "Discover inspiring quotes generated and curated by advanced AI technology.",
//   },
//   {
//     icon: <Brain className="h-6 w-6" />,
//     title: "Smart Recommendations",
//     description: "Get personalized quote recommendations based on your preferences.",
//   },
//   {
//     icon: <Zap className="h-6 w-6" />,
//     title: "Lightning Fast",
//     description: "Experience blazingly fast quote retrieval and seamless interactions.",
//   },
//   {
//     icon: <BookOpen className="h-6 w-6" />,
//     title: "Extensive Collection",
//     description: "Browse through thousands of carefully curated quotes.",
//   },
// ];

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">
            Quotes App
            <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              AI Powered 2026
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            <span className="mb-14 text-blue-950">
              Discover inspiring quotes to start your day with a smile.
            </span>{" "}
            <br />
            <span className="mb-8 text-blue-600">
              Get personalized recommendations and explore an extensive collection of wisdom from
              around the world.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
