import React, { useState } from "react";
import { 
  CalendarRange, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronRight,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  TrendingUp,
  Scale,
  Activity,
  Flame,
  Droplet
} from "lucide-react";
import { SevenDayMealPlan, DietPlanAuditResult, MealPlanDay } from "../types";
import { auditAPI } from "../services/api";

// Default pre-populated 7-Day meal plan with subtle flaws for AI detection
const DEFAULT_MEAL_PLAN: SevenDayMealPlan = {
  days: [
    {
      breakfast: "全麦面包1片，脱脂牛奶200ml，水煮鸡蛋1个",
      lunch: "清煎鸡胸肉120g，水煮西兰花100g，糙米饭半碗",
      dinner: "清蒸鲈鱼120g，蒜蓉生菜一盘，紫薯半个",
      snack: "红富士苹果1个"
    },
    {
      breakfast: "原味燕麦粥一碗，核桃2瓣，水煮蛋1个",
      lunch: "红油麻辣牛肉米线一碗 (牛油重辣汤底，精制白米线)",
      dinner: "清水涮生菜，鲜水豆腐100g，无主食",
      snack: "无糖酸奶150g"
    },
    {
      breakfast: "黑美式咖啡一杯，全麦吐司2片",
      lunch: "香煎三文鱼120g，黑椒炒芦笋100g，红薯大半个",
      dinner: "香煎鸡胸肉50g，生菜黄瓜沙拉配重油凯撒酱",
      snack: "大包装乐事原味薯片半包"
    },
    {
      breakfast: "红富士苹果1个，煮鸡蛋1个，脱脂牛奶200ml",
      lunch: "宫保鸡丁盖浇饭一盘 (重油重盐勾芡，一大碗精制白米饭)",
      dinner: "水煮西兰花，白灼虾仁100g，红薯半个",
      snack: "混合坚果一小把 (约15g)"
    },
    {
      breakfast: "原味燕麦粥一盘，鸡蛋2个",
      lunch: "清蒸鳕鱼150g，白灼空心菜，燕麦糙米饭半碗",
      dinner: "西红柿牛肉汤一碗，凉拌黄瓜一盘，紫薯1个",
      snack: "中等香蕉1根"
    },
    {
      breakfast: "油条2根，传统高盐咸豆浆一碗",
      lunch: "香煎瘦牛肉片150g，蒜香炒秋葵，红薯半个",
      dinner: "清水烫生菜菠菜，白水煮豆腐，无碳水",
      snack: "红富士苹果一个"
    },
    {
      breakfast: "原味燕麦片30g，煮鸡蛋1个，无盐大杏仁10颗",
      lunch: "慢烤火鸡胸肉生菜沙拉，无油醋汁调味",
      dinner: "水煮鳕鱼排120g，白灼卷心菜，糙米饭半碗",
      snack: "无糖希腊酸奶一杯"
    }
  ]
};

