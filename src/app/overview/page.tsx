import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BarChart3, Cpu, Globe, LineChart, Lock, Zap, ChevronRight, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neondark-bg text-foreground">
      {/* Header */}
  

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-neondark-border text-neondark-text text-sm">
                The Future of Analytics
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Monitor Your Digital Empire in <span className="text-neondark-text">Real-Time</span>
              </h1>
              <p className="text-lg text-neondark-muted max-w-lg">
                NeonDash brings your data to life with stunning visualizations and powerful analytics tools designed for
                the digital age.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400 h-12 px-6">Start Free Trial</Button>
                <Button
                  variant="outline"
                  className="border-neondark-border text-neondark-text hover:bg-neondark-accent/10 h-12 px-6"
                >
                  <span>Watch Demo</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-neondark-bg bg-gray-200 dark:bg-gray-800"
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-neondark-muted">
                  <span className="text-neondark-text font-medium">2,500+</span> data analysts trust NeonDash
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-cyan-500/20 rounded-lg blur-xl"></div>
              <div className="relative bg-neondark-card border border-neondark-border rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  width={800}
                  height={600}
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neondark-bg/80 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] dark:opacity-100 opacity-30"></div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-t border-b border-neondark-border bg-neondark-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-neondark-muted mb-8">TRUSTED BY INNOVATIVE COMPANIES</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  width={120}
                  height={40}
                  alt={`Company logo ${i}`}
                  className="h-full w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all"
                />
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
              Powerful Features for the <span className="text-neondark-text">Digital Age</span>
            </h2>
            <p className="text-neondark-muted">
              Our cutting-edge dashboard combines powerful analytics with an intuitive interface, giving you complete
              control over your data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Real-time Analytics",
                description: "Monitor your metrics in real-time with millisecond precision and instant updates.",
              },
              {
                icon: <LineChart className="h-6 w-6" />,
                title: "Predictive Insights",
                description: "Leverage AI-powered predictions to anticipate trends before they happen.",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Lightning Performance",
                description: "Experience blazing fast load times and smooth interactions, even with massive datasets.",
              },
              {
                icon: <Lock className="h-6 w-6" />,
                title: "Enterprise Security",
                description: "Bank-level encryption and comprehensive access controls keep your data safe.",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Global CDN",
                description: "Access your dashboard from anywhere with our globally distributed network.",
              },
              {
                icon: <Cpu className="h-6 w-6" />,
                title: "API Integration",
                description: "Connect with any data source through our flexible and powerful API ecosystem.",
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
              Visualize Your Data Like <span className="text-neondark-text">Never Before</span>
            </h2>
            <p className="text-neondark-muted">
              Our intuitive interface makes complex data simple to understand and act upon.
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
              <p className="text-neondark-text font-medium">Real-time Metrics</p>
              <p className="text-neondark-muted text-xs">Monitor key performance indicators with millisecond updates</p>
            </div>

            <div className="absolute top-[40%] right-[10%] w-48 p-3 bg-neondark-card/80 backdrop-blur-sm border border-neondark-border rounded-lg text-sm">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mb-2 text-black font-bold">
                2
              </div>
              <p className="text-neondark-text font-medium">Custom Dashboards</p>
              <p className="text-neondark-muted text-xs">Create personalized views tailored to your specific needs</p>
            </div>

            <div className="absolute bottom-[20%] left-[20%] w-48 p-3 bg-neondark-card/80 backdrop-blur-sm border border-neondark-border rounded-lg text-sm">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mb-2 text-black font-bold">
                3
              </div>
              <p className="text-neondark-text font-medium">Advanced Filtering</p>
              <p className="text-neondark-muted text-xs">Drill down into your data with powerful filtering options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-neondark-text">Data Leaders</span>
            </h2>
            <p className="text-neondark-muted">
              See what our customers are saying about their experience with NeonDash.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "NeonDash transformed how we analyze our customer data. The real-time insights have been game-changing for our business.",
                name: "Alex Chen",
                title: "CTO, TechCorp",
              },
              {
                quote:
                  "The predictive analytics feature helped us anticipate market trends months in advance. This platform is worth every penny.",
                name: "Sarah Johnson",
                title: "Data Scientist, FutureTech",
              },
              {
                quote:
                  "I've used many analytics platforms, but none compare to the speed and flexibility of NeonDash. It's become essential to our operations.",
                name: "Michael Rodriguez",
                title: "VP of Analytics, DataDrive",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="relative p-6 rounded-lg border border-neondark-border bg-gradient-to-br from-neondark-card to-neondark-bg"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 rounded-lg blur"></div>
                <div className="relative">
                  <div className="text-neondark-text text-4xl font-serif mb-4">"</div>
                  <p className="text-foreground mb-6">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 mr-3"></div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-neondark-muted text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative bg-gradient-to-b from-neondark-bg to-neondark-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent <span className="text-neondark-text">Pricing</span>
            </h2>
            <p className="text-neondark-muted">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$49",
                description: "Perfect for individuals and small teams just getting started with analytics.",
                features: [
                  "Up to 100,000 events/month",
                  "5 custom dashboards",
                  "7-day data retention",
                  "Basic support",
                  "1 team member",
                ],
              },
              {
                name: "Professional",
                price: "$149",
                description: "Ideal for growing businesses that need more power and flexibility.",
                features: [
                  "Up to 1M events/month",
                  "Unlimited dashboards",
                  "30-day data retention",
                  "Priority support",
                  "5 team members",
                  "API access",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For organizations with advanced needs and large-scale data operations.",
                features: [
                  "Unlimited events",
                  "Unlimited dashboards",
                  "1-year data retention",
                  "24/7 dedicated support",
                  "Unlimited team members",
                  "Advanced security features",
                  "Custom integrations",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-lg border ${
                  plan.highlighted
                    ? "border-neondark-accent/50 bg-gradient-to-br from-cyan-950/50 to-neondark-card"
                    : "border-neondark-border bg-gradient-to-br from-neondark-card to-neondark-bg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 rounded-lg blur"></div>
                )}
                <div className="relative">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-neondark-muted ml-1">/month</span>}
                    </div>
                    <p className="text-neondark-muted mt-2 text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <div className="mr-2 mt-1 w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-neondark-text"></div>
                        </div>
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-cyan-500 text-black hover:bg-cyan-400"
                        : "bg-neondark-card hover:bg-neondark-card/70"
                    }`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="text-neondark-text">Transform</span> Your Data Experience?
            </h2>
            <p className="text-neondark-muted mb-8 max-w-2xl mx-auto">
              Join thousands of data-driven companies that trust NeonDash to power their analytics. Start your free
              trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400 h-12 px-8">Start Free Trial</Button>
              <Button
                variant="outline"
                className="border-neondark-border text-neondark-text hover:bg-neondark-accent/10 h-12 px-8"
              >
                Schedule Demo
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
                <span className="text-xl font-bold tracking-tight text-neondark-text">NeonDash</span>
              </div>
              <p className="text-neondark-muted text-sm mb-4">
                Empowering data-driven decisions with cutting-edge analytics and visualization tools.
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
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Integrations", "Changelog", "Documentation", "API"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Customers", "Careers", "Blog", "Press", "Partners"].map((item, i) => (
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
                {["Community", "Contact", "Support", "FAQ", "Terms", "Privacy"].map((item, i) => (
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
            <p className="text-neondark-muted text-sm">© {new Date().getFullYear()} NeonDash. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-neondark-muted hover:text-neondark-text text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

