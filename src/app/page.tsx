"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Cpu,
  Globe,
  Zap,
  ArrowRight,
  Github,
  MessageSquare,
  Database,
  Newspaper,
  Twitter,
  Play,
  ExternalLink,
  Users,
  Code,
  Sparkles,
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { BackgroundBeams } from "@/components/ui/beams"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef } from "react"
import Link from "next/link";

// Define the missing data variables
const lineData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 450 },
  { name: "May", value: 650 },
  { name: "Jun", value: 700 },
  { name: "Jul", value: 600 },
]

const barData = [
  { name: "Platform A", value: 400 },
  { name: "Platform B", value: 300 },
  { name: "Platform C", value: 200 },
  { name: "Platform D", value: 300 },
  { name: "Platform E", value: 500 },
]

const pieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
]

const COLORS = ["#00FFFF", "#00D5FF", "#00B6FF", "#0090FF"]

export default function LandingPage() {
  const platformsRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    let isMounted = true

    const animatePlatforms = async () => {
      if (!isMounted) return

      await controls.start({
        x: "-100%",
        transition: { duration: 30, ease: "linear" },
      })

      if (isMounted) {
        controls.set({ x: "100%" })
        animatePlatforms()
      }
    }

    // Start the animation after component is mounted
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        animatePlatforms()
      }
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [controls])

  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundBeams className="opacity-40" />

      {/* Hero Section */}
      <section className="pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.2),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-neondark-border text-neondark-text text-sm font-medium backdrop-blur-sm">
                AI-Powered Tech Insights
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Zynapse{" "}
                <span className="text-neondark-text bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-xl text-neondark-muted max-w-lg leading-relaxed">
                An interactive, AI-powered dashboard providing real-time insights into Zynapse, community discussions,
                and social media buzz.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400 h-14 px-8 rounded-xl text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="border-neondark-border text-neondark-text hover:bg-neondark-accent/10 h-14 px-8 rounded-xl text-lg font-medium group transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:text-cyan-400 transition-colors" />
                  <span>Watch Demo</span>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-neondark-bg bg-neondark-card flex items-center justify-center text-xs font-medium"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-neondark-muted">
                  <span className="text-neondark-text font-medium">2,500+</span> developers trust Zynapse
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative perspective-[1000px]"
            >
              {/* Glow/Blur background */}
              <div className="absolute -inset-0.5 bg-cyan-500/30 rounded-2xl blur-xl z-0" />

              {/* Hero Image with Charts */}
              <div className="relative z-10 rounded-2xl overflow-hidden border border-neondark-border/50 h-[500px] bg-neondark-bg/50 backdrop-blur-sm">
                {/* Animated Graphs */}
                <div className="relative z-10 grid grid-cols-2 grid-rows-2 gap-4 h-full p-4">
                  {/* Line Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="bg-neondark-card/60 backdrop-blur-sm rounded-xl p-4 border border-neondark-border/50 flex flex-col"
                  >
                    <h3 className="text-lg font-semibold text-neondark-text mb-2">User Growth</h3>
                    <p className="text-xs text-neondark-muted mb-2">Monthly active users</p>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#00FFFF"
                            strokeWidth={2}
                            dot={{ stroke: "#00FFFF", strokeWidth: 2, r: 4, strokeDasharray: "" }}
                            animationDuration={1500}
                            isAnimationActive={true}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Bar Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="bg-neondark-card/60 backdrop-blur-sm rounded-xl p-4 border border-neondark-border/50 flex flex-col"
                  >
                    <h3 className="text-lg font-semibold text-neondark-text mb-2">Platform Usage</h3>
                    <p className="text-xs text-neondark-muted mb-2">Top 5 platforms</p>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <Bar
                            dataKey="value"
                            fill="#00FFFF"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                            isAnimationActive={true}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Area Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="bg-neondark-card/60 backdrop-blur-sm rounded-xl p-4 border border-neondark-border/50 flex flex-col"
                  >
                    <h3 className="text-lg font-semibold text-neondark-text mb-2">Engagement</h3>
                    <p className="text-xs text-neondark-muted mb-2">Weekly activity</p>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={lineData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#00FFFF"
                            fill="url(#colorValue)"
                            animationDuration={1500}
                            isAnimationActive={true}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Pie Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="bg-neondark-card/60 backdrop-blur-sm rounded-xl p-4 border border-neondark-border/50 flex flex-col"
                  >
                    <h3 className="text-lg font-semibold text-neondark-text mb-2">Distribution</h3>
                    <p className="text-xs text-neondark-muted mb-2">User segments</p>
                    <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                            animationDuration={1500}
                            isAnimationActive={true}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-neondark-card/60 backdrop-blur-md rounded-xl p-4 border border-neondark-border/50">
                    <h3 className="text-xl font-semibold text-neondark-text mb-2">Real-time Analytics</h3>
                    <p className="text-sm text-neondark-muted">
                      Visualize trends and patterns across multiple platforms
                    </p>
                  </div>
                </div>
              </div>

              {/* Neon blur orbs */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl z-0" />
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl z-0" />
            </motion.div>
          </div>
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] dark:opacity-100 opacity-30"></div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 border-t border-b border-neondark-border bg-neondark-card/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05),transparent_70%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-center text-neondark-muted mb-12 text-sm font-medium tracking-wider uppercase">
            AGGREGATING TRENDS FROM LEADING PLATFORMS
          </p>

          {/* Continuous scrolling platforms */}
          <div className="overflow-hidden" ref={platformsRef}>
            <motion.div className="flex gap-16 items-center" animate={controls} style={{ width: "200%" }}>
              {[...Array(2)].map((_, groupIndex) => (
                <div key={groupIndex} className="flex gap-16 items-center">
                  {[
                    { name: "HackerNews", icon: <Newspaper className="h-6 w-6" /> },
                    { name: "GitHub", icon: <Github className="h-6 w-6" /> },
                    { name: "Twitter", icon: <Twitter className="h-6 w-6" /> },
                    { name: "Mastodon", icon: <MessageSquare className="h-6 w-6" /> },
                    { name: "Reddit", icon: <MessageSquare className="h-6 w-6" /> },
                    { name: "Stack Overflow", icon: <Database className="h-6 w-6" /> },
                    { name: "ProductHunt", icon: <BarChart3 className="h-6 w-6" /> },
                    { name: "NewsAPI", icon: <Newspaper className="h-6 w-6" /> },
                  ].map((platform, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center opacity-70 hover:opacity-100 transition-all group cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-neondark-text mb-3 group-hover:bg-cyan-500/20 transition-all group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                        {platform.icon}
                      </div>
                      <span className="text-sm text-neondark-muted group-hover:text-neondark-text transition-all">
                        {platform.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neondark-accent/50 to-transparent"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-neondark-border text-neondark-text text-sm font-medium mb-6">
              Core Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Powerful{" "}
              <span className="text-neondark-text bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-neondark-muted leading-relaxed">
              Our Zynapse dashboard combines multiple data sources with advanced AI capabilities to provide
              comprehensive insights into the tech world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-7 w-7" />,
                title: "Interactive Dashboard",
                description:
                  "Summary metrics showing trending posts, active discussions, GitHub repositories, and popular queries at a glance.",
              },
              {
                icon: <Github className="h-7 w-7" />,
                title: "GitHub & Reddit Insights",
                description:
                  "Track engaging topics, trending repositories, language popularity, and active contributions across platforms.",
              },
              {
                icon: <Database className="h-7 w-7" />,
                title: "Stack Overflow Trends",
                description:
                  "See popular questions, best answers, and unanswered queries, organized by technology and topic.",
              },
              {
                icon: <Twitter className="h-7 w-7" />,
                title: "Social Media Buzz",
                description: "Aggregated trending hashtags and posts from Twitter and Mastodon in one convenient view.",
              },
              {
                icon: <Zap className="h-7 w-7" />,
                title: "AI Chatbot Integration",
                description:
                  "Queries resolved using vector embeddings (Cohere + Pinecone) and Gemini LLM with fallback to Google and YouTube searches.",
              },
              {
                icon: <Newspaper className="h-7 w-7" />,
                title: "Automated Newsletters",
                description:
                  "Weekly insights and tech highlights delivered automatically every Monday with AI-generated summaries.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl border border-neondark-border bg-gradient-to-br from-neondark-card to-neondark-bg hover:border-neondark-accent/50 transition-all duration-300 hover:translate-y-[-5px]"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-neondark-text group-hover:bg-cyan-500/20 transition-all group-hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-neondark-muted text-base leading-relaxed mb-6">{feature.description}</p>
                  <div className="flex items-center text-neondark-text text-sm font-medium group-hover:text-cyan-400 transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Women in Tech Section */}
      <section className="py-32 relative bg-gradient-to-b from-neondark-bg to-neondark-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute -inset-1 bg-cyan-500/20 rounded-2xl blur-xl"></div>
              <div className="relative rounded-2xl overflow-hidden border border-neondark-border shadow-2xl h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Women in technology"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neondark-bg via-neondark-bg/40 to-transparent"></div>
                <div className="absolute inset-0 bg-cyan-500/10"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-neondark-border text-neondark-text text-sm font-medium backdrop-blur-sm">
                Diversity & Inclusion
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Women in{" "}
                <span className="text-neondark-text bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  Technology
                </span>
              </h2>
              <p className="text-xl text-neondark-muted leading-relaxed">
                Celebrating the achievements and contributions of women in the tech industry while promoting diversity
                and inclusion.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  {
                    icon: <Users className="h-6 w-6" />,
                    title: "Community",
                    description: "Connect with a network of women in tech through mentorship programs and events.",
                  },
                  {
                    icon: <Code className="h-6 w-6" />,
                    title: "Resources",
                    description: "Access learning materials, career guidance, and technical workshops.",
                  },
                  {
                    icon: <Sparkles className="h-6 w-6" />,
                    title: "Visibility",
                    description: "Highlight achievements and success stories of women in the tech industry.",
                  },
                  {
                    icon: <Globe className="h-6 w-6" />,
                    title: "Global Impact",
                    description: "Join initiatives that promote gender equality in technology worldwide.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-neondark-card/40 backdrop-blur-sm p-5 rounded-xl border border-neondark-border hover:border-cyan-500/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 text-neondark-text group-hover:bg-cyan-500/20 transition-all">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-neondark-muted text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              <Link href="/for-her" passHref>
                <div className="mt-6 bg-transparent border border-cyan-500/50 text-neondark-text hover:bg-cyan-500/10 h-12 px-6 rounded-xl text-base font-medium transition-all duration-300 group cursor-pointer inline-flex items-center">
                <span>Explore More</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-neondark-border text-neondark-text text-sm font-medium mb-6">
              Dashboard Preview
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Track Zynapse in{" "}
              <span className="text-neondark-text bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Real-Time
              </span>
            </h2>
            <p className="text-xl text-neondark-muted leading-relaxed">
              Our intuitive interface aggregates data from multiple sources to provide comprehensive insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-2xl blur-xl"></div>
            <div className="relative rounded-2xl overflow-hidden border border-neondark-border shadow-2xl">
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute top-[20%] left-[10%] w-56 p-4 bg-neondark-card/90 backdrop-blur-sm border border-neondark-border rounded-xl text-sm shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center mb-3 text-black font-bold">
                1
              </div>
              <p className="text-neondark-text font-medium text-base mb-1">Reddit & GitHub Insights</p>
              <p className="text-neondark-muted text-sm">
                Track trending repositories and engaging discussions in real-time
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute top-[40%] right-[10%] w-56 p-4 bg-neondark-card/90 backdrop-blur-sm border border-neondark-border rounded-xl text-sm shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center mb-3 text-black font-bold">
                2
              </div>
              <p className="text-neondark-text font-medium text-base mb-1">AI Chatbot</p>
              <p className="text-neondark-muted text-sm">
                Get answers using advanced vector embeddings and LLM technology
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="absolute bottom-[20%] left-[20%] w-56 p-4 bg-neondark-card/90 backdrop-blur-sm border border-neondark-border rounded-xl text-sm shadow-[0_0_20px_rgba(0,255,255,0.2)]"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center mb-3 text-black font-bold">
                3
              </div>
              <p className="text-neondark-text font-medium text-base mb-1">Weekly Newsletters</p>
              <p className="text-neondark-muted text-sm">AI-generated summaries delivered automatically every Monday</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-32 relative bg-gradient-to-b from-neondark-bg to-neondark-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-neondark-border text-neondark-text text-sm font-medium mb-6">
              Differentiators
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              What's{" "}
              <span className="text-neondark-text bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Unique
              </span>
            </h2>
            <p className="text-xl text-neondark-muted leading-relaxed">
              Features that set the Zynapse Dashboard apart from other solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {[
              {
                title: "Multi-source aggregation",
                description: "Comprehensive trend analysis from multiple platforms in one unified dashboard.",
              },
              {
                title: "AI-driven newsletters",
                description: "Automated weekly summaries tailored to your personal interests and tech focus.",
              },
              {
                title: "Enhanced accessibility",
                description: "Multi-language support and accessibility-first design for all users.",
              },
              {
                title: "Community engagement",
                description: "Interactive meme trends and social media integration for active participation.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl border border-neondark-border bg-gradient-to-br from-neondark-card to-neondark-bg hover:border-neondark-accent/50 transition-all duration-300 hover:translate-y-[-5px] group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 text-neondark-text group-hover:bg-cyan-500/20 transition-all">
                    <span className="text-2xl font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-neondark-text">{feature.title}</h3>
                  <p className="text-neondark-muted text-base leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center bg-neondark-card/40 backdrop-blur-sm p-12 rounded-3xl border border-neondark-border relative overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 rounded-3xl blur-xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to{" "}
                <span className="text-neondark-text bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  Explore
                </span>{" "}
                Zynapse?
              </h2>
              <p className="text-xl text-neondark-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers and tech enthusiasts who trust our dashboard to stay informed about the
                latest in technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400 h-14 px-10 rounded-xl text-lg font-medium transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="border-neondark-border text-neondark-text hover:bg-neondark-accent/10 h-14 px-10 rounded-xl text-lg font-medium group transition-all duration-300"
                >
                  <ExternalLink className="mr-2 h-5 w-5 group-hover:text-cyan-400 transition-colors" />
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neondark-border bg-neondark-bg py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-neondark-text">Zynapse</span>
              </div>
              <p className="text-neondark-muted text-base mb-6 leading-relaxed">
                Real-time tech insights powered by AI and comprehensive data aggregation.
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Globe, MessageSquare].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-neondark-card flex items-center justify-center text-neondark-muted hover:bg-cyan-500 hover:text-black transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">Social Media</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">Features</h3>
              <ul className="space-y-3">
                {["Dashboard", "AI Chatbot", "Newsletter", "Integrations", "Data Sources", "API"].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-neondark-muted hover:text-neondark-text text-base group flex items-center"
                    >
                      <span className="group-hover:underline">{item}</span>
                      <ArrowRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-5px] group-hover:translate-x-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">Resources</h3>
              <ul className="space-y-3">
                {["Documentation", "GitHub", "API Reference", "Examples", "Tutorials", "Blog"].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-neondark-muted hover:text-neondark-text text-base group flex items-center"
                    >
                      <span className="group-hover:underline">{item}</span>
                      <ArrowRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-5px] group-hover:translate-x-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">About</h3>
              <ul className="space-y-3">
                {["Project", "Contributors", "Open Source", "License", "Terms", "Privacy"].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-neondark-muted hover:text-neondark-text text-base group flex items-center"
                    >
                      <span className="group-hover:underline">{item}</span>
                      <ArrowRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-5px] group-hover:translate-x-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-neondark-border mt-16 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neondark-muted text-base">
              © {new Date().getFullYear()} Zynapse Dashboard. Licensed under MIT.
            </p>
            <div className="flex gap-8 mt-6 md:mt-0">
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-base hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-base hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-base hover:underline">
                License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
