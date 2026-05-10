import type { ReviewAnalysis, ScoreBreakdown } from '../types'

// ─── keyword lists (English + Russian) ───────────────────────────────────────

const SPECIFICITY_KEYWORDS = [
  // EN — product attributes
  'material', 'fabric', 'stitching', 'zipper', 'button', 'thread', 'seam', 'lining',
  // EN — size & fit
  'size', 'fit', 'oversized', 'tight', 'loose', 'length', 'sleeve', 'waist', 'shoulder',
  // EN — feel & comfort
  'comfort', 'comfortable', 'soft', 'hard', 'rough', 'smooth', 'warm', 'cold', 'breathable',
  // EN — quality
  'quality', 'durable', 'durability', 'thick', 'thin', 'strong', 'weak', 'sturdy', 'fragile',
  // EN — delivery & packaging
  'delivery', 'packaging', 'shipping', 'arrived', 'damaged', 'sealed', 'box',
  // EN — care & washing
  'washing', 'washed', 'wash', 'faded', 'shrunk', 'shrank', 'color', 'bleach',
  // EN — price & value
  'price', 'worth', 'value', 'expensive', 'cheap', 'affordable', 'cost',
  // EN — product types
  'hoodie', 'jacket', 'shirt', 'shoes', 'sneakers', 'boots', 'bag', 'pants', 'dress',
  'coat', 'sweater', 'sock', 'cap', 'hat', 'belt', 'jeans', 'skirt', 'shorts',
  // EN — time of use
  'week', 'weeks', 'month', 'months', 'hours', 'days',
  // EN — other physical details
  'sole', 'weight', 'texture', 'smell', 'odor', 'pocket', 'collar', 'hood', 'cuff', 'cushion',
  'recommend', 'suggestion',

  // RU — продукт и одежда
  'кроссовки', 'худи', 'кофта', 'обувь', 'товар', 'продукт', 'куртка', 'сумка',
  'футболка', 'штаны', 'джинсы', 'платье', 'шорты', 'носки', 'ботинки', 'кеды',
  // RU — материал и конструкция
  'материал', 'ткань', 'подошва', 'молния', 'шов', 'швы', 'подкладка', 'строчка',
  'амортизация', 'подошвы', 'стелька', 'замок',
  // RU — размер и посадка
  'размер', 'посадка', 'размеру', 'размера', 'размерная', 'подошёл', 'подошли',
  'налезли', 'маломерит', 'большемерит', 'подходит',
  // RU — комфорт и ощущения
  'удобный', 'удобная', 'удобные', 'удобно', 'комфорт', 'комфортные', 'комфортно',
  'мягкий', 'мягкая', 'мягкие', 'мягко', 'жёсткий', 'тёплый', 'тёплые',
  'дышащий', 'не давит', 'фиксируется', 'фиксация',
  // RU — качество
  'качество', 'качественный', 'качественная', 'качественные', 'прочный', 'прочные',
  'долговечный', 'крепкий', 'износостойкий',
  // RU — цвет и внешний вид
  'цвет', 'дизайн', 'выглядит', 'выглядят', 'форма', 'форму',
  // RU — доставка и упаковка
  'доставка', 'доставили', 'упаковка', 'пришло', 'пришли', 'получил', 'получила',
  // RU — цена
  'цена', 'стоимость', 'дорого', 'дёшево', 'дешёво', 'недорого',
  // RU — время использования
  'неделю', 'недели', 'недель', 'месяц', 'месяца', 'месяцев', 'дней', 'дня',
  'часов', 'суток',
  // RU — уход
  'стирка', 'стирал', 'стирала', 'постирал', 'постирала', 'после стирки',
]

