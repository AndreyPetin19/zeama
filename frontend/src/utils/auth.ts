import type { User, Review } from '../types'

const USERS_KEY = 'zeama_users'
const CURRENT_KEY = 'zeama_current_user_id'

export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  const id = localStorage.getItem(CURRENT_KEY)
  if (!id) return null
  return getUsers().find((u) => u.id === id) ?? null
}

export function setCurrentUserId(id: string): void {
  localStorage.setItem(CURRENT_KEY, id)
}

export function logout(): void {
  localStorage.removeItem(CURRENT_KEY)
}

export type AuthError = { error: string }

export function signUp(
  name: string,
  email: string,
  password: string,
): User | AuthError {
  const users = getUsers()
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'An account with this email already exists.' }
  }
  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    totalPoints: 0,
    reviews: [],
  }
  saveUsers([...users, user])
  setCurrentUserId(user.id)
  return user
}

export function login(email: string, password: string): User | AuthError {
  const users = getUsers()
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  )
  if (!user) return { error: 'Incorrect email or password.' }
  setCurrentUserId(user.id)
  return user
}

export function addReviewToCurrentUser(review: Review): User | null {
  const users = getUsers()
  const id = localStorage.getItem(CURRENT_KEY)
  if (!id) return null

  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return null

  users[idx].reviews.unshift(review)
  users[idx].totalPoints += review.pointsAwarded
  saveUsers(users)
  return users[idx]
}

export function isAuthError(val: unknown): val is AuthError {
  return typeof val === 'object' && val !== null && 'error' in val
}
