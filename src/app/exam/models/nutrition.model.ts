export type NutritionGoal = 'all' | 'maintain' | 'healthy-start';

export interface VitaminInfo {
  code: string;
  name: string;
  benefit: string;
  sources: string[];
}

export interface MealPlan {
  id: string;
  goal: Exclude<NutritionGoal, 'all'>;
  goalLabel: string;
  title: string;
  calories: string;
  protein: string;
  description: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
  keyVitamins: string[];
}