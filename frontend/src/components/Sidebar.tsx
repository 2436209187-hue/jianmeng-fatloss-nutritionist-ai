import React from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Apple,
  CalendarRange,
  Sparkles,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasApiKey: boolean;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, hasApiKey, onLogout }: SidebarProps) {
  const { user } = useAuth();

  const mainMenuItems = [
    { id: "overview", label: "工作台", icon: LayoutDashboard, desc: "带营服务数据统计与概览" },
    { id: "dietPlan", label: "饮食方案", icon: CalendarRange, desc: "智能推荐7日饮食计划" },
    { id: "meals", label: "餐食识别", icon: Apple, desc: "饮食识别、配料分析、菜单建议" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-hidden h-full">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md shadow-brand-red/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-slate-800 text-xs leading-tight tracking-tight">减脂营·营养师AI工作台</h1>
            <p className="text-[10px] font-medium text-brand-red mt-0.5 tracking-wider">专业营养师系统</p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id ||
            (item.id === "meals" && ["meals", "diet", "ingredients", "menu"].includes(activeTab));
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? "bg-brand-red-light text-brand-red font-medium shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                isActive ? "text-brand-red" : "text-slate-400 group-hover:text-slate-600"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm leading-snug">{item.label}</div>
                <div className={`text-[11px] truncate mt-0.5 ${
                  isActive ? "text-brand-red/85" : "text-slate-400"
                }`}>
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* API Indicator */}
      <div className="p-3 border-t border-slate-50">
        <div className={`p-3 rounded-xl border flex items-center gap-2 ${
          hasApiKey
            ? "bg-brand-red-light border-brand-red-border"
            : "bg-amber-50/40 border-amber-100"
        }`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${hasApiKey ? "bg-brand-red animate-pulse" : "bg-amber-500"}`} />
          <span className="text-[11px] font-semibold text-slate-700 truncate">
            {hasApiKey ? "AI 引擎已连接" : "AI 密钥未配置"}
          </span>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-brand-red/10 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-brand-red text-sm">
            {user?.name?.charAt(0) || "营"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{user?.name || "营养师"}</div>
            <div className="text-[11px] text-slate-400 truncate">{user?.role === "nutritionist" ? "注册营养顾问" : user?.role || "用户"}</div>
          </div>
          <button
            onClick={onLogout}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
