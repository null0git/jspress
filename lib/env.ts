// Environment variables configuration for production
export const getEnv = () => {
  const isDev = process.env.NODE_ENV === "development"

  return {
    JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
    DATABASE_URL: process.env.DATABASE_URL || "sqlite:cms.db",
    NODE_ENV: process.env.NODE_ENV || "development",
  }
}
