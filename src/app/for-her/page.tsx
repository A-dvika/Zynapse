"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { BackgroundBeams } from "@/components/ui/beams"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, CheckCircle, XCircle, Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface Opportunity {
  id: string
  name: string
  organization: string
  description: string
  eligibility: string
  deadline: Date
  url: string
  verified: boolean
  createdAt: Date
}

interface Notification {
  type: 'success' | 'error' | 'info'
  message: string
}

interface VerificationResult {
  isValid: boolean
  confidence: number
  reason: string
}

export default function OpportunitiesPage() {
  const { data: session } = useSession()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    description: "",
    eligibility: "",
    deadline: new Date(),
    url: "",
  })
  const [date, setDate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  // Fetch opportunities on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use hardcoded data
    const fetchOpportunities = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Hardcoded opportunities
        const hardcodedOpportunities: Opportunity[] = [
          {
            id: "1",
            name: "Google Women Techmakers Scholarship",
            organization: "Google",
            description: "Scholarship program for women in computer science and related fields.",
            eligibility: "Women pursuing degrees in computer science, computer engineering, or related technical fields.",
            deadline: new Date("2024-12-15"),
            url: "https://www.womentechmakers.com/scholars",
            verified: true,
            createdAt: new Date("2023-01-15"),
          },
          {
            id: "2",
            name: "Microsoft Women in Tech Fellowship",
            organization: "Microsoft",
            description: "Fellowship program for women pursuing advanced degrees in computer science.",
            eligibility: "Women pursuing PhD in computer science or related fields.",
            deadline: new Date("2024-10-01"),
            url: "https://www.microsoft.com/en-us/research/academic-program/fellowships/",
            verified: true,
            createdAt: new Date("2023-02-20"),
          },
          {
            id: "3",
            name: "AnitaB.org Grace Hopper Celebration",
            organization: "AnitaB.org",
            description: "World's largest gathering of women technologists.",
            eligibility: "Women in tech at all career stages.",
            deadline: new Date("2024-08-30"),
            url: "https://ghc.anitab.org/",
            verified: true,
            createdAt: new Date("2023-03-10"),
          },
          {
            id: "4",
            name: "AWS Build On Scholarship",
            organization: "Amazon Web Services",
            description: "Scholarship program for women and underrepresented groups in cloud computing.",
            eligibility: "Women and underrepresented groups pursuing degrees in cloud computing.",
            deadline: new Date("2024-11-01"),
            url: "https://aws.amazon.com/education/awseducate/",
            verified: true,
            createdAt: new Date("2023-04-05"),
          },
          {
            id: "5",
            name: "Women Who Code Mentorship Program",
            organization: "Women Who Code",
            description: "Mentorship program connecting women in tech with industry leaders.",
            eligibility: "Women at all career stages in tech.",
            deadline: new Date("2024-09-15"),
            url: "https://www.womenwhocode.com/mentorship",
            verified: true,
            createdAt: new Date("2023-05-12"),
          },
          {
            id: "6",
            name: "Intel AI for Women Program",
            organization: "Intel",
            description: "Training and mentorship program for women in AI and machine learning.",
            eligibility: "Women with basic programming knowledge interested in AI.",
            deadline: new Date("2024-07-20"),
            url: "https://www.intel.com/content/www/us/en/artificial-intelligence/women-in-ai.html",
            verified: true,
            createdAt: new Date("2023-06-18"),
          },
          {
            id: "7",
            name: "Adobe Digital Academy",
            organization: "Adobe",
            description: "Program providing education and job opportunities for underrepresented groups in tech.",
            eligibility: "Women and underrepresented groups transitioning to tech careers.",
            deadline: new Date("2024-08-10"),
            url: "https://www.adobe.com/diversity/digital-academy.html",
            verified: true,
            createdAt: new Date("2023-07-22"),
          },
          {
            id: "8",
            name: "IBM Quantum Women in Computing",
            organization: "IBM",
            description: "Program for women interested in quantum computing research and development.",
            eligibility: "Women with background in physics, computer science, or mathematics.",
            deadline: new Date("2024-10-15"),
            url: "https://research.ibm.com/quantum-computing",
            verified: true,
            createdAt: new Date("2023-08-30"),
          },
          {
            id: "9",
            name: "Salesforce Women in Tech Scholarship",
            organization: "Salesforce",
            description: "Scholarship program for women pursuing degrees in technology fields.",
            eligibility: "Women pursuing undergraduate or graduate degrees in technology.",
            deadline: new Date("2024-09-30"),
            url: "https://www.salesforce.org/education/scholarships/",
            verified: true,
            createdAt: new Date("2023-09-14"),
          },
          {
            id: "10",
            name: "GitHub Education Student Developer Pack",
            organization: "GitHub",
            description: "Free tools and resources for students, with special focus on women in tech.",
            eligibility: "Students, with emphasis on women and underrepresented groups.",
            deadline: new Date("2024-12-31"),
            url: "https://education.github.com/pack",
            verified: true,
            createdAt: new Date("2023-10-05"),
          },
        ]
        
        setOpportunities(hardcodedOpportunities)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching opportunities:", error)
        setError("Failed to load opportunities. Please try again later.")
        setIsLoading(false)
      }
    }
    
    fetchOpportunities()
  }, [])

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setFormData(prev => ({ ...prev, deadline: date }))
    }
  }

  const handleOpenModal = () => {
    console.log("Opening modal")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    console.log("Closing modal")
    setIsModalOpen(false)
    // Reset form when closing
    setFormData({
      name: "",
      organization: "",
      description: "",
      eligibility: "",
      deadline: new Date(),
      url: "",
    })
    setDate(new Date())
    setError(null)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  
    // Basic validation
    if (
      !formData.name ||
      !formData.organization ||
      !formData.description ||
      !formData.eligibility ||
      !formData.url
    ) {
      setError("Please fill in all required fields");
      return;
    }
  
    setIsSubmitting(true);
    setIsVerifying(true);
    setError(null);
  
    try {
      // 🔁 Call the backend API route instead of directly importing verifyWithGemini
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
  
      const verificationResult = await res.json();
  
      if (!res.ok) {
        throw new Error(verificationResult.error || "Verification failed");
      }
  
      if (verificationResult.isValid) {
        const newOpportunity: Opportunity = {
          id: Date.now().toString(),
          name: formData.name,
          organization: formData.organization,
          description: formData.description,
          eligibility: formData.eligibility,
          deadline: formData.deadline,
          url: formData.url,
          verified: true,
          createdAt: new Date(),
        };
  
        setOpportunities((prev) => [newOpportunity, ...prev]);
  
        setNotification({
          type: "success",
          message: "Opportunity added successfully!",
        });
  
        handleCloseModal();
      } else {
        setError(`This opportunity could not be verified: ${verificationResult.reason}`);
        setNotification({
          type: "error",
          message: "Verification failed. Please check your information.",
        });
      }
    } catch (error) {
      console.error("Error submitting opportunity:", error);
      setError("An error occurred while submitting the opportunity. Please try again.");
      setNotification({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setIsVerifying(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      <BackgroundBeams />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] dark:opacity-100 opacity-30"></div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-950/80 border border-green-500 text-green-400' 
              : notification.type === 'error'
                ? 'bg-red-950/80 border border-red-500 text-red-400'
                : 'bg-cyan-950/80 border border-cyan-500 text-cyan-400'
          }`}
        >
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : notification.type === 'error' ? (
              <XCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p>{notification.message}</p>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text mb-4">
              Tech Opportunities for Women
            </h1>
            <p className="text-neondark-muted max-w-2xl mx-auto">
              Discover scholarships, fellowships, mentorship programs, and other opportunities designed to support women in technology.
            </p>
          </motion.div>

          <div className="flex justify-end mb-6">
            <Button
              onClick={handleOpenModal}
              className="bg-cyan-400 text-black hover:bg-cyan-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add More
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-neondark-muted">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-cyan-400 text-black hover:bg-cyan-500"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-neondark-border bg-neondark-card/80 backdrop-blur-sm shadow-lg h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-neondark-text">{opportunity.name}</CardTitle>
                          <CardDescription className="text-cyan-400">{opportunity.organization}</CardDescription>
                        </div>
                        {opportunity.verified && (
                          <Badge className="bg-cyan-950 text-cyan-400 border-cyan-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neondark-muted text-sm mb-4">{opportunity.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-neondark-text">Eligibility:</span>
                          <p className="text-sm text-neondark-muted">{opportunity.eligibility}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-neondark-text">Deadline:</span>
                          <p className="text-sm text-neondark-muted">
                            {format(opportunity.deadline, "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-950"
                          onClick={() => window.open(opportunity.url, "_blank")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Opportunity Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border border-2 shadow-lg shadow-cyan-400/20 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neondark-text flex items-center">
              <PlusCircle className="mr-2 h-5 w-5 text-cyan-400" />
              Add New Opportunity
            </DialogTitle>
          </DialogHeader>

          <Separator className="bg-neondark-border" />

          {error && (
            <div className="bg-red-950/50 border border-red-500 text-red-400 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neondark-text">Opportunity Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-neondark-text">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-neondark-text">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibility" className="text-neondark-text">Eligibility</Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                className="bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text min-h-[80px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-neondark-text">Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-neondark-bg border-neondark-border text-neondark-text",
                        !date && "text-neondark-muted"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-cyan-400" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-neondark-card border-neondark-border">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                      className="bg-neondark-card text-neondark-text"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-neondark-text">URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="border-neondark-border text-neondark-muted hover:bg-neondark-bg"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-cyan-400 text-black hover:bg-cyan-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isVerifying ? "Verifying with Gemini..." : "Submitting..."}
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 