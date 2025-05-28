const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function login({ username, password }: { username: string; password: string }) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
    body: new URLSearchParams({ username, password }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.detail || 'Échec de la connexion')
  }

  return res.json()
}

export async function logout() {
  await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/v1/auth/me`, {
    credentials: 'include',
  })

  if (!res.ok) throw new Error('Non authentifié')
  return res.json()
}
