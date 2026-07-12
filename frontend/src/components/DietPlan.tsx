import React, { useState } from "react";
import {
  User, Activity, Heart, Apple, Sparkles, CalendarRange, AlertTriangle,
  RefreshCw, Flame, Beef, Wheat, Droplet, Loader2, ChevronLeft, ChevronRight,
  Copy, Share2, ChevronDown, ChevronUp, Expand, Shrink,
} from "lucide-react";
import { dietPlanAPI, type DietPlanOutput } from "../services/api";

const DAILY_ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "久坐少动" },
  { value: "light_active", label: "轻度活动" },
  { value: "moderate_work", label: "中等体力" },
];
const EXERCISE_OPTIONS = [
  { value: "none", label: "几乎不运动" },
  { value: "light", label: "每周1-2次" },
  { value: "moderate", label: "每周3-4次" },
  { value: "active", label: "每周5次以上" },
  { value: "very_active", label: "每天" },
];
const DIGESTION_OPTIONS = ["容易胃胀气", "反酸烧心", "便秘", "腹泻", "肠鸣屁多"];
const LOSS_SPEED_OPTIONS = [
  { value: "0.3", label: "0.3 kg/周" },
  { value: "0.5", label: "0.5 kg/周" },
  { value: "1", label: "1 kg/周" },
];
const FIELD_RANGES: Record<string, { min: number; max: number; unit: string }> = {
  age: { min: 18, max: 120, unit: "岁" }, height: { min: 100, max: 250, unit: "cm" },
  weight: { min: 20, max: 400, unit: "kg" }, bodyFat: { min: 1, max: 75, unit: "%" },
  waist: { min: 30, max: 250, unit: "cm" }, targetWeight: { min: 20, max: 400, unit: "kg" },
};
type RF = "age" | "height" | "weight" | "bodyFat" | "waist" | "targetWeight" | "lossSpeed";
const RL: Record<RF, string> = { age: "年龄", height: "身高", weight: "当前体重", bodyFat: "体脂率", waist: "当前腰围", targetWeight: "目标体重", lossSpeed: "减重速度" };
const MEAL_TYPES = [
  { key: "breakfast", label: "早餐", icon: "🌅" },
  { key: "lunch", label: "午餐", icon: "☀️" },
  { key: "dinner", label: "晚餐", icon: "🌙" },
  { key: "snack", label: "加餐", icon: "🍎" },
] as const;

