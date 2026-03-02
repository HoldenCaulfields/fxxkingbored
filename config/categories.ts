import { Category } from "@/types/category"

export type CategoryConfig = {
  id: Category
  label: string
  icon: string
  color: string
  group: "learn" | "fun" // để tính ratio profile
}

export const CATEGORY_CONFIG: CategoryConfig[] = [
  { id: "music", label: "Music", icon: "🎵", color: "#ef4444", group: "fun" },
  { id: "film", label: "Film", icon: "🎬", color: "#ef4444", group: "fun" },
  { id: "book", label: "Book", icon: "📚", color: "#3b82f6", group: "learn" },
  { id: "language", label: "Lang", icon: "🌐", color: "#3b82f6", group: "learn" },
  
  { id: "game", label: "Game", icon: "🎮", color: "#ef4444", group: "fun" },
  { id: "dating", label: "Date", icon: "❤️", color: "#ef4444", group: "fun" },
  { id: "work", label: "Work", icon: "💼", color: "#3b82f6", group: "learn" },
  { id: "startup", label: "Start", icon: "🚀", color: "#3b82f6", group: "learn" },
]