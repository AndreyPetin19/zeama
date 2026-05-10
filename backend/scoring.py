"""
ZEAMA AI Review Scoring Engine
5-dimension scoring: Specificity · Helpfulness · Authenticity · Structure · Constructive Feedback
Supports English and Russian reviews.
"""
import random
import re
import string

# ── keyword lists (EN + RU) ───────────────────────────────────────────────────

SPECIFICITY_KW = [
    # EN — product attributes
    'material', 'fabric', 'stitching', 'zipper', 'button', 'thread', 'seam', 'lining',
    # EN — size & fit
    'size', 'fit', 'oversized', 'tight', 'loose', 'length', 'sleeve', 'waist', 'shoulder',
    # EN — feel & comfort
    'comfort', 'comfortable', 'soft', 'hard', 'rough', 'smooth', 'warm', 'cold', 'breathable',
    # EN — quality
    'quality', 'durable', 'durability', 'thick', 'thin', 'strong', 'weak', 'sturdy',
    # EN — delivery
    'delivery', 'packaging', 'shipping', 'arrived', 'damaged', 'sealed', 'box',
    # EN — care
    'washing', 'washed', 'faded', 'shrunk', 'shrank', 'color',
    # EN — price
    'price', 'worth', 'value', 'expensive', 'cheap', 'affordable',
    # EN — products
    'hoodie', 'jacket', 'shirt', 'shoes', 'sneakers', 'boots', 'bag', 'pants', 'dress',
    # EN — time
    'week', 'weeks', 'month', 'months', 'hours', 'days',
    # EN — physical
    'sole', 'weight', 'texture', 'smell', 'pocket', 'collar', 'hood', 'cuff', 'cushion',
    'recommend', 'suggestion',

    # RU — продукт
    'кроссовки', 'худи', 'кофта', 'обувь', 'товар', 'продукт', 'куртка', 'сумка',
    'футболка', 'штаны', 'джинсы', 'платье', 'шорты', 'носки', 'ботинки', 'кеды',
    # RU — материал
    'материал', 'ткань', 'подошва', 'молния', 'шов', 'швы', 'подкладка', 'строчка',
    'амортизация', 'подошвы', 'стелька', 'замок',
    # RU — размер
    'размер', 'посадка', 'размеру', 'размера', 'подошёл', 'подошли',
    'маломерит', 'большемерит', 'подходит',
    # RU — комфорт
    'удобный', 'удобная', 'удобные', 'удобно', 'комфорт', 'комфортные', 'комфортно',
    'мягкий', 'мягкая', 'мягкие', 'мягко', 'жёсткий', 'тёплый', 'тёплые',
    'дышащий', 'не давит', 'фиксируется', 'фиксация',
    # RU — качество
    'качество', 'качественный', 'качественная', 'качественные', 'прочный', 'прочные',
    'долговечный', 'крепкий',
    # RU — внешний вид
    'цвет', 'дизайн', 'выглядит', 'выглядят', 'форма',
    # RU — доставка
    'доставка', 'доставили', 'упаковка', 'пришло', 'пришли', 'получил', 'получила',
    # RU — цена
    'цена', 'стоимость', 'дорого', 'дёшево', 'дешёво', 'недорого',
    # RU — время
    'неделю', 'недели', 'недель', 'месяц', 'месяца', 'месяцев', 'дней', 'дня',
    'часов', 'суток',
    # RU — уход
    'стирка', 'стирал', 'стирала', 'постирал', 'постирала', 'после стирки',
]

HELPFULNESS_PATTERNS = [
    # EN
    'i recommend', 'i would recommend', 'would recommend', 'do not recommend',
    "don't recommend", 'worth buying', 'not worth', 'worth it', 'buy this',
    "don't buy", 'would not buy', 'would buy again', 'ordering again',
    'size down', 'size up', 'size smaller', 'size bigger', 'buy one size',
    'size runs', 'size is accurate', 'size was accurate',
    'good for', 'not good for', 'best for', 'perfect for', 'ideal for',
    # RU
    'рекомендую', 'не рекомендую', 'советую', 'не советую',
    'стоит брать', 'стоит купить', 'покупать стоит', 'не стоит брать',
    'стоит своих денег', 'цена оправдана', 'цена оправдывает',
    'советую брать', 'советую заказать', 'берите на размер', 'брать размер',
    'подойдёт для', 'подходит для', 'не подходит для', 'идеально для',
    'куплю ещё', 'куплю снова', 'закажу снова', 'закажу ещё', 'буду заказывать',
]

