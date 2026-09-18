export const DEFAULT_HABITS = [
  {
    id: 'habit_early_bed',
    name: 'Early Bed',
    icon: '🌅',
    category: 'Health',
    description: 'Get into bed by 10:30 PM for restorative sleep and mental clarity.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#10B981' // emerald
  },
  {
    id: 'habit_study',
    name: 'Study',
    icon: '📚',
    category: 'Study',
    description: 'Dedicate focused time to study core concepts, books, or documentation.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#3B82F6' // blue
  },
  {
    id: 'habit_coding',
    name: 'Coding',
    icon: '💻',
    category: 'Coding',
    description: 'Build projects, ship features, or write clean, well-tested code.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#6366F1' // indigo
  },
  {
    id: 'habit_leetcode',
    name: 'LeetCode',
    icon: '🧩',
    category: 'Coding',
    description: 'Solve at least 1-2 algorithm and data structure problems.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#F59E0B' // amber
  },
  {
    id: 'habit_meditation',
    name: 'Meditation / Nam Jap',
    icon: '🧘',
    category: 'Mindfulness',
    description: '15-20 minutes of silent meditation, deep breathing, or Nam Jap.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#8B5CF6' // purple
  },
  {
    id: 'habit_healthy_food',
    name: 'Healthy Food',
    icon: '🥗',
    category: 'Health',
    description: 'Nourish your body with clean, wholesome, nutrient-rich meals.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#22C55E' // green
  },
  {
    id: 'habit_self_care',
    name: 'Self Care',
    icon: '❤️',
    category: 'Lifestyle',
    description: 'Personal hygiene, stretching, hydration, and taking time to unwind.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#EC4899' // pink
  },
  {
    id: 'habit_less_screen_time',
    name: 'Less Screen Time',
    icon: '📵',
    category: 'Productivity',
    description: 'Limit non-work recreational social media and doomscrolling under 1 hour.',
    createdAt: '2026-09-01',
    enabled: true,
    color: '#06B6D4' // cyan
  }
];

export const CATEGORIES = [
  { id: 'Coding', label: 'Coding', icon: '💻', color: '#6366F1' },
  { id: 'Study', label: 'Study', icon: '📚', color: '#3B82F6' },
  { id: 'Health', label: 'Health', icon: '🥗', color: '#10B981' },
  { id: 'Productivity', label: 'Productivity', icon: '⚡', color: '#06B6D4' },
  { id: 'Mindfulness', label: 'Mindfulness', icon: '🧘', color: '#8B5CF6' },
  { id: 'Lifestyle', label: 'Lifestyle', icon: '❤️', color: '#EC4899' }
];
