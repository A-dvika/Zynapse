"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Flame, ChevronDown, ChevronUp, ExternalLink, ArrowUpCircle, BrainCircuit } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  id: string
  name: string
  tagline: string
  thumbnail?: string
  url?: string
  slug?: string
  votesCount: number
  topics?: string[]
  createdAt?: string
}

interface TrendingProductsCardProps {
  onAnalyzeProduct?: (product: Product) => void
}

export function TrendingProductsCard({ onAnalyzeProduct }: TrendingProductsCardProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Using the exact API endpoint from the ProductHunt page
        const response = await fetch('/api/producthunt')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch trending products: ${response.status}`)
        }
        
        const data = await response.json()
        // Sort by votes (trending)
        const sortedProducts = [...data].sort((a: Product, b: Product) => b.votesCount - a.votesCount)
        setProducts(sortedProducts)
        setError(null)
      } catch (err) {
        console.error('Error fetching trending products:', err)
        setError('Failed to load trending products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggleExpand = () => setExpanded(!expanded)
  
  const clearFilter = () => setCategoryFilter(null)
  
  const handleFilterByTopic = (topic: string) => {
    setCategoryFilter(topic)
  }

  const filteredProducts = categoryFilter 
    ? products.filter(product => product.topics?.includes(categoryFilter))
    : products

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Flame className="h-5 w-5 text-cyan-400" /> Trending Products
          </CardTitle>
          {categoryFilter && (
            <CardDescription className="flex items-center mt-1">
              Filtered by:
              <Badge variant="outline" className="ml-2 border-neondark-border">
                {categoryFilter}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilter}
                  className="h-4 w-4 ml-1 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </Badge>
            </CardDescription>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={toggleExpand} className="h-8 w-8 p-0">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-neondark-muted">No products match your search criteria</div>
        ) : (
          <ul className="space-y-3">
            {(expanded ? filteredProducts : filteredProducts.slice(0, 5)).map(
              (product, index) => (
                <motion.li
                  key={product.id}
                  className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 shadow-sm hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage src={product.thumbnail || ""} alt={product.name} />
                        <AvatarFallback className="rounded-md bg-cyan-900/50 text-cyan-300">
                          {product.name?.charAt(0) || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <a
                          href={product.url || `https://www.producthunt.com/posts/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                        >
                          {product.name}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        <p className="text-sm text-neondark-muted mt-0.5 line-clamp-2">{product.tagline}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge
                        variant="secondary"
                        className="ml-2 flex items-center gap-1 bg-cyan-900/30 text-cyan-300"
                      >
                        <ArrowUpCircle className="h-3 w-3 text-cyan-400" />
                        {product.votesCount}
                      </Badge>
                      {onAnalyzeProduct && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onAnalyzeProduct(product)}
                        >
                          <BrainCircuit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {product.topics && product.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-[52px]">
                      {product.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="text-xs bg-cyan-900/20 text-cyan-400 hover:bg-cyan-900/40 cursor-pointer border-cyan-800/50"
                          onClick={() => handleFilterByTopic(topic)}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.li>
              ),
            )}
          </ul>
        )}
        {!loading && !error && !expanded && filteredProducts.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpand}
            className="w-full mt-3 hover:bg-cyan-900/20 hover:text-cyan-400"
          >
            View all {filteredProducts.length} products
          </Button>
        )}
      </CardContent>
    </Card>
  )
}