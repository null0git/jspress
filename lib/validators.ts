// Input validation utilities
export const validators = {
  email: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  },

  password: (password: string): boolean => {
    return password.length >= 8
  },

  slug: (slug: string): boolean => {
    const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return re.test(slug)
  },

  required: (value: string): boolean => {
    return value.trim().length > 0
  },
}

export const validateEmail = (email: string): string | null => {
  if (!validators.email(email)) {
    return "Invalid email address"
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!validators.password(password)) {
    return "Password must be at least 8 characters"
  }
  return null
}
