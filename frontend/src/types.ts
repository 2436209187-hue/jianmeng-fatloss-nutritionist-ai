export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietAnalysisResult {
  foodName: string;
  healthScore: number; // 0 - 100
  totalCalories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  sodium: number; // mg
  analysis: string;
  pros: string[];
  cons: string[];
  suggestions: string[];
}

export interface AdditiveItem {
  name: string;
  type: string; // e.g., Preservative, Sweetener, Colorant
  safetyLevel: 'safe' | 'caution' | 'hazard';
  desc: string;
}

export interface IngredientScanResult {
  productName: string;
  safetyScore: number; // 0 - 100
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  additives: AdditiveItem[];
  summary: string;
  dietAdvice: string;
}

export interface RecommendedDish {
  name: string;
  estimatedCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  reason: string;
}

export interface DiningOutResult {
  scenario: string;
  suitabilityScore: number; // 0 - 100
  recommendedDishes: RecommendedDish[];
  customizationTips: string[]; // e.g., "no mayo", "sauce on side"
  hiddenTraps: string[]; // e.g., "sauces are calorie bombs"
  nutritionalAdvice: string;
}

export interface MealPlanDay {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export interface SevenDayMealPlan {
  days: MealPlanDay[]; // exactly length 7
}

export interface DailyEvaluation {
  dayNum: number;
  dayName: string;
  score: number;
  summary: string;
  issues: string[];
}

export interface DietPlanAuditResult {
  overallScore: number; // 0 - 100
  dailyEvaluations: DailyEvaluation[];
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  pros: string[];
  cons: string[];
  expertRecommendations: string[];
}
