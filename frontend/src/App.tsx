import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import DietPlan from "./components/DietPlan";
import Meals from "./components/Meals";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { HeartPulse, Sparkles } from "lucide-react";

type AuthPage = "login" | "register";

export default function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>("login");

  // Check API status
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === "boolean") {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => {
        console.error("Failed to check API status:", err);
      });
  }, [isAuthenticated]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#DC0050] rounded-2xl mb-4 shadow-lg shadow-[#DC0050]/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> show login/register
  if (!isAuthenticated) {
    if (authPage === "register") {
      return <RegisterPage onSwitchToLogin={() => setAuthPage("login")} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthPage("register")} />;
  }

  // Title dictionary
  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "工作台控制中心", subtitle: "带营服务监控与智能系统总控" },
    dietPlan: { title: "定制化饮食方案", subtitle: "智能推荐7日饮食计划" },
    meals: { title: "餐食识别中心", subtitle: "饮食识别、配料分析、菜单建议" },
    diet: { title: "餐食识别中心", subtitle: "饮食识别、配料分析、菜单建议" },
    ingredients: { title: "餐食识别中心", subtitle: "饮食识别、配料分析、菜单建议" },
    menu: { title: "餐食识别中心", subtitle: "饮食识别、配料分析、菜单建议" },
  };

  const renderContent = () => {
    const isOverview = activeTab === "overview";
    const isDietPlan = activeTab === "dietPlan";
    const isMeals = ["meals", "diet", "ingredients", "menu"].includes(activeTab);
    const mealsSubTab = activeTab === "menu" ? "menu" : activeTab === "ingredients" ? "ingredients" : "diet";

    return (
      <>
        {/* 所有页面保持挂载，用 CSS 控制显隐，避免状态丢失 */}
        <div style={{ display: isOverview ? "block" : "none" }}>
          <Overview setActiveTab={setActiveTab} />
        </div>
        <div style={{ display: isDietPlan ? "block" : "none" }}>
          <DietPlan />
        </div>
        <div style={{ display: isMeals ? "block" : "none" }}>
          <Meals initialSubTab={mealsSubTab} />
        </div>
      </>
    );
  };

  return (
    <div className="flex h-[90.9vh] bg-slate-50 overflow-hidden font-sans select-none">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasApiKey={hasApiKey}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        <header className="h-14 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span>{tabTitles[activeTab]?.title || "工作台"}</span>
              <span className="text-slate-200 font-light">|</span>
              <span className="text-[11px] font-medium text-slate-400 tracking-normal">{tabTitles[activeTab]?.subtitle}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-brand-red-light py-1 px-2.5 rounded-lg border border-brand-red-border">
              <HeartPulse className="w-3.5 h-3.5 text-brand-red animate-pulse" />
              <span className="text-[10px] font-bold text-brand-red">减脂营 21 期</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-6">
          <div className="max-w-7xl mx-auto w-full pb-8">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
}
