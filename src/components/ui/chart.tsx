"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    const cssVars = React.useMemo(() => {
      const vars: Record<string, string> = {}
      Object.entries(config).forEach(([key, value]) => {
        vars[`--color-${key}`] = value.color
      })
      return vars
    }, [config])

    return (
      <div ref={ref} className={cn("w-full", className)} style={cssVars as React.CSSProperties} {...props}>
        {children}
      </div>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props} />
})
ChartTooltip.displayName = "ChartTooltip"

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: any }>
  label?: string
}

const ChartTooltipContent = ({ active, payload, label }: ChartTooltipContentProps) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="text-xs">
      <p className="font-medium">{label}</p>
      <div className="mt-1 space-y-0.5">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: item.payload.fill }} />
            <span className="font-medium">{item.name}:</span>
            <span className="ml-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }

