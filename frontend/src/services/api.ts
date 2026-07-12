// 开发环境走 Vite 代理，生产环境使用同源或环境变量
const API_BASE = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || "") : "";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `请求失败 (${response.status})`);
  }

  return data as T;
}

// ============ 认证 API ============
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authAPI = {
  login: (input: LoginInput) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  register: (input: RegisterInput) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getMe: () => request<{ user: AuthResponse["user"] }>("/api/auth/me"),
};

// ============ 工作台 API ============
export interface OverviewData {
  stats: {
    today: number;
    week: number;
    month: number;
    camperCount: number;
    apiCounts: Record<string, number>;
    timePeriod: string;
  };
  recentLogs: Array<{
    id: string;
    apiType: string;
    inputSummary: string | null;
    status: string;
    createdAt: string;
  }>;
}

export const overviewAPI = {
  get: (period = "today") => request<OverviewData>(`/api/overview?period=${period}`),
};

// ============ 营员管理 API ============
export interface CamperInput {
  name: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  targetWeight?: number;
  medicalHistory?: string;
  allergies?: string;
  digestiveIssues?: string;
  tastePreferences?: string;
  activityLevel?: string;
}

export interface Camper extends CamperInput {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const camperAPI = {
  list: () => request<Camper[]>("/api/campers"),
  create: (input: CamperInput) =>
    request<Camper>("/api/campers", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Partial<CamperInput>) =>
    request<Camper>(`/api/campers/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  delete: (id: string) =>
    request<void>(`/api/campers/${id}`, { method: "DELETE" }),
};

// ============ 外食推荐 API ============
export interface DiningRecInput {
  scenario: string;
  goal: string;
}

export interface DiningRecOutput {
  scenario: string;
  suitabilityScore: number;
  recommendedDishes: Array<{
    name: string;
    estimatedCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    reason: string;
  }>;
  customizationTips: string[];
  hiddenTraps: string[];
  nutritionalAdvice: string;
}

export const diningAPI = {
  recommend: (input: DiningRecInput) =>
    request<DiningRecOutput>("/api/dining/recommend", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  history: () => request<any[]>("/api/dining/history"),
};

// ============ 方案审核 API ============
export interface AuditOutput {
  overallScore: number;
  dailyEvaluations: Array<{
    dayNum: number;
    dayName: string;
    score: number;
    summary: string;
    issues: string[];
  }>;
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  pros: string[];
  cons: string[];
  expertRecommendations: string[];
}

export const auditAPI = {
  audit: (plan: any[], goal: string) =>
    request<AuditOutput>("/api/audit", {
      method: "POST",
      body: JSON.stringify({ plan, goal }),
    }),
  history: () => request<any[]>("/api/audit/history"),
};

// ============ 历史记录 API ============
export const historyAPI = {
  list: (params?: { page?: number; pageSize?: number; type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
    if (params?.type) searchParams.set("type", params.type);
    const qs = searchParams.toString();
    return request<any>(`/api/history${qs ? `?${qs}` : ""}`);
  },
};

// ============ 状态检测 API ============
export const statusAPI = {
  check: () =>
    request<{ status: string; hasApiKey: boolean }>("/api/status"),
};

// ============ 饮食识别 API ============
export interface DietRecognitionInput {
  image: string;       // base64
  note?: string;
  meal_period: string;
  age?: string;
  gender?: string;
  height_cm?: string;
  weight_kg?: string;
  waist_cm?: string;
}

export interface DietRecognitionFood {
  food_name: string;
  estimated_weight_g: number;
  estimated_calories: number;
}

export interface DietRecognitionOutput {
  success: boolean;
  foods: DietRecognitionFood[];
  comment: string;
}

export const dietRecognitionAPI = {
  analyze: (input: DietRecognitionInput) =>
    request<DietRecognitionOutput>("/api/diet/analyze", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

// ============ 配料分析 API ============
export interface IngredientItem {
  ingredient_name: string;
  analysis: string;
  risk_level: "high" | "medium" | "low";
}

export interface IngredientAnalysisOutput {
  success: boolean;
  food_rating?: "green" | "yellow" | "red";
  dietary_advice?: string;
  ingredient_analysis?: IngredientItem[];
  error?: string;
}

export const ingredientAPI = {
  analyze: (input: DietRecognitionInput) =>
    request<IngredientAnalysisOutput>("/api/diet/ingredient-analyze", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

// ============ 菜单建议 API ============
export interface MenuDish {
  dish_name: string;
  reason: string;
}

export interface MenuRecommendOutput {
  success: boolean;
  recommended_dishes?: MenuDish[];
  not_recommended_dishes?: MenuDish[];
  comment?: string;
  error?: string;
}

export const menuAPI = {
  recommend: (input: DietRecognitionInput) =>
    request<MenuRecommendOutput>("/api/diet/menu-recommend", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

// ============ 饮食方案 API ============
export interface DietPlanInput {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  bodyFat: string;
  waist: string;
  targetWeight: string;
  lossSpeed: string;
  dailyActivity: string;
  exercise: string;
  tastes: string;
  allergies: string;
  medicalHistory: string;
  digestion: string;
}

export interface FoodItem {
  food_name: string;
  grams: number;
  kcal: number;
}

export interface DayMeals {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snack?: FoodItem[];
}

export interface DayPlan {
  day: number;
  meals: DayMeals;
}

export interface DietPlanOutput {
  core_meal_principle: string;
  seven_day_total: {
    kcal: number;
    protein_g: number;
    fat_g: number;
    carbohydrate_g: number;
  };
  days: DayPlan[];
}

export const dietPlanAPI = {
  generate: (input: DietPlanInput) =>
    request<DietPlanOutput>("/api/diet-plan/generate", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