const HELPFULNESS_PATTERNS = [
  // EN
  'i recommend', 'i would recommend', 'would recommend', 'do not recommend',
  "don't recommend", 'worth buying', 'not worth', 'worth it', 'buy this',
  "don't buy", 'dont buy', 'would not buy', 'would buy again', 'ordering again',
  'size down', 'size up', 'size smaller', 'size bigger', 'buy one size',
  'order one size', 'size runs', 'size is accurate', 'size was accurate',
  'good for', 'not good for', 'best for', 'perfect for', 'ideal for', 'not suitable',
  'suited for', 'works well', 'does not work',
  // RU
  'рекомендую', 'рекомендую всем', 'не рекомендую', 'советую', 'не советую',
  'стоит брать', 'стоит купить', 'покупать стоит', 'не стоит брать', 'не стоит покупать',
  'стоит своих денег', 'цена оправдана', 'цена оправдывает', 'соответствует цене',
  'советую брать', 'советую заказать', 'советую размер', 'возьмите на размер',
  'берите на размер', 'брать размер', 'заказывать размер',
  'подойдёт для', 'подходит для', 'не подходит для', 'идеально для',
  'куплю ещё', 'куплю снова', 'закажу снова', 'закажу ещё', 'буду заказывать',
]

const CONTRAST_WORDS = [
  // EN
  'however', 'but', 'although', 'except', 'though', 'yet', 'while',
  'the only problem', 'the only issue', 'the downside', 'unfortunately',
  'on the downside', 'the issue', 'the problem is',
  // RU
  'однако', 'зато', 'хотя', 'тем не менее', 'несмотря на',
  'из минусов', 'из недостатков', 'единственный минус', 'единственный недостаток',
  'к сожалению', 'к минусам', 'минус один', 'есть минус', 'есть недостаток',
  'но есть', 'но стоит', 'но нужно', 'правда есть',
]

const FIRST_PERSON_MARKERS = [
  // EN
  'i bought', 'i purchased', 'i ordered', 'i received', 'i used', 'i wore',
  'i tried', 'i washed', 'i walked', 'i wore it', 'after washing', 'after wearing',
  'after using', 'when i', 'my experience', 'i found', 'i noticed', 'for me',
  'last week', 'last month', 'yesterday', 'i would', 'i have', "i've",
  'after one wash', 'for two weeks', 'for a week', 'for a month',
  // RU — первое лицо
  'пользуюсь', 'ношу', 'носил', 'носила', 'носили', 'купил', 'купила', 'купили',
  'брал', 'брала', 'заказал', 'заказала', 'получил', 'получила', 'использую',
  'использовал', 'использовала', 'попробовал', 'попробовала', 'взял', 'взяла',
  'у меня', 'мне понравилось', 'мне не понравилось', 'мне нравится', 'мне не нравится',
  'я доволен', 'я довольна', 'я купил', 'я купила', 'я заказал', 'я заказала',
  'моё мнение', 'мой опыт', 'для меня', 'я бы', 'я уже',
  // RU — время использования (первое лицо)
  'несколько дней', 'несколько недель', 'несколько месяцев', 'уже месяц', 'уже неделю',
  'каждый день', 'каждый день ношу', 'повседневной носки', 'для повседневной',
  'после носки', 'после стирки', 'после использования', 'после покупки',
  'первый раз', 'второй раз', 'снова заказал',
]

const GENERIC_PHRASES = [
  // EN
  'excellent product', 'highly recommend', 'exceeded my expectations',
  'amazing quality', 'wonderful product', 'this product is amazing',
  'great quality and amazing', 'overall, this is an excellent',
  'amazing product', 'fantastic product', 'perfect product',
  '5 stars', 'five stars', 'best product ever', 'love this product',
  'would recommend to everyone', 'i highly recommend to everyone',
  'this product is wonderful', 'great value for money',
  // RU — шаблонные фразы
  'отличный товар', 'товар отличный', 'прекрасный товар',
  'очень доволен покупкой', 'остался очень доволен',
  'рекомендую всем без исключения', 'советую всем',
  'лучший товар', 'лучшая покупка в жизни',
  'топ товар', 'огонь товар', 'бомба',
  'всё отлично', 'всё хорошо', 'всё супер',
]

