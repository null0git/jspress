export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "button"
  | "container"
  | "list"
  | "card"
  | "form"
  | "api-data"
  | "conditional"
  | "loop"
  | "code-snippet"
  | "custom-component"

export interface BlockElement {
  id: string
  type: BlockType
  label: string
  props: Record<string, any>
  children?: BlockElement[]
  animations?: AnimationConfig[]
  styles?: StyleConfig
  conditions?: ConditionalConfig
  loop?: LoopConfig
}

export interface StyleConfig {
  display?: string
  flexDirection?: string
  justifyContent?: string
  alignItems?: string
  padding?: string
  margin?: string
  backgroundColor?: string
  color?: string
  fontSize?: string
  fontWeight?: string
  borderRadius?: string
  width?: string
  height?: string
  minHeight?: string
  opacity?: number
  boxShadow?: string
  border?: string
  [key: string]: any
}

export interface AnimationConfig {
  type: "fade" | "slide" | "scale" | "rotate" | "bounce" | "pulse"
  duration: number
  delay?: number
  easing?: "ease" | "linear" | "ease-in" | "ease-out" | "ease-in-out"
  iteration?: "once" | "infinite"
}

export interface ConditionalConfig {
  field: string
  operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains" | "exists"
  value: any
  showElement: boolean
}

export interface LoopConfig {
  dataSource: string
  itemVar: string
  keyField?: string
}

export interface ApiDataSource {
  id: string
  name: string
  url: string
  method: "GET" | "POST"
  headers?: Record<string, string>
  body?: Record<string, any>
  dataPath?: string
  fields?: ApiField[]
  refreshInterval?: number
  cacheTime?: number
}

export interface ApiField {
  name: string
  type: "string" | "number" | "boolean" | "date" | "array" | "object"
  displayName: string
  description?: string
}

export interface CodeSnippet {
  id: string
  name: string
  type: "javascript" | "html" | "css" | "jsx"
  code: string
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface SavedComponent {
  id: string
  name: string
  description?: string
  preview?: string
  elements: BlockElement[]
  category: string
  tags?: string[]
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export interface PageBuilderState {
  pages: PageDesign[]
  apiDataSources: ApiDataSource[]
  codeSnippets: CodeSnippet[]
  savedComponents: SavedComponent[]
}

export interface PageDesign {
  id: string
  title: string
  slug: string
  elements: BlockElement[]
  metadata: {
    createdAt: string
    updatedAt: string
    author: string
  }
}
