export interface Workout {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  ownerId?: string;
  isLocal?: boolean;
}
export interface AppUser {
  id: string;
  email: string;
  displayName: string;
}