CONTRAST_WORDS = [
    # EN
    'however', 'but', 'although', 'except', 'though', 'yet', 'while',
    'the only problem', 'the only issue', 'the downside', 'unfortunately',
    'on the downside', 'the issue', 'the problem is',
    # RU
    'однако', 'зато', 'хотя', 'тем не менее', 'несмотря на',
    'из минусов', 'из недостатков', 'единственный минус', 'единственный недостаток',
    'к сожалению', 'к минусам', 'минус один', 'есть минус', 'есть недостаток',
    'но есть', 'но стоит', 'правда есть',
]

FIRST_PERSON = [
    # EN
    'i bought', 'i purchased', 'i ordered', 'i received', 'i used', 'i wore',
    'i tried', 'i washed', 'i walked', 'after washing', 'after wearing',
    'after using', 'when i', 'my experience', 'i found', 'i noticed', 'for me',
    'last week', 'last month', 'yesterday', 'i would', 'i have',
    'after one wash', 'for two weeks', 'for a week', 'for a month',
    # RU
    'пользуюсь', 'ношу', 'носил', 'носила', 'носили', 'купил', 'купила', 'купили',
    'брал', 'брала', 'заказал', 'заказала', 'получил', 'получила', 'использую',
    'использовал', 'использовала', 'попробовал', 'попробовала', 'взял', 'взяла',
    'у меня', 'мне понравилось', 'мне не понравилось', 'мне нравится',
    'я доволен', 'я довольна', 'я купил', 'я купила', 'я заказал', 'я заказала',
    'моё мнение', 'мой опыт', 'для меня', 'я бы', 'я уже',
    'несколько дней', 'несколько недель', 'несколько месяцев', 'уже месяц', 'уже неделю',
    'каждый день', 'повседневной носки', 'после носки', 'после стирки', 'после использования',
]

GENERIC_PHRASES = [
    # EN
    'excellent product', 'highly recommend', 'exceeded my expectations',
    'amazing quality', 'wonderful product', 'this product is amazing',
    'great quality and amazing', 'overall, this is an excellent',
    'amazing product', 'fantastic product', 'perfect product',
    '5 stars', 'five stars', 'best product ever',
    'would recommend to everyone', 'i highly recommend to everyone',
    # RU
    'отличный товар', 'товар отличный', 'прекрасный товар',
    'очень доволен покупкой', 'остался очень доволен',
    'рекомендую всем без исключения', 'советую всем',
    'лучший товар', 'лучшая покупка в жизни',
    'топ товар', 'огонь товар',
    'всё отлично', 'всё хорошо', 'всё супер',
]

CONSTRUCTIVE_NEG = [
    # EN
    'the problem is', 'the issue is', 'the downside', 'however', 'but the',
    'although', 'unfortunately', 'after washing', 'after one wash',
    'the only thing', 'i would improve', 'could be improved', 'should be',
    'faded', 'shrunk', 'shrank', 'broke', 'got stuck', 'gets dirty',
    'too small', 'too big', 'too long', 'too short', 'slightly longer', 'a bit',
    # RU
    'из минусов', 'из недостатков', 'единственный минус', 'есть минус',
    'минус в том', 'недостаток в том', 'к сожалению', 'жаль',
    'проблема в том', 'есть проблема', 'есть нюанс',
    'не понравилось', 'не нравится', 'немного', 'слегка', 'чуть-чуть', 'чуть',
    'слишком большой', 'слишком маленький', 'великоват', 'маловат',
    'после стирки', 'после носки', 'отклеилось', 'потёрлось', 'поблёкло',
    'скрипит', 'натирает', 'жмёт',
]

CONSTRUCTIVE_POS = [
    # EN
    'the fabric', 'the material', 'the quality', 'the stitching', 'the sole',
    'delivery was', 'the fit', 'the size', 'the comfort', 'the zipper',
    # RU
    'материал', 'ткань хорошая', 'качество материала', 'подошва хорошая',
    'амортизация хорошая', 'доставка быстрая', 'посадка отличная',
    'размер подошёл', 'комфорт отличный', 'удобно носить', 'качество швов',
    'цвет красивый', 'дизайн нравится',
]

