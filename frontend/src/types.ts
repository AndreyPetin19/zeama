export interface Review {
  id: string
  reviewText: string
  aiScore: number
  category: 'Poor Review' | 'Medium Review' | 'Good Review'
  pointsAwarded: 20 | 70 | 100
  aiExplanation: string
  createdAt: string
  breakdown?: ScoreBreakdown
}

export interface ScoreBreakdown {
  specificity: number
  helpfulness: number
  authenticity: number
  structure: number
  constructiveFeedback: number
  humanAuthenticityScore: number
  penalty: number
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  totalPoints: number
  reviews: Review[]
}

export interface ReviewAnalysis {
  score: number
  category: 'Poor Review' | 'Medium Review' | 'Good Review'
  pointsAwarded: 20 | 70 | 100
  explanation: string
  breakdown: ScoreBreakdown
}