const CONSTRUCTIVE_NEGATIVE = [
  // EN
  'the problem is', 'the issue is', 'the downside', 'however', 'but the',
  'although', 'unfortunately', 'after washing', 'after one wash',
  'the only thing', 'i would improve', 'could be improved', 'should be',
  'faded', 'shrunk', 'shrank', 'broke', 'got stuck', 'gets dirty', 'cracked',
  'too small', 'too big', 'too long', 'too short', 'slightly longer', 'a bit',
  // RU
  'из минусов', 'из недостатков', 'единственный минус', 'есть минус',
  'минус в том', 'недостаток в том', 'к сожалению', 'жаль',
  'проблема в том', 'есть проблема', 'есть нюанс', 'есть нюансы',
  'не понравилось', 'не нравится', 'не очень', 'немного',
  'слегка', 'чуть-чуть', 'чуть', 'слишком большой', 'слишком маленький',
  'слишком длинный', 'слишком короткий', 'великоват', 'маловат',
  'после стирки', 'после носки', 'быстро', 'отклеилось', 'потёрлось',
  'поблёкло', 'скрипит', 'натирает', 'жмёт',
]

const CONSTRUCTIVE_POSITIVE_SPECIFIC = [
  // EN
  'the fabric', 'the material', 'the quality', 'the stitching', 'the sole',
  'delivery was', 'the fit', 'the size', 'the comfort', 'the zipper',
  'the color', 'the packaging', 'the texture',
  // RU
  'материал', 'ткань хорошая', 'качество материала', 'подошва хорошая',
  'амортизация хорошая', 'доставка быстрая', 'посадка отличная',
  'размер подошёл', 'комфорт отличный', 'удобно носить', 'качество швов',
  'цвет красивый', 'дизайн нравится', 'упаковка хорошая',
]

const IMPROVEMENT_SUGGESTIONS = [
  // EN
  'should improve', 'would be better if', 'i would suggest', 'i wish',
  'could be better', 'needs improvement', 'hope they fix', 'next time',
  // RU
  'хотелось бы', 'было бы лучше', 'стоило бы', 'надеюсь улучшат',
  'пожелание', 'хочется', 'можно было бы', 'нужно улучшить',
  'следующий раз', 'в следующей версии',
]

// ─── dimension scorers ────────────────────────────────────────────────────────

function scoreSpecificity(t: string, wordCount: number): number {
  const found = SPECIFICITY_KEYWORDS.filter((k) => t.includes(k)).length

  let base = 0
  if (wordCount >= 10) base = 3
  if (wordCount >= 20) base = 5
  if (wordCount >= 40) base = 7

  const kwScore = Math.min(18, found * 2.2)
  return Math.min(25, Math.round(base + kwScore))
}

function scoreHelpfulness(t: string, wordCount: number): number {
  let score = 0
  if (HELPFULNESS_PATTERNS.some((p) => t.includes(p))) score += 8
  if (CONTRAST_WORDS.some((p) => t.includes(p))) score += 6
  if (/\bпрос\b|\bконс\b|\bpros\b|\bcons\b/.test(t)) score += 5

  const repurchaseWords = ['would buy again', 'ordering again', 'would not buy', 'will buy again',
    'куплю ещё', 'закажу снова', 'куплю снова', 'буду заказывать']
  if (repurchaseWords.some((p) => t.includes(p))) score += 5

  if (wordCount >= 20) score += 4
  if (wordCount >= 40) score += 2

  return Math.min(25, score)
}

function scoreAuthenticity(t: string, wordCount: number): number {
  let score = 8

  const fpCount = FIRST_PERSON_MARKERS.filter((p) => t.includes(p)).length
  score += Math.min(9, fpCount * 3)

  const genericCount = GENERIC_PHRASES.filter((p) => t.includes(p)).length
  score -= genericCount * 5

  // balanced review = authentic signal
  const hasPositive = [
    'good', 'great', 'nice', 'comfortable', 'soft', 'fast', 'well', 'perfect', 'love', 'like',
    'удобный', 'удобно', 'хорошо', 'отлично', 'нравится', 'нравятся', 'понравилось',
    'мягкий', 'качественный', 'комфортно', 'доволен', 'довольна',
  ].some((w) => t.includes(w))

  const hasNegative = [
    'bad', 'issue', 'problem', 'slow', 'faded', 'shrank', 'stuck', 'loose', 'tight', 'dirty', 'broke',
    'минус', 'недостаток', 'проблема', 'жаль', 'не понравилось', 'нюанс',
    'натирает', 'жмёт', 'великоват', 'маловат', 'быстро изнашивается',
  ].some((w) => t.includes(w))

  if (hasPositive && hasNegative) score += 4

  return Math.min(20, Math.max(0, score))
}

