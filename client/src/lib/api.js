export const API_BASE = import.meta.env.VITE_API_BASE || ''

export function api(path) {
  return `${API_BASE}${path}`
}

