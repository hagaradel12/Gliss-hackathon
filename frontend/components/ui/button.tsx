"use client"

import * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-md px-4 py-2"
    const variants: Record<string, string> = {
      default: "bg-black text-white hover:bg-black/90",
      outline:
        "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
    }
    const classes = [base, variants[variant] ?? variants.default, className]
      .filter(Boolean)
      .join(" ")
    return <button ref={ref} className={classes} {...props} />
  }
)

Button.displayName = "Button"