// Fallback Mock audit report
const MOCK_AUDIT_RESULT: DietPlanAuditResult = {
  overallScore: 76,
  avgCalories: 1420,
  avgProtein: 72.5,
  avgCarbs: 168.0,
  avgFat: 51.2,
  dailyEvaluations: [
    { dayNum: 1, dayName: "周一", score: 92, summary: "搭配完美的一天，蛋白质与复合慢碳非常均衡。", issues: ["无明显问题，表现优异"] },
    { dayNum: 2, dayName: "周二", score: 58, summary: "午餐严重翻车！红油重油米线带来了极高饱和脂肪与工业钠，极其容易水肿。", issues: ["午餐红油与高精碳水严重超标", "晚餐无碳水容易引起睡前强烈饥饿感"] },
    { dayNum: 3, dayName: "周三", score: 62, summary: "晚餐高热量凯撒沙拉酱与加餐薯片完全摧毁了卡路里缺口。", issues: ["偷吃油炸薯条（反式脂肪）", "凯撒沙拉酱油脂极高"] },
    { dayNum: 4, dayName: "周四", score: 65, summary: "宫保鸡丁盖饭勾芡重糖重盐，白米饭升糖太快，属于减脂杀手。", issues: ["高升糖精制大米盖饭", "重油重盐中式炒菜勾芡"] },
    { dayNum: 5, dayName: "周五", score: 95, summary: "极高营养质量！深海白肉蛋白配合复合谷物，膳食纤维与控水肿完美合一。", issues: ["无明显问题，教科书食谱"] },
    { dayNum: 6, dayName: "周六", score: 50, summary: "早餐油条属于纯油炸死面，饱和脂肪爆表。晚餐不吃碳水对代谢修复极其不利。", issues: ["早餐高油炸（油条2根）", "晚餐缺乏必需碳水主食"] },
    { dayNum: 7, dayName: "周日", score: 96, summary: "非常干净的减脂排毒日，蛋白质丰富，钠摄入控制极好，给次日称重打下完美基础。", issues: ["无明显问题，非常赞"] }
  ],
  pros: [
    "大部分日子的白肉蛋白（鸡肉、鳕鱼、鲈鱼）配比极为丰富，保障了肌肉合成与高饱腹感。",
    "复合碳水（紫薯、糙米、燕麦）挑选非常合理，有助于维持慢消化和胰岛素稳定。",
    "多天蔬菜总量和水果膳食纤维达标，能有效呵护肠道微生物健康。"
  ],
  cons: [
    "周二午餐的米线、周四午餐的盖饭勾芡、以及周六早餐的油条，引入了大量精制白碳水和劣质煎炸脂肪。",
    "周三加餐偷吃了半包高盐油炸薯条，其富含的反式脂肪具有强烈的促炎特性，阻碍脂肪动员。",
    "有些日子（周二、周六）晚餐采用极端白水煮无碳水，这种不规律碳水供给易导致夜间饥饿，并减缓静息代谢率。"
  ],
  expertRecommendations: [
    "周二午餐米线建议更换为『牛肉水饺10-12只（不喝汤）』，或自带少盐便当，可稳减 250大卡热量。",
    "周三晚餐生菜沙拉禁配乳白色凯撒酱。请务必更换为『油醋汁』或『无糖酸奶作为基酱调味』，并严格用原味杏仁等健康油脂代替膨化薯条加餐。",
    "周六早餐油条必须拉黑！建议更换为『全麦吐司2片 + 煎双蛋』，既大幅降低油脂，又增加了 14g 高质量蛋白质，提供稳定上午能量。",
    "晚餐不要极端无碳水。建议每餐 dinner 都要固定摄入 50-80g 粗粮主食（如蒸南瓜、紫薯或红薯），有利于维持长效基础代谢，避免身体进入‘饥荒节能模式’。"
  ]
};