function scoreStructure(text: string, wordCount: number): number {
  let score = 0

  if (wordCount < 5) score = 2
  else if (wordCount < 10) score = 5
  else if (wordCount < 20) score = 9
  else if (wordCount < 40) score = 12
  else score = 13

  const words = text.toLowerCase().split(/\s+/)
  const uniqueRatio = new Set(words).size / Math.max(words.length, 1)
  if (uniqueRatio < 0.45) score -= 7
  else if (uniqueRatio < 0.60) score -= 3

  const randomChars = (text.match(/[^a-zA-Zа-яА-ЯёЁ0-9\s.,!?'"()\-:;]/g) ?? []).length
  if (randomChars > 6) score -= 3

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 4)
  if (sentences.length >= 2) score += 1
  if (sentences.length >= 3) score += 1

  return Math.min(15, Math.max(0, score))
}

function scoreConstructiveFeedback(t: string, wordCount: number): number {
  let score = 0

  const negFound = CONSTRUCTIVE_NEGATIVE.filter((p) => t.includes(p)).length
  score += Math.min(7, Math.round(negFound * 2.5))

  const posFound = CONSTRUCTIVE_POSITIVE_SPECIFIC.filter((p) => t.includes(p)).length
  score += Math.min(4, Math.round(posFound * 1.5))

  if (IMPROVEMENT_SUGGESTIONS.some((p) => t.includes(p))) score += 4

  if (wordCount >= 25 && score >= 4) score += 2

  return Math.min(15, score)
}

function humanAuthenticityScore(t: string, wordCount: number): number {
  let score = 55

  const fpCount = FIRST_PERSON_MARKERS.filter((p) => t.includes(p)).length
  score += Math.min(25, fpCount * 7)

  const genericCount = GENERIC_PHRASES.filter((p) => t.includes(p)).length
  score -= genericCount * 12

  // repetition penalty — only for short reviews; long reviews naturally repeat words
  const words = t.split(/\s+/).filter((w) => w.length > 3)
  const freq: Record<string, number> = {}
  words.forEach((w) => { freq[w] = (freq[w] ?? 0) + 1 })
  const maxRepeat = Math.max(0, ...Object.values(freq))
  if (wordCount < 30) {
    if (maxRepeat >= 4) score -= 20
    else if (maxRepeat >= 3) score -= 10
  } else {
    // long reviews: only penalise extreme repetition
    if (maxRepeat >= 6) score -= 15
    else if (maxRepeat >= 5) score -= 8
  }

  // length penalty
  if (wordCount < 5) score -= 35
  else if (wordCount < 10) score -= 18

  // balanced review bonus
  const hasPos = [
    'good', 'great', 'comfortable', 'soft', 'fast', 'accurate', 'nice', 'warm',
    'удобный', 'удобно', 'хорошо', 'нравится', 'нравятся', 'понравилось',
    'мягкий', 'комфортно', 'доволен', 'довольна', 'отличный', 'качественный',
  ].some((w) => t.includes(w))

  const hasNeg = [
    'but', 'however', 'issue', 'problem', 'bad', 'faded', 'slow', 'dirty',
    'минус', 'недостаток', 'проблема', 'жаль', 'нюанс', 'не понравилось',
    'однако', 'зато', 'хотя', 'к сожалению',
  ].some((w) => t.includes(w))

  if (hasPos && hasNeg) score += 12

  // real-detail bonus (EN + RU)
  const realDetails = [
    'after washing', 'after one wash', 'for two weeks', 'for a week',
    'for a month', 'three hours', 'one hour', 'two hours', 'last week', 'last month',
    'несколько дней', 'несколько недель', 'несколько месяцев', 'уже месяц',
    'каждый день', 'повседневной носки', 'после стирки', 'после носки',
    'уже неделю', 'уже три', 'уже два',
  ]
  const detailCount = realDetails.filter((p) => t.includes(p)).length
  score += Math.min(15, detailCount * 7)

  return Math.min(100, Math.max(0, score))
}

// ─── explanation generator ────────────────────────────────────────────────────

function buildExplanation(
  score: number,
  specificity: number,
  helpfulness: number,
  authenticity: number,
  constructive: number,
  has: number,
  penalty: number,
  wordCount: number,
): string {
  if (score >= 75) {
    const parts = ['This review is detailed, specific, and genuinely useful for other buyers.']
    if (specificity >= 18) parts.push('It includes concrete product details and real usage experience.')
    if (constructive >= 10) parts.push('The constructive feedback about both strengths and issues adds significant value.')
    if (helpfulness >= 18) parts.push('Other buyers can make informed decisions based on this review.')
    return parts.join(' ')
  }

  if (score >= 40) {
    const parts = ['This is a useful review with some real details.']
    if (specificity < 12) parts.push('Adding more specific product details — material, fit, size, or delivery — would improve the score.')
    if (constructive < 8) parts.push('Mentioning clear pros and cons or a specific issue would make it more helpful.')
    if (helpfulness < 12) parts.push('A sizing recommendation or a "would you buy again" statement would help other buyers.')
    return parts.join(' ')
  }

  // Poor
  const parts: string[] = []
  if (wordCount < 8) {
    parts.push('This review is too short to be useful.')
  } else if (penalty > 0 && has < 40) {
    parts.push('This review sounds generic or artificial and does not reflect a real personal experience.')
  } else {
    parts.push('This review lacks specific product details and personal experience.')
  }
  if (specificity < 5) parts.push('It does not mention the product type, material, fit, comfort, or delivery.')
  if (constructive < 3) parts.push('There is no constructive feedback explaining what was good or bad.')
  parts.push('To earn more points, describe the product, your experience using it, and whether you would recommend it.')
  return parts.join(' ')
}

// ─── main function ────────────────────────────────────────────────────────────

export function analyzeReview(reviewText: string): ReviewAnalysis {
  const text = reviewText.trim()
  const t = text.toLowerCase()
  const wordCount = text.split(/\s+/).filter(Boolean).length

  const specificity = scoreSpecificity(t, wordCount)
  const helpfulness = scoreHelpfulness(t, wordCount)
  const authenticity = scoreAuthenticity(t, wordCount)
  const structure = scoreStructure(text, wordCount)
  const constructiveFeedback = scoreConstructiveFeedback(t, wordCount)

  const rawScore = specificity + helpfulness + authenticity + structure + constructiveFeedback

  const has = humanAuthenticityScore(t, wordCount)

  let penalty = 0
  if (has < 35) penalty = 20
  else if (has < 55) penalty = 8

  const score = Math.min(100, Math.max(0, rawScore - penalty))

  let category: 'Poor Review' | 'Medium Review' | 'Good Review'
  let pointsAwarded: 20 | 70 | 100

  if (score < 40) {
    category = 'Poor Review'
    pointsAwarded = 20
  } else if (score < 75) {
    category = 'Medium Review'
    pointsAwarded = 70
  } else {
    category = 'Good Review'
    pointsAwarded = 100
  }

  const explanation = buildExplanation(
    score, specificity, helpfulness, authenticity,
    constructiveFeedback, has, penalty, wordCount,
  )

  const breakdown: ScoreBreakdown = {
    specificity,
    helpfulness,
    authenticity,
    structure,
    constructiveFeedback,
    humanAuthenticityScore: has,
    penalty,
  }

  return { score, category, pointsAwarded, explanation, breakdown }
}