export default function DietPlan() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [age, setAge] = useState(""); const [height, setHeight] = useState("");
  const [weight, setWeight] = useState(""); const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState(""); const [targetWeight, setTargetWeight] = useState("");
  const [lossSpeed, setLossSpeed] = useState(""); const [dailyActivity, setDailyActivity] = useState("");
  const [exercise, setExercise] = useState(""); const [tastes, setTastes] = useState("");
  const [allergies, setAllergies] = useState(""); const [medicalHistory, setMedicalHistory] = useState("");
  const [digestion, setDigestion] = useState<string[]>([]);
  const [errors, setErrors] = useState<RF[]>([]); const [rangeErrors, setRangeErrors] = useState<Record<string, string>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<DietPlanOutput | null>(null);
  const [apiError, setApiError] = useState("");
  const [currentDay, setCurrentDay] = useState(1); const [showAllDays, setShowAllDays] = useState(false);

  const isMissing = (f: RF) => triedSubmit && errors.includes(f);
  const hasRE = (f: string) => triedSubmit && !!rangeErrors[f];
  const ic = (f: RF) => `w-full px-2.5 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition ${isMissing(f) ? "bg-red-50/50 border-red-300" : "bg-slate-50 border-slate-200"}`;
  const clearR = (f: string) => setRangeErrors((p) => { const n = { ...p }; delete n[f]; return n; });

  const handleSubmit = async () => {
    const missing: RF[] = []; const range: Record<string, string> = {};
    if (!age.trim()) missing.push("age"); if (!height.trim()) missing.push("height");
    if (!weight.trim()) missing.push("weight"); if (!bodyFat.trim()) missing.push("bodyFat");
    if (!waist.trim()) missing.push("waist"); if (!targetWeight.trim()) missing.push("targetWeight");
    if (!lossSpeed) missing.push("lossSpeed");
    const cr = (f: string, v: string) => { if (!v.trim()) return; const n = parseFloat(v); const r = FIELD_RANGES[f]; if (r && !isNaN(n) && (n < r.min || n > r.max)) range[f] = `范围 ${r.min}～${r.max} ${r.unit}`; };
    cr("age", age); cr("height", height); cr("weight", weight); cr("bodyFat", bodyFat); cr("waist", waist); cr("targetWeight", targetWeight);
    setErrors(missing); setRangeErrors(range); setTriedSubmit(true);
    if (missing.length > 0 || Object.keys(range).length > 0) return;
    setLoading(true); setApiError(""); setResult(null);
    try {
      const data = await dietPlanAPI.generate({ name, gender, age, height, weight, bodyFat, waist, targetWeight, lossSpeed, dailyActivity, exercise, tastes, allergies, medicalHistory, digestion: digestion.join("、") });
      setResult(data); setCurrentDay(1); setShowAllDays(false);
    } catch (err: any) { setApiError(err.message || "方案生成失败"); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <CalendarRange className="w-5 h-5 text-brand-red" /><span>定制化饮食方案</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ===== 左侧：输入表单 ===== */}
        <div className="lg:col-span-5 space-y-3">
          {/* 生成按钮 - 置顶 */}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 py-2.5 shadow-md shadow-brand-red/10 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>AI 生成中...</span></> : <><Sparkles className="w-4 h-4" /><span>生成 7 日饮食方案</span></>}
          </button>

          {/* 错误提示 */}
          {triedSubmit && (errors.length > 0 || Object.keys(rangeErrors).length > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {errors.length > 0 && <p className="text-[11px] text-red-600">请补充：{errors.map((e) => RL[e]).join("、")}</p>}
                {Object.entries(rangeErrors).map(([f, m]) => <p key={f} className="text-[11px] text-red-600">{RL[f] || f}：{m}</p>)}
              </div>
            </div>
          )}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /><p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}

          {/* 全部输入在一个卡片内 */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-4">
            {/* 基本信息 */}
            <div>
              <div className="flex items-center gap-1.5 mb-2"><User className="w-3.5 h-3.5 text-brand-red" /><h3 className="text-xs font-bold text-slate-700">基本信息</h3></div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="姓名" className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition" />
                <div className="flex gap-1.5">
                  <button onClick={() => setGender("male")} className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${gender === "male" ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>♂ 男</button>
                  <button onClick={() => setGender("female")} className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${gender === "female" ? "bg-pink-50 border-pink-300 text-pink-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>♀ 女</button>
                </div>
              </div>
            </div>

            {/* 身体指标 */}
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Activity className="w-3.5 h-3.5 text-rose-500" /><h3 className="text-xs font-bold text-slate-700">身体指标 <span className="text-brand-red font-normal">*必填</span></h3></div>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="block text-[10px] text-slate-500 mb-0.5">年龄*</label><input type="number" value={age} onChange={(e) => { setAge(e.target.value); clearR("age"); }} placeholder="岁" className={ic("age")} />{hasRE("age") && <p className="text-[9px] text-red-500 mt-0.5">{rangeErrors.age}</p>}</div>
                <div><label className="block text-[10px] text-slate-500 mb-0.5">身高*</label><input type="number" value={height} onChange={(e) => { setHeight(e.target.value); clearR("height"); }} placeholder="cm" className={ic("height")} />{hasRE("height") && <p className="text-[9px] text-red-500 mt-0.5">{rangeErrors.height}</p>}</div>
                <div><label className="block text-[10px] text-slate-500 mb-0.5">体重*</label><input type="number" value={weight} onChange={(e) => { setWeight(e.target.value); clearR("weight"); }} placeholder="kg" className={ic("weight")} />{hasRE("weight") && <p className="text-[9px] text-red-500 mt-0.5">{rangeErrors.weight}</p>}</div>
                <div><label className="block text-[10px] text-slate-500 mb-0.5">体脂率*</label><input type="number" value={bodyFat} onChange={(e) => { setBodyFat(e.target.value); clearR("bodyFat"); }} placeholder="%" className={ic("bodyFat")} />{hasRE("bodyFat") && <p className="text-[9px] text-red-500 mt-0.5">{rangeErrors.bodyFat}</p>}</div>
                <div><label className="block text-[10px] text-slate-500 mb-0.5">腰围*</label><input type="number" value={waist} onChange={(e) => { setWaist(e.target.value); clearR("waist"); }} placeholder="cm" className={ic("waist")} />{hasRE("waist") && <p className="text-[9px] text-red-500 mt-0.5">{rangeErrors.waist}</p>}</div>
                <div><label className="block text-[10px] text-slate-500 mb-0.5">目标体重*</label><input type="number" value={targetWeight} onChange={(e) => { setTargetWeight(e.target.value); clearR("targetWeight"); }} placeholder="kg" className={ic("targetWeight")} />{hasRE("targetWeight") && <p className="text-[9px] text-red-500 mt-0.5">{rangeErrors.targetWeight}</p>}</div>
              </div>
              <div className="mt-2"><label className="block text-[10px] text-slate-500 mb-1">希望减重速度*</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {LOSS_SPEED_OPTIONS.map((o) => (
                    <button key={o.value} onClick={() => { setLossSpeed(o.value); if (triedSubmit) setErrors((p) => p.filter((e) => e !== "lossSpeed")); }}
                      className={`py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${lossSpeed === o.value ? "bg-brand-red-light border-brand-red text-brand-red" : isMissing("lossSpeed") ? "bg-red-50/50 border-red-300 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-500"}`}>{o.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* 活动指数 */}
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Activity className="w-3.5 h-3.5 text-blue-600" /><h3 className="text-xs font-bold text-slate-700">热量消耗与活动指数</h3></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[10px] text-slate-500 mb-1">日常活动</label>
                  <div className="space-y-1">
                    {DAILY_ACTIVITY_OPTIONS.map((o) => (
                      <button key={o.value} onClick={() => setDailyActivity(o.value)} className={`w-full py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${dailyActivity === o.value ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>{o.label}</button>
                    ))}
                  </div>
                </div>
                <div><label className="block text-[10px] text-slate-500 mb-1">运动习惯</label>
                  <div className="space-y-1">
                    {EXERCISE_OPTIONS.map((o) => (
                      <button key={o.value} onClick={() => setExercise(o.value)} className={`w-full py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${exercise === o.value ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>{o.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 口味偏好 */}
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Apple className="w-3.5 h-3.5 text-amber-600" /><h3 className="text-xs font-bold text-slate-700">口味偏好</h3></div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={tastes} onChange={(e) => setTastes(e.target.value)} placeholder="口味偏好" className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition" />
                <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="食物过敏原" className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition" />
              </div>
            </div>

            {/* 健康信息 - 默认展开 */}
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Heart className="w-3.5 h-3.5 text-rose-500" /><h3 className="text-xs font-bold text-slate-700">健康信息</h3></div>
              <input type="text" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="既往病史（如：高血压、糖尿病）" className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition mb-2" />
              <label className="block text-[10px] text-slate-500 mb-1">日常消化症状</label>
              <div className="flex flex-wrap gap-1.5">
                {DIGESTION_OPTIONS.map((o) => (
                  <button key={o} onClick={() => setDigestion((p) => p.includes(o) ? p.filter((v) => v !== o) : [...p, o])}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${digestion.includes(o) ? "bg-rose-50 border-rose-300 text-rose-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>{o}</button>
                ))}
              </div>
            </div>
          </div>

          {result && (
            <button onClick={() => { setResult(null); setApiError(""); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-sm rounded-xl flex items-center justify-center gap-2 py-2 transition cursor-pointer">
              <RefreshCw className="w-4 h-4" /><span>重新生成</span>
            </button>
          )}
        </div>

        {/* ===== 右侧：方案结果 ===== */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px]">
              <div className="w-16 h-16 rounded-2xl bg-brand-red-light flex items-center justify-center border border-brand-red-border mb-4">
                <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AI 正在生成方案</h4>
              <p className="text-xs text-slate-400 mt-1">综合分析营员指标和口味偏好中...</p>
            </div>
          ) : result ? (
            <div className="space-y-3">
              {/* 顶部工具栏 */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CalendarRange className="w-4 h-4 text-brand-red" />饮食方案
                </h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:border-slate-300 transition cursor-default" title="复制文字（暂未开放）">
                    <Copy className="w-3 h-3" /><span>复制</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:border-slate-300 transition cursor-default" title="网页分享（暂未开放）">
                    <Share2 className="w-3 h-3" /><span>分享</span>
                  </button>
                </div>
              </div>

              {/* 核心原则 + 总计 - 紧凑横排 */}
              <div className="bg-gradient-to-r from-brand-red to-rose-950 rounded-2xl p-4 text-white shadow-sm">
                {result.core_meal_principle && (
                  <div className="flex items-start gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-rose-100/90 leading-relaxed">{result.core_meal_principle}</p>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Flame, label: "总热量", value: result.seven_day_total?.kcal, unit: "kcal" },
                    { icon: Beef, label: "蛋白质", value: result.seven_day_total?.protein_g, unit: "g" },
                    { icon: Droplet, label: "脂肪", value: result.seven_day_total?.fat_g, unit: "g" },
                    { icon: Wheat, label: "碳水", value: result.seven_day_total?.carbohydrate_g, unit: "g" },
                  ].map(({ icon: Icon, label, value, unit }) => (
                    <div key={label} className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                      <Icon className="w-3.5 h-3.5 mx-auto mb-0.5 text-white/80" />
                      <div className="text-[9px] text-rose-100/70">{label}</div>
                      <div className="text-xs font-black font-mono">{Math.round(value || 0)}<span className="text-[9px] font-normal text-rose-100/60 ml-0.5">{unit}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 日切换器 */}
              <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
                <button onClick={() => { setShowAllDays(false); setCurrentDay((d) => Math.max(1, d - 1)); }} disabled={currentDay <= 1 && !showAllDays} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-brand-red hover:bg-brand-red-light transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {showAllDays ? (
                    <span className="text-sm font-bold text-slate-800">全部 7 天方案</span>
                  ) : (
                    <span className="text-sm font-bold text-slate-800">第 {currentDay} 天 / 共 {result.days?.length || 7} 天</span>
                  )}
                </div>
                <button onClick={() => { setShowAllDays(false); setCurrentDay((d) => Math.min(result.days?.length || 7, d + 1)); }} disabled={currentDay >= (result.days?.length || 7) && !showAllDays} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-brand-red hover:bg-brand-red-light transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 展开全部 / 收起 */}
              <button onClick={() => setShowAllDays(!showAllDays)} className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-500 transition cursor-pointer">
                {showAllDays ? <><Shrink className="w-3.5 h-3.5" /><span>收起，只看单天</span></> : <><Expand className="w-3.5 h-3.5" /><span>展开全部 7 天</span></>}
              </button>

              {/* 食物列表 */}
              {(showAllDays ? result.days : result.days?.filter((d) => d.day === currentDay))?.map((day) => (
                <div key={day.day} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-3">
                  {showAllDays && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                      <div className="w-7 h-7 rounded-lg bg-brand-red-light flex items-center justify-center"><span className="text-xs font-black text-brand-red">{day.day}</span></div>
                      <span className="text-sm font-bold text-slate-800">第 {day.day} 天</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {MEAL_TYPES.map(({ key, label, icon }) => {
                      const foods = day.meals?.[key];
                      if (!foods || foods.length === 0) return null;
                      const mealKcal = foods.reduce((s, f) => s + (f.kcal || 0), 0);
                      return (
                        <div key={key} className="border border-slate-100 rounded-xl p-2.5">
                          <div className="flex items-center gap-1 mb-1.5">
                            <span className="text-xs">{icon}</span>
                            <span className="text-[11px] font-bold text-slate-700">{label}</span>
                            <span className="text-[9px] text-slate-400 ml-auto">{Math.round(mealKcal)}kcal</span>
                          </div>
                          <div className="space-y-1">
                            {foods.map((food, fi) => (
                              <div key={fi} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg">
                                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                  <Apple className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[11px] font-bold text-slate-800 truncate">{food.food_name}</div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] text-slate-500">{food.grams}g</span>
                                    <span className="text-[9px] font-semibold text-brand-red">{Math.round(food.kcal)}kcal</span>
                                  </div>
                                </div>
                                <button className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-slate-400 transition cursor-default" title="食物替换（暂未开放）"><RefreshCw className="w-2.5 h-2.5" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px] relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-4">
                <CalendarRange className="w-7 h-7 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">等待生成饮食方案</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">在左侧填写营员信息后，点击「生成 7 日饮食方案」</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
