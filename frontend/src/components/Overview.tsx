import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Brain,
  Copy,
  Check,
  Apple,
  ShieldAlert,
  Compass,
  CalendarRange,
  ArrowRight,
  Clock,
  CalendarDays,
  Activity,
  Database,
  Loader2
} from "lucide-react";
import { overviewAPI, type OverviewData } from "../services/api";

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

const API_TYPE_LABELS: Record<string, string> = {
  dining_recommend: "外食推荐",
  diet_plan_audit: "方案审核",
  diet_plan: "饮食方案",
  diet_analyze: "饮食识别",
  ingredient_analyze: "配料分析",
  menu_recommend: "菜单建议",
};

const API_CARDS = [
  { key: "diet_plan", label: "饮食方案生成", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", iconBg: "bg-red-100" },
  { key: "diet_analyze", label: "膳食图像识别", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", iconBg: "bg-green-100" },
  { key: "ingredient_analyze", label: "配料分析", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100" },
  { key: "menu_recommend", label: "菜单建议", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", iconBg: "bg-purple-100" },
];

export default function Overview({ setActiveTab }: OverviewProps) {
  const [timePeriod, setTimePeriod] = useState<"today" | "week" | "month">("today");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    overviewAPI.get(timePeriod)
      .then(setData)
      .catch((err) => console.error("获取工作台数据失败:", err))
      .finally(() => setLoading(false));
  }, [timePeriod]);

  const stats = data?.stats;
  const recentLogs = data?.recentLogs || [];

  const quickActions = [
    {
      title: "饮食方案生成",
      desc: "输入营员基本指标、体脂率、过敏原和口味偏好，秒级量身定制 7 日黄金饮食食谱。",
      tab: "dietPlan",
      icon: CalendarRange,
      color: "bg-brand-red-light text-brand-red border-brand-red-border",
    },
    {
      title: "膳食图像识别",
      desc: "上传营员发来的实体餐食照片，智能测算食物卡路里及营养素占比。",
      tab: "diet",
      icon: Apple,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "配料分析",
      desc: "扫描食品配料表，识别添加剂成分，排查有害促炎成分。",
      tab: "ingredients",
      icon: ShieldAlert,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      title: "菜单建议",
      desc: "分析餐厅菜单，推荐减脂友好菜品，标注避坑菜品。",
      tab: "menu",
      icon: Compass,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    }
  ];

  const tips = [
    "「膳食纤维」是减脂期的黄金控糖物质。建议学员在午餐中加入不少于 150g 的深绿色叶菜（如菠菜、油麦菜），能显著平缓餐后血糖波动，抑制脂肪合成。",
    "某些「零度无糖可乐」中的人工甜味剂可能对肠道微生态产生负面影响，并引起神经代偿性糖渴望。建议学员用天然薄荷苏打水或青柠水作为健康替代。",
    "外食火锅极易产生高钠水肿。叮嘱学员多点清汤或菌菇锅，涮菜前准备一碗温水进行过滤漂洗，并补充充足的钾元素（香蕉、椰子水）来帮助排水。"
  ];

  const handleCopyTip = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="overview-control-center">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-red to-rose-950 rounded-xl p-4 text-white relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,0,80,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-semibold text-rose-100 mb-1.5 border border-white/10">
            <Sparkles className="w-2.5 h-2.5" />
            <span>减脂营智能带营服务专家工作台</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">你好，营养师！</h2>
          <p className="text-rose-100/90 mt-1 text-xs leading-relaxed max-w-2xl">
            欢迎回到带营中心。结合多模态膳食大模型与营养学知识库，可以为营员快速定制饮食方案，分析餐食情况，并输出专业意见。
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white border border-slate-100 rounded-xl p-3.5 sm:p-4 shadow-sm space-y-3" id="usage-statistics-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-red" />
              <span>数据统计与业务量监测</span>
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
              监控您在各个服务维度上调用 AI 大脑生成的具体次数
            </p>
          </div>
          
          <div className="inline-flex bg-slate-50 border border-slate-100 p-0.5 rounded-lg">
            {(["today", "week", "month"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-all ${
                  timePeriod === period
                    ? "bg-brand-red text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {{ today: "当天", week: "本周", month: "本月" }[period]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
            <span className="ml-2 text-sm text-slate-400">加载统计数据...</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {API_CARDS.map((card) => (
              <div key={card.key} className={`${card.bg} ${card.border} border rounded-lg p-2.5 sm:p-3 flex flex-col gap-1 min-h-[64px] sm:min-h-[72px] relative`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] sm:text-xs font-bold ${card.color} truncate`}>{card.label}</span>
                  <div className={`w-2 h-2 rounded-full ${card.iconBg}`} />
                </div>
                <div className="flex items-baseline gap-0.5 mt-auto">
                  <span className="text-sm sm:text-base md:text-lg font-extrabold font-mono text-slate-800">
                    {stats?.apiCounts?.[card.key] || 0}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400">次</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Quick entries */}
        <div className="lg:col-span-8 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">业务处理快捷入口</h3>
            <p className="text-xs text-slate-400 mt-0.5">直接进入对应的数字化减脂评估诊断工作流</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(action.tab)}
                  className="bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-brand-red p-4 rounded-xl text-left shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between h-36"
                >
                  <div className="w-full">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${action.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mt-2.5 group-hover:text-brand-red transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                      {action.desc}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-brand-red group-hover:translate-x-1 transition-transform">
                    <span>立即开始</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Knowledge Capsule */}
        <div className="lg:col-span-4 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">每日带营业务锦囊</h3>
            <p className="text-xs text-slate-400 mt-0.5">高频科普话术，一键复制发给营员</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-lg border border-slate-100 relative group transition-colors">
                <div className="flex gap-2 items-start">
                  <div className="w-5 h-5 rounded-full bg-brand-red-light flex items-center justify-center shrink-0 mt-0.5 border border-brand-red-border">
                    <Brain className="w-2.5 h-2.5 text-brand-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-600 leading-relaxed pr-5">{tip}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyTip(tip, i)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-white border border-slate-100 text-slate-400 hover:text-brand-red hover:border-brand-red/30 shadow-sm transition-all cursor-pointer"
                  title="复制"
                >
                  {copiedIndex === i ? <Check className="w-3 h-3 text-brand-red" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Logs */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>智能工具最新调用记录</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">显示最近由系统生成的诊断记录列表</p>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-lg bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-3">调用时间</th>
                <th className="py-2.5 px-3">工具类型</th>
                <th className="py-2.5 px-3 text-center">执行状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px] text-slate-600">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    <Database className="w-5 h-5 mx-auto mb-2 text-slate-300" />
                    <span>暂无调用记录，开始使用智能工具吧</span>
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-400 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span>{new Date(log.createdAt).toLocaleString("zh-CN")}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold border border-slate-100">
                        {API_TYPE_LABELS[log.apiType] || log.apiType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        log.status === "success"
                          ? "text-green-600 bg-green-50 border-green-100"
                          : "text-red-600 bg-red-50 border-red-100"
                      }`}>
                        {log.status === "success" ? "成功" : "失败"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
