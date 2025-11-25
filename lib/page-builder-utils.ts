import type { BlockElement, StyleConfig, AnimationConfig } from "./page-builder-types"

export const generateBlockId = (): string => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const styleObjectToString = (styles: StyleConfig): string => {
  return Object.entries(styles)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
      return `${cssKey}: ${typeof value === "number" && !["opacity", "zIndex"].includes(key) ? `${value}px` : value}`
    })
    .join("; ")
}

export const generateCSSAnimation = (animations: AnimationConfig[]): string => {
  if (!animations.length) return ""

  const animationNames = animations.map((_, i) => `anim-${i}`).join(", ")
  const durations = animations.map((a) => `${a.duration}ms`).join(", ")
  const delays = animations.map((a) => `${a.delay || 0}ms`).join(", ")
  const iterations = animations.map((a) => a.iteration || "once").join(", ")

  return `
    animation-name: ${animationNames};
    animation-duration: ${durations};
    animation-delay: ${delays};
    animation-iteration-count: ${iterations};
  `
}

export const evaluateCondition = (data: any, field: string, operator: string, value: any): boolean => {
  const fieldValue = getNestedValue(data, field)

  switch (operator) {
    case "equals":
      return fieldValue === value
    case "notEquals":
      return fieldValue !== value
    case "greaterThan":
      return fieldValue > value
    case "lessThan":
      return fieldValue < value
    case "contains":
      return String(fieldValue).includes(String(value))
    case "exists":
      return fieldValue !== undefined && fieldValue !== null
    default:
      return true
  }
}

export const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, prop) => current?.[prop], obj)
}

export const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split(".")
  const lastKey = keys.pop()
  const target = keys.reduce((current, key) => (current[key] ??= {}), obj)
  if (lastKey) target[lastKey] = value
}

export const cloneElement = (element: BlockElement): BlockElement => {
  return {
    ...element,
    id: generateBlockId(),
    children: element.children?.map(cloneElement),
  }
}

export const findElementById = (elements: BlockElement[], id: string): BlockElement | null => {
  for (const element of elements) {
    if (element.id === id) return element
    if (element.children) {
      const found = findElementById(element.children, id)
      if (found) return found
    }
  }
  return null
}

export const extractDataFields = (data: any): string[] => {
  const fields: string[] = []

  const traverse = (obj: any, prefix = "") => {
    if (obj === null || obj === undefined) return

    if (Array.isArray(obj)) {
      if (obj.length > 0) {
        traverse(obj[0], prefix ? `${prefix}[0]` : `[0]`)
      }
    } else if (typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const fullPath = prefix ? `${prefix}.${key}` : key
        fields.push(fullPath)
        if (typeof obj[key] === "object") {
          traverse(obj[key], fullPath)
        }
      })
    }
  }

  traverse(data)
  return fields
}

export const formatDataForDisplay = (data: any): Record<string, any> => {
  if (Array.isArray(data)) return { items: data }
  return data
}
