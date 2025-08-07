import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Widget-specific color mappings to avoid conflicts with user's theme
export const widgetColors = {
  // Primary colors for the widget
  primary: "bg-blue-600 hover:bg-blue-700",
  primaryText: "text-white",
  
  // Secondary colors
  secondary: "bg-gray-100 hover:bg-gray-200",
  secondaryText: "text-gray-900",
  
  // Background colors
  background: "bg-white",
  cardBackground: "bg-white/80 backdrop-blur-sm",
  
  // Border colors
  border: "border-gray-200",
  
  // Text colors
  foreground: "text-gray-900",
  muted: "text-gray-500",
  
  // Focus styles
  focus: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  
  // Dark mode variants
  dark: {
    background: "dark:bg-gray-900",
    cardBackground: "dark:bg-gray-800/80",
    foreground: "dark:text-gray-100",
    muted: "dark:text-gray-400",
    border: "dark:border-gray-700",
    primary: "dark:bg-blue-500 dark:hover:bg-blue-600",
  }
}

// Utility function to get widget-safe classes
export function getWidgetClasses(variant: keyof typeof widgetColors): string {
  return widgetColors[variant] as string
}

// Main function for widget components - combines safe Tailwind classes
export function cnWidget(...inputs: ClassValue[]): string {
  return cn(...inputs)
}