IMPROVEMENT_SUGGESTIONS = [
    # EN
    'should improve', 'would be better if', 'i would suggest', 'i wish',
    'could be better', 'needs improvement', 'hope they fix', 'next time',
    # RU
    'хотелось бы', 'было бы лучше', 'стоило бы', 'надеюсь улучшат',
    'пожелание', 'хочется', 'можно было бы', 'нужно улучшить',
]


def generate_coupon_code() -> str:
    return 'ZM-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))


# ── dimension scorers ─────────────────────────────────────────────────────────

def score_specificity(t: str, wc: int) -> int:
    found = sum(1 for k in SPECIFICITY_KW if k in t)
    base = 3 if wc >= 10 else (5 if wc >= 20 else (7 if wc >= 40 else 0))
    return min(25, round(base + min(18, found * 2.2)))


def score_helpfulness(t: str, wc: int) -> int:
    s = 0
    if any(p in t for p in HELPFULNESS_PATTERNS): s += 8
    if any(p in t for p in CONTRAST_WORDS):        s += 6
    if 'pros' in t or 'cons' in t:                 s += 5
    if any(p in t for p in ['would buy again', 'ordering again', 'would not buy',
                             'куплю ещё', 'закажу снова', 'буду заказывать']): s += 5
    if wc >= 20: s += 4
    if wc >= 40: s += 2
    return min(25, s)


def score_authenticity(t: str, wc: int) -> int:
    s = 8
    fp = sum(1 for p in FIRST_PERSON if p in t)
    s += min(9, fp * 3)
    gen = sum(1 for p in GENERIC_PHRASES if p in t)
    s -= gen * 5

    pos_words = ['good', 'great', 'comfortable', 'soft', 'fast', 'nice',
                 'удобный', 'удобно', 'хорошо', 'нравится', 'мягкий', 'комфортно', 'доволен', 'довольна']
    neg_words = ['bad', 'issue', 'problem', 'faded', 'shrank', 'stuck',
                 'минус', 'недостаток', 'проблема', 'жаль', 'не понравилось', 'нюанс']
    has_pos = any(w in t for w in pos_words)
    has_neg = any(w in t for w in neg_words)
    if has_pos and has_neg: s += 4
    return min(20, max(0, s))


def score_structure(text: str, wc: int) -> int:
    if wc < 5:    s = 2
    elif wc < 10: s = 5
    elif wc < 20: s = 9
    elif wc < 40: s = 12
    else:         s = 13

    words = text.lower().split()
    unique_ratio = len(set(words)) / max(len(words), 1)
    if unique_ratio < 0.45: s -= 7
    elif unique_ratio < 0.60: s -= 3

    sentences = [x for x in re.split(r'[.!?]+', text) if len(x.strip()) > 4]
    if len(sentences) >= 2: s += 1
    if len(sentences) >= 3: s += 1
    return min(15, max(0, s))


def score_constructive(t: str, wc: int) -> int:
    neg = sum(1 for p in CONSTRUCTIVE_NEG if p in t)
    pos = sum(1 for p in CONSTRUCTIVE_POS if p in t)
    s = min(7, round(neg * 2.5)) + min(4, round(pos * 1.5))
    if any(p in t for p in IMPROVEMENT_SUGGESTIONS): s += 4
    if wc >= 25 and s >= 4: s += 2
    return min(15, s)


def human_authenticity_score(t: str, wc: int) -> int:
    s = 55
    fp = sum(1 for p in FIRST_PERSON if p in t)
    s += min(25, fp * 7)
    gen = sum(1 for p in GENERIC_PHRASES if p in t)
    s -= gen * 12

    # repetition penalty — relaxed for long reviews
    words = [w for w in t.split() if len(w) > 3]
    freq: dict[str, int] = {}
    for w in words: freq[w] = freq.get(w, 0) + 1
    max_rep = max(freq.values(), default=0)
    if wc < 30:
        if max_rep >= 4:   s -= 20
        elif max_rep >= 3: s -= 10
    else:
        if max_rep >= 6:   s -= 15
        elif max_rep >= 5: s -= 8

    if wc < 5:    s -= 35
    elif wc < 10: s -= 18

    pos_words = ['good', 'great', 'comfortable', 'soft', 'fast', 'nice', 'warm',
                 'удобный', 'удобно', 'хорошо', 'нравится', 'мягкий', 'комфортно',
                 'доволен', 'довольна', 'отличный', 'качественный']
    neg_words = ['but', 'however', 'issue', 'problem', 'bad', 'faded', 'slow',
                 'минус', 'недостаток', 'проблема', 'жаль', 'нюанс', 'не понравилось',
                 'однако', 'зато', 'хотя', 'к сожалению']
    has_pos = any(w in t for w in pos_words)
    has_neg = any(w in t for w in neg_words)
    if has_pos and has_neg: s += 12

    real_details = [
        'after washing', 'after one wash', 'for two weeks', 'for a week',
        'for a month', 'three hours', 'one hour', 'last week', 'last month',
        'несколько дней', 'несколько недель', 'несколько месяцев', 'уже месяц',
        'каждый день', 'повседневной носки', 'после стирки', 'после носки',
        'уже неделю', 'уже три', 'уже два',
    ]
    s += min(15, sum(7 for p in real_details if p in t))
    return min(100, max(0, s))