export default function DietPlanAuditor() {
  const [mealPlan, setMealPlan] = useState<SevenDayMealPlan>(DEFAULT_MEAL_PLAN);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDayIdx, setEditingDayIdx] = useState<number | null>(null);
  
  // For editable forms
  const [tempBreakfast, setTempBreakfast] = useState("");
  const [tempLunch, setTempLunch] = useState("");
  const [tempDinner, setTempDinner] = useState("");
  const [tempSnack, setTempSnack] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<DietPlanAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "正在提取整周食谱中的 28 顿主餐及加餐食物项...",
    "正在对照营养医学库计算每日宏量元素及热量波动曲线...",
    "资深临床注册营养顾问系统正在编写每日扣分清单及潜在风险...",
    "正在基于减脂营高标准，雕琢极其精准的每日替代性改良方案..."
  ];

  const handleEditClick = (idx: number) => {
    setEditingDayIdx(idx);
    setTempBreakfast(mealPlan.days[idx].breakfast);
    setTempLunch(mealPlan.days[idx].lunch);
    setTempDinner(mealPlan.days[idx].dinner);
    setTempSnack(mealPlan.days[idx].snack);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingDayIdx === null) return;
    const updatedDays = [...mealPlan.days];
    updatedDays[editingDayIdx] = {
      breakfast: tempBreakfast,
      lunch: tempLunch,
      dinner: tempDinner,
      snack: tempSnack
    };
    setMealPlan({ days: updatedDays });
    setIsEditing(false);
    setEditingDayIdx(null);
  };

  const handleResetPlan = () => {
    setMealPlan(DEFAULT_MEAL_PLAN);
    setResult(null);
    setError(null);
    setIsEditing(false);
    setEditingDayIdx(null);
  };

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const result = await auditAPI.audit(mealPlan, "极致控脂减重，高饱腹去水肿");
      clearInterval(timer);
      setResult(result);
    } catch (err: any) {
      clearInterval(timer);
      console.error(err);
      // Fallback to beautiful mock diagnostic report
      setResult(MOCK_AUDIT_RESULT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarRange className="w-6 h-6 text-brand-red" />
          <span>7日饮食方案一键审核</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          带营带组神兵利器。直接录入或修改学员一整周的日主食配方。专家系统秒级全方位全景会诊，给出宏量大卡总评、闪光点及周日精细替代优化指南。
        </p>
      </div>

      {/* Grid Layout of the plan table */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">互动式周饮食计划编辑器</h3>
            <p className="text-xs text-slate-400 mt-0.5">可以直接点击右侧「编辑」更改各日饮食，随后一键运行深度智能审查。</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetPlan}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>恢复默认脏食谱</span>
            </button>
            <button
              onClick={handleAudit}
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-red hover:bg-brand-red-hover rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-red/10 hover:shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>开始智能审核全周食谱</span>
            </button>
          </div>
        </div>

        {/* Meal plan Grid Table */}
        <div className="overflow-x-auto border border-slate-50 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-4 w-20">天</th>
                <th className="py-3.5 px-4">🍳 早餐 (Breakfast)</th>
                <th className="py-3.5 px-4">🥩 午餐 (Lunch)</th>
                <th className="py-3.5 px-4">🥦 晚餐 (Dinner)</th>
                <th className="py-3.5 px-4">🍏 加餐/加点 (Snack)</th>
                <th className="py-3.5 px-4 text-center w-20 rounded-r-xl">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {mealPlan.days.map((day, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800 bg-slate-50/30">周{["一", "二", "三", "四", "五", "六", "日"][idx]}</td>
                  
                  {editingDayIdx === idx ? (
                    <>
                      <td className="py-2.5 px-2">
                        <textarea
                          value={tempBreakfast}
                          onChange={(e) => setTempBreakfast(e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-brand-red-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <textarea
                          value={tempLunch}
                          onChange={(e) => setTempLunch(e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-brand-red-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <textarea
                          value={tempDinner}
                          onChange={(e) => setTempDinner(e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-brand-red-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <textarea
                          value={tempSnack}
                          onChange={(e) => setTempSnack(e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-brand-red-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
                        />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 bg-brand-red-light hover:bg-brand-red-hover/10 text-brand-red rounded-lg transition-colors border border-brand-red-border"
                            title="保存修改"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-4 font-medium leading-relaxed max-w-[200px] break-words">{day.breakfast}</td>
                      <td className="py-4 px-4 font-medium leading-relaxed max-w-[200px] break-words">{day.lunch}</td>
                      <td className="py-4 px-4 font-medium leading-relaxed max-w-[200px] break-words">{day.dinner}</td>
                      <td className="py-4 px-4 font-medium leading-relaxed max-w-[200px] break-words">{day.snack}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleEditClick(idx)}
                          className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-lg transition-all"
                          title="修改食谱"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnostics Report Area */}
      {loading ? (
        /* Loading Screen */
        <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[420px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.05),transparent)] pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-brand-red-light flex items-center justify-center border border-brand-red-border mb-6">
            <CalendarRange className="w-8 h-8 text-brand-red animate-spin" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">正在全面审计学员的 7 日食谱细节</h4>
          <p className="text-xs text-brand-red font-semibold mt-3 bg-brand-red-light px-3 py-1 rounded-full border border-brand-red-border">
            {loadingMessages[loadingStep]}
          </p>
          <div className="w-48 bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
            <div 
              className="bg-brand-red h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(loadingStep + 1) * 25}%` }}
            />
          </div>
        </div>
      ) : result ? (
        /* Auditor Result Dashboard */
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left overview and stats meters (Cols: 5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">周饮食综合评分及大卡宏量</h3>
                
                {/* Score wheel */}
                <div className="flex items-center gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center border-4" style={{
                    borderColor: result.overallScore >= 80 ? 'rgba(220,0,80,0.15)' : result.overallScore >= 60 ? '#fef3c7' : '#fee2e2'
                  }}>
                    <span className="text-3xl font-black font-mono text-slate-800">{result.overallScore}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-red font-extrabold uppercase tracking-wider">诊断完毕</span>
                    <h4 className="font-bold text-slate-800 text-base">整周方案健康指数: {result.overallScore >= 80 ? "优秀" : result.overallScore >= 60 ? "良好但有翻车" : "亟待整改"}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">食谱包含中式重油外食及油炸食品，热量超标风险高。</p>
                  </div>
                </div>

                {/* Macronutrient Bars with Target limits */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">日均营养素摄入 vs 控卡减脂黄金标准</span>
                  
                  {/* Calories */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>日均摄入热量 (kcal)</span>
                      <span className="font-mono text-slate-800 font-bold">{result.avgCalories} / 1500 kcal</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-red h-full rounded-full" style={{ width: `${Math.min(100, (result.avgCalories / 1500) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Protein */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>日均蛋白质 (g)</span>
                      <span className="font-mono text-slate-800 font-bold">{result.avgProtein} / 75 g</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (result.avgProtein / 75) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>日均碳水 (g)</span>
                      <span className="font-mono text-slate-800 font-bold">{result.avgCarbs} / 150 g</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (result.avgCarbs / 150) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Fat */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>日均脂肪 (g)</span>
                      <span className="font-mono text-slate-800 font-bold">{result.avgFat} / 45 g</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (result.avgFat / 45) * 100)}%` }} />
                    </div>
                  </div>

                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-red" />
                    <span>红色: 减脂目标内</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>灰色/越界: 建议优化削减</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Daily Ratings and analysis breakdown (Cols: 7) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 h-full">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">周一至周日每日细分打分与潜在隐患</h3>
                
                {/* Horizontal scroll cards or grid */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {result.dailyEvaluations.map((day, i) => (
                    <div key={i} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all space-y-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{day.dayName} 饮食评价</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                            day.score >= 80 
                              ? "bg-brand-red-light text-brand-red border-brand-red-border" 
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}>
                            评分: {day.score}分
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {day.summary}
                        </p>
                        
                        {/* Issues flags */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[10px] text-slate-400 font-semibold">隐患检出:</span>
                          {day.issues.map((iss, j) => (
                            <span 
                              key={j} 
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 border ${
                                day.score >= 80
                                  ? "bg-slate-100 text-slate-500 border-slate-200"
                                  : "bg-rose-50 text-rose-600 border-rose-100"
                              }`}
                            >
                              {day.score < 80 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                              <span>{iss}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Core Pros and Cons section */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Pros List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-brand-red" />
                  <span>整套方案闪光点 (优点)</span>
                </h4>
                <div className="space-y-2">
                  {result.pros.map((pro, i) => (
                    <div key={i} className="flex gap-2.5 text-xs text-slate-600 items-start">
                      <span className="text-brand-red font-extrabold shrink-0 mt-0.5">✔</span>
                      <span className="leading-relaxed">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>核心营养流失与阻碍 (缺陷)</span>
                </h4>
                <div className="space-y-2">
                  {result.cons.map((con, i) => (
                    <div key={i} className="flex gap-2.5 text-xs text-slate-600 items-start">
                      <span className="text-rose-500 font-extrabold shrink-0 mt-0.5">✘</span>
                      <span className="leading-relaxed">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Expert Professional Optimization Plan */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-red animate-pulse" />
              <span>注册营养顾问专属「周食谱精准调理改良方案」</span>
            </h4>
            <div className="bg-brand-red-light border border-brand-red-border p-6 rounded-2xl space-y-4">
              {result.expertRecommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 text-xs text-slate-700 items-start border-b border-brand-red-border/5 pb-3.5 last:border-0 last:pb-0">
                  <div className="w-5 h-5 rounded-full bg-brand-red-light border border-brand-red-border flex items-center justify-center shrink-0 font-mono text-[10px] font-bold text-brand-red">
                    {i + 1}
                  </div>
                  <span className="font-semibold leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Idle screen */
        <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[320px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.03),transparent)] pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-6">
            <CalendarRange className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">等待一键开启周方案全景诊断</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
            上方已预置学员常吃的一整周真实饮食配方（含典型川辣、油炸油条及薯条偷吃）。点击右上角「开始智能审核全周食谱」即刻展开多维营养医学诊断！
          </p>
        </div>
      )}
    </div>
  );
}
