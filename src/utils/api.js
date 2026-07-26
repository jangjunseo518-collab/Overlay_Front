export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return null

  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) return null

    const data = await response.json()
    localStorage.setItem('accessToken', data.accessToken)
    return data.accessToken
  } catch (error) {
    return null
  }
}

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('accessToken')

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken()

    if (newToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      })
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      window.location.reload()
    }
  }

  return response
}