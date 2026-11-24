export type WorkoutLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscles: string;
  steps: string[];
  tip: string;
  images: string[];
}

export interface Workout {
  id: number;
  title: string;
  description: string;
  category: string;
  level: WorkoutLevel;
  duration: number;
  ownerId?: string;
  isLocal?: boolean;
  overview?: string;
  goal?: string;
  equipment?: string;
  frequency?: string;
  warmup?: string;
  cooldown?: string;
  exercises?: Exercise[];
}

export interface LevelInfo {
  slug: string;
  level: WorkoutLevel;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export const LEVELS: LevelInfo[] = [
  {
    slug: 'beginner', level: 'Beginner', title: 'Начинаещ',
    subtitle: 'Първи стъпки с правилна техника',
    description: 'Тренировки със собствено тегло и минимум уреди. Фокусът е върху правилната техника, стабилността на корема и изграждането на навик – 2–3 пъти седмично по 25–35 минути.',
    image: 'images/exercises/bodyweight-squat-1.jpg'
  },
  {
    slug: 'intermediate', level: 'Intermediate', title: 'Средно ниво',
    subtitle: 'Повече тежест, повече издръжливост',
    description: 'За хора с поне 3–6 месеца опит. Добавяме дъмбели, пудовки и интервални тренировки за видим прогрес в силата и кондицията – 3–4 пъти седмично по 30–50 минути.',
    image: 'images/exercises/goblet-squat-1.jpg'
  },
  {
    slug: 'advanced', level: 'Advanced', title: 'Напреднал',
    subtitle: 'Максимална сила и експлозивност',
    description: 'Базови движения с щанга, плиометрия и функционални комплекси с пудовка. Изискват отлична техника и опит над 1 година – 4–5 пъти седмично по 40–70 минути.',
    image: 'images/exercises/barbell-squat-1.jpg'
  }
];

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
}
