-- ============================================
-- 关闭 RLS（后端自行处理鉴权，无需数据库级安全策略）
-- 在 Supabase SQL Editor 中执行
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE campers DISABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE dining_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs DISABLE ROW LEVEL SECURITY;
