const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5004/api/v1'

function buildHeaders(token?: string, isJson: boolean = true): HeadersInit {
  const headers: HeadersInit = {}

  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text()

  let data: unknown = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: text || 'Unknown response format' }
  }

  if (!res.ok) {
    const message =
      (data as { message?: string; error?: string }).message ||
      (data as { message?: string; error?: string }).error ||
      `Request failed with status ${res.status}`

    throw new Error(message)
  }

  return data as T
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: buildHeaders(token, false),
    cache: 'no-store',
  })

  return parseResponse<T>(res)
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  })

  return parseResponse<T>(res)
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  })

  return parseResponse<T>(res)
}

export async function apiDelete<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(token, false),
  })

  return parseResponse<T>(res)
}