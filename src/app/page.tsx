import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BarChart3, Cpu, Globe, LineChart, Lock, Zap, ChevronRight, ArrowRight, Github, MessageSquare, Database, BarChart4, Newspaper, Twitter } from "lucide-react"
import { ThreeDCardDemo } from "@/components/hero"
import { BackgroundBeams } from "@/components/ui/beams"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      {/* Header */}
  <BackgroundBeams />
      {/* Hero Section */}
      <section className="pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-neondark-border text-neondark-text text-sm">
                AI-Powered Tech Insights
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Zynapse <span className="text-neondark-text"></span>
              </h1>
              <p className="text-lg text-neondark-muted max-w-lg">
                An interactive, AI-powered dashboard providing real-time insights into Zynapse, community discussions, and social media buzz, complemented by automated personalized weekly newsletters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400 h-12 px-6">Get Started</Button>
                <Button
                  variant="outline"
                  className="border-neondark-border text-neondark-text hover:bg-neondark-accent/10 h-12 px-6"
                >
                  <span>Watch Demo</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-6">
             
                <p className="text-sm text-neondark-muted">
                  <span className="text-neondark-text font-medium">2,500+</span> developers trust Zynapse
                </p>
              </div>
            </div>
            <div className="relative perspective-[1000px]">
              {/* Glow/Blur background */}
              <div className="absolute -inset-0.5 bg-cyan-500/20 rounded-lg blur-xl z-0" />

              {/* 3D Card Wrapper */}
              <div className="relative z-10">
                <ThreeDCardDemo />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-neondark-bg/80 to-transparent rounded-lg z-20 pointer-events-none" />

              {/* Neon blur orb */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl z-0" />
            </div>
          </div>
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] dark:opacity-100 opacity-30"></div>
      </section>

      {/* Data Sources Section */}
      <section className="py-12 border-t border-b border-neondark-border bg-neondark-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-neondark-muted mb-8">AGGREGATING TRENDS FROM LEADING PLATFORMS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
            {[
              { name: "HackerNews", icon: "Newspaper" },
              { name: "GitHub", icon: "Github" },
              { name: "Twitter", icon: "Twitter" },
              { name: "Mastodon", icon: "MessageSquare" },
              { name: "Reddit", icon: "MessageSquare" },
              { name: "Stack Overflow", icon: "Database" },
              { name: "ProductHunt", icon: "BarChart3" },
              { name: "NewsAPI", icon: "Newspaper" }
            ].map((platform, i) => (
              <div key={i} className="flex flex-col items-center opacity-70 hover:opacity-100 transition-all group">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-neondark-text mb-2 group-hover:bg-cyan-500/20 transition-all">
                  {/* Use appropriate icon */}
                  <Cpu className="h-6 w-6" />
                </div>
                <span className="text-sm text-neondark-muted group-hover:text-neondark-text transition-all">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neondark-accent/50 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="text-neondark-text">Features</span>
            </h2>
            <p className="text-neondark-muted">
              Our Zynapse dashboard combines multiple data sources with advanced AI capabilities to provide comprehensive insights into the tech world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Interactive Dashboard",
                description: "Summary metrics showing trending posts, active discussions, GitHub repositories, and popular queries at a glance.",
              },
              {
                icon: <Github className="h-6 w-6" />,
                title: "GitHub & Reddit Insights",
                description: "Track engaging topics, trending repositories, language popularity, and active contributions across platforms.",
              },
              {
                icon: <Database className="h-6 w-6" />,
                title: "Stack Overflow Trends",
                description: "See popular questions, best answers, and unanswered queries, organized by technology and topic.",
              },
              {
                icon: <Twitter className="h-6 w-6" />,
                title: "Social Media Buzz",
                description: "Aggregated trending hashtags and posts from Twitter and Mastodon in one convenient view.",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "AI Chatbot Integration",
                description: "Queries resolved using vector embeddings (Cohere + Pinecone) and Gemini LLM with fallback to Google and YouTube searches.",
              },
              {
                icon: <Newspaper className="h-6 w-6" />,
                title: "Automated Newsletters",
                description: "Weekly insights and tech highlights delivered automatically every Monday with AI-generated summaries.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-lg border border-neondark-border bg-gradient-to-br from-neondark-card to-neondark-bg hover:border-neondark-accent/50 transition-all duration-300"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 text-neondark-text">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neondark-muted">{feature.description}</p>
                  <div className="mt-4 flex items-center text-neondark-text text-sm font-medium">
                    <span>Learn more</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 relative bg-gradient-to-b from-neondark-bg to-neondark-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Track Zynapse in <span className="text-neondark-text">Real-Time</span>
            </h2>
            <p className="text-neondark-muted">
              Our intuitive interface aggregates data from multiple sources to provide comprehensive insights.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-xl"></div>
            <div className="relative rounded-lg overflow-hidden border border-neondark-border shadow-2xl">
              <Image
                src="/placeholder.svg?height=800&width=1400"
                width={1400}
                height={800}
                alt="Dashboard Interface"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neondark-bg/80 via-neondark-bg/20 to-transparent"></div>
            </div>

            {/* Feature callouts */}
            <div className="absolute top-[20%] left-[10%] w-48 p-3 bg-neondark-card/80 backdrop-blur-sm border border-neondark-border rounded-lg text-sm">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mb-2 text-black font-bold">
                1
              </div>
              <p className="text-neondark-text font-medium">Reddit & GitHub Insights</p>
              <p className="text-neondark-muted text-xs">Track trending repositories and engaging discussions</p>
            </div>

            <div className="absolute top-[40%] right-[10%] w-48 p-3 bg-neondark-card/80 backdrop-blur-sm border border-neondark-border rounded-lg text-sm">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mb-2 text-black font-bold">
                2
              </div>
              <p className="text-neondark-text font-medium">AI Chatbot</p>
              <p className="text-neondark-muted text-xs">Get answers using advanced vector embeddings and LLM technology</p>
            </div>

            <div className="absolute bottom-[20%] left-[20%] w-48 p-3 bg-neondark-card/80 backdrop-blur-sm border border-neondark-border rounded-lg text-sm">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mb-2 text-black font-bold">
                3
              </div>
              <p className="text-neondark-text font-medium">Weekly Newsletters</p>
              <p className="text-neondark-muted text-xs">AI-generated summaries delivered automatically every Monday</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}


      {/* Workflow Section */}
 
      {/* Unique Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What's <span className="text-neondark-text">Unique</span>
            </h2>
            <p className="text-neondark-muted">
              Features that set the Zynapse Dashboard apart from other solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Multi-source aggregation",
                description: "Comprehensive trend analysis from multiple platforms in one unified dashboard."
              },
              {
                title: "AI-driven newsletters",
                description: "Automated weekly summaries tailored to your personal interests and tech focus."
              },
              {
                title: "Enhanced accessibility",
                description: "Multi-language support and accessibility-first design for all users."
              },
              {
                title: "Community engagement",
                description: "Interactive meme trends and social media integration for active participation."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="relative p-6 rounded-lg border border-neondark-border bg-gradient-to-br from-neondark-card to-neondark-bg"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 rounded-lg blur"></div>
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-2 text-neondark-text">{feature.title}</h3>
                  <p className="text-neondark-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-gradient-to-b from-neondark-bg to-neondark-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="text-neondark-text">Explore</span> Zynapse?
            </h2>
            <p className="text-neondark-muted mb-8 max-w-2xl mx-auto">
              Join thousands of developers and tech enthusiasts who trust our dashboard to stay informed about the latest in technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400 h-12 px-8">Get Started</Button>
              <Button
                variant="outline"
                className="border-neondark-border text-neondark-text hover:bg-neondark-accent/10 h-12 px-8"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neondark-border bg-neondark-bg py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-md bg-cyan-500 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold tracking-tight text-neondark-text">Zynapse</span>
              </div>
              <p className="text-neondark-muted text-sm mb-4">
                Real-time tech insights powered by AI and comprehensive data aggregation.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-neondark-muted hover:bg-cyan-500 hover:text-black transition-colors"
                  >
                    <span className="sr-only">Social Media</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Features</h3>
              <ul className="space-y-2">
                {["Dashboard", "AI Chatbot", "Newsletter", "Integrations", "Data Sources", "API"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                {["Documentation", "GitHub", "API Reference", "Examples", "Tutorials", "Blog"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">About</h3>
              <ul className="space-y-2">
                {["Project", "Contributors", "Open Source", "License", "Terms", "Privacy"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-neondark-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neondark-muted text-sm">© {new Date().getFullYear()} Zynapse Dashboard. Licensed under MIT.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}