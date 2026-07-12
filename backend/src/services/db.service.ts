import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = env.SUPABASE_URL || "https://sfjbuhguhevtiuteahkx.supabase.co";
    const key = env.SUPABASE_ANON_KEY || "sb_publishable__rDzGHzjgC-LyyXnIpdilw_ld7Ouyp7";
    supabase = createClient(url, key);
  }
  return supabase;
}

// ============ 用户操作 ============
export async function findUserByEmail(email: string) {
  const { data, error } = await getSupabase()
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function findUserById(id: string) {
  const { data, error } = await getSupabase()
    .from("users")
    .select("id, name, email, role")
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const { data, error } = await getSupabase()
    .from("users")
    .insert({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role || "nutritionist",
    })
    .select("id, name, email, role")
    .single();
  if (error) throw error;
  return data;
}

// ============ 营员操作 ============
export async function getCampers(userId: string) {
  const { data, error } = await getSupabase()
    .from("campers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCamper(userId: string, camper: any) {
  const { data, error } = await getSupabase()
    .from("campers")
    .insert({ ...camper, user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateCamper(id: string, userId: string, updates: any) {
  const { data, error } = await getSupabase()
    .from("campers")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCamper(id: string, userId: string) {
  const { error } = await getSupabase()
    .from("campers")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function countCampers(userId: string) {
  const { count, error } = await getSupabase()
    .from("campers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count || 0;
}

// ============ API 日志 ============
export async function createApiLog(log: {
  userId: string;
  apiType: string;
  inputSummary?: string;
  status?: string;
}) {
  const { error } = await getSupabase()
    .from("api_logs")
    .insert({
      user_id: log.userId,
      api_type: log.apiType,
      input_summary: log.inputSummary || null,
      status: log.status || "success",
    });
  if (error) throw error;
}

export async function getApiLogCount(userId: string, since: Date) {
  const { count, error } = await getSupabase()
    .from("api_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since.toISOString());
  if (error) throw error;
  return count || 0;
}

export async function getApiLogCountByTypes(userId: string, since: Date) {
  const types = ["diet_plan", "diet_analyze", "ingredient_analyze", "menu_recommend"];
  const counts: Record<string, number> = {};
  for (const t of types) {
    const { count, error } = await getSupabase()
      .from("api_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("api_type", t)
      .gte("created_at", since.toISOString());
    if (error) throw error;
    counts[t] = count || 0;
  }
  return counts;
}

export async function getRecentApiLogs(userId: string, limit = 20) {
  const { data, error } = await getSupabase()
    .from("api_logs")
    .select("id, api_type, input_summary, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    apiType: row.api_type,
    inputSummary: row.input_summary,
    status: row.status,
    createdAt: row.created_at,
  }));
}

// ============ 外食推荐日志 ============
export async function createDiningLog(log: {
  userId: string;
  scenario: string;
  goal: string;
  resultData: any;
  score?: number;
}) {
  const { error } = await getSupabase()
    .from("dining_logs")
    .insert({
      user_id: log.userId,
      scenario: log.scenario,
      goal: log.goal,
      result_data: log.resultData,
      score: log.score || null,
    });
  if (error) throw error;
}

export async function getDiningLogs(userId: string, limit = 20) {
  const { data, error } = await getSupabase()
    .from("dining_logs")
    .select("id, scenario, goal, score, result_data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ============ 审核日志 ============
export async function createAuditLog(log: {
  userId: string;
  planData: any;
  auditResult: any;
  dietGoal?: string;
  overallScore?: number;
}) {
  const { error } = await getSupabase()
    .from("audit_logs")
    .insert({
      user_id: log.userId,
      plan_data: log.planData,
      audit_result: log.auditResult,
      diet_goal: log.dietGoal || null,
      overall_score: log.overallScore || null,
    });
  if (error) throw error;
}

export async function getAuditLogs(userId: string, limit = 20) {
  const { data, error } = await getSupabase()
    .from("audit_logs")
    .select("id, diet_goal, overall_score, audit_result, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