def _explanation(score: int, spec: int, help_: int, auth: int,
                 cons: int, has: int, penalty: int, wc: int) -> str:
    if score >= 75:
        parts = ['This review is detailed, specific, and genuinely useful for other buyers.']
        if spec >= 18: parts.append('It includes concrete product details and real usage experience.')
        if cons >= 10: parts.append('The constructive feedback about both strengths and issues adds significant value.')
        if help_ >= 18: parts.append('Other buyers can make informed decisions based on this review.')
        return ' '.join(parts)

    if score >= 40:
        parts = ['This is a useful review with some real details.']
        if spec < 12: parts.append('Adding more specific details — material, fit, size, or delivery — would improve the score.')
        if cons < 8:  parts.append('Mentioning clear pros and cons or a specific issue would make it more helpful.')
        if help_ < 12: parts.append('A sizing recommendation or "would you buy again" statement would help other buyers.')
        return ' '.join(parts)

    parts = []
    if wc < 8:         parts.append('This review is too short to be useful.')
    elif penalty > 0:  parts.append('This review sounds generic or artificial.')
    else:              parts.append('This review lacks specific product details and personal experience.')
    if spec < 5:  parts.append('It does not mention the product type, material, fit, comfort, or delivery.')
    if cons < 3:  parts.append('There is no constructive feedback explaining what was good or bad.')
    parts.append('Write about the product, your experience, and whether you would recommend it to earn more points.')
    return ' '.join(parts)


# ── main function ─────────────────────────────────────────────────────────────

def score_review(review_text: str, rating: int) -> dict:
    text = review_text.strip()
    t = text.lower()
    wc = len(text.split())

    spec   = score_specificity(t, wc)
    help_  = score_helpfulness(t, wc)
    auth   = score_authenticity(t, wc)
    struct = score_structure(text, wc)
    cons   = score_constructive(t, wc)
    raw    = spec + help_ + auth + struct + cons

    has     = human_authenticity_score(t, wc)
    penalty = 20 if has < 35 else (8 if has < 55 else 0)
    score   = min(100, max(0, raw - penalty))

    if score >= 75:
        category, points = 'Good Review', 100
    elif score >= 40:
        category, points = 'Medium Review', 70
    else:
        category, points = 'Poor Review', 20

    sentiment = 'positive' if rating >= 4 else ('neutral' if rating == 3 else 'negative')
    pos_words = ['great', 'excellent', 'love', 'amazing', 'wonderful']
    neg_words = ['bad', 'terrible', 'awful', 'worst', 'horrible']
    if sum(1 for w in pos_words if w in t) > sum(1 for w in neg_words if w in t) and rating <= 2:
        sentiment = 'mixed'

    coupon_code = generate_coupon_code() if points > 20 else None
    explanation = _explanation(score, spec, help_, auth, cons, has, penalty, wc)

    return {
        'quality_score':            score,
        'detail_score':             spec,
        'usefulness_score':         help_,
        'authenticity':             auth,
        'structure':                struct,
        'constructive':             cons,
        'human_authenticity_score': has,
        'penalty':                  penalty,
        'category':                 category,
        'points_awarded':           points,
        'sentiment':                sentiment,
        'spam_risk':                'high' if has < 35 else ('medium' if has < 55 else 'low'),
        'reward_level':             'excellent' if score >= 80 else ('good' if score >= 60 else ('fair' if score >= 40 else 'poor')),
        'coupon_percent':           15 if score >= 80 else (10 if score >= 60 else (5 if score >= 40 else 0)),
        'coupon_code':              coupon_code,
        'explanation':              explanation,
        'suggestion':               explanation,
    }
