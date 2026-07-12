import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Sparkles } from "lucide-react";

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("请填写邮箱和密码");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "登录失败，请检查账号密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#DC0050] rounded-2xl mb-4 shadow-lg shadow-[#DC0050]/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">减脂营营养师工作台</h1>
          <p className="text-gray-500 mt-1">专业营养顾问的 AI 智能助手</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 border border-slate-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">登录账户</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC0050] focus:border-[#DC0050] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC0050] focus:border-[#DC0050] outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#DC0050] text-white font-medium rounded-lg hover:bg-[#c40045] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            还没有账户？{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-[#DC0050] hover:text-[#c40045] font-medium cursor-pointer"
            >
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
