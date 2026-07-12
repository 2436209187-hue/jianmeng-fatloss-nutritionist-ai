import React, { useState, useEffect } from "react";
import { Camera, ScanQrCode, Compass, Upload, User, AlertTriangle, Sparkles, Loader2, Apple, RefreshCw, ClipboardPen, Copy, Share2, ShieldCheck, ShieldAlert, CircleDot, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { FastGPTComingSoon } from "./FastGPTComingSoon";
import { dietRecognitionAPI, type DietRecognitionOutput, ingredientAPI, type IngredientAnalysisOutput, menuAPI, type MenuRecommendOutput } from "../services/api";

interface MealsProps { initialSubTab?: string; }

const MEAL_PERIODS = [
  { value: "breakfast", label: "早餐" }, { value: "lunch", label: "中餐" },
  { value: "dinner", label: "晚餐" }, { value: "snack", label: "加餐" },
];

export default function Meals({ initialSubTab = "diet" }: MealsProps) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [mealPeriod, setMealPeriod] = useState("");
  const [age, setAge] = useState(""); const [gender, setGender] = useState<"male" | "female" | "">("");
  const [height, setHeight] = useState(""); const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);

  // Per-tab independent state
  const [tabImages, setTabImages] = useState<Record<string, string | null>>({});
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({});
  const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({});
  const [tabResults, setTabResults] = useState<Record<string, any>>({});
  const [tabErrors, setTabErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (initialSubTab) setActiveSubTab(initialSubTab); }, [initialSubTab]);

  const subTabs = [
    { id: "diet", label: "饮食识别", icon: Camera, uploadTip: "点击上传餐食照片", descPlaceholder: "描述这餐的吃法和感受，如：感觉有点油腻...", noteLabel: "营员备注" },
    { id: "ingredients", label: "配料分析", icon: ScanQrCode, uploadTip: "点击上传食品配料表照片", descPlaceholder: "输入食品配料表文字，如：小麦粉、白砂糖...", noteLabel: "备注" },
    { id: "menu", label: "菜单建议", icon: Compass, uploadTip: "点击上传餐厅菜单照片", descPlaceholder: "描述餐厅菜单或场景，如：川菜馆、聚餐...", noteLabel: "备注" },
  ];
  const cfg = subTabs.find((t) => t.id === activeSubTab)!;

  // Convenience aliases for current tab's state
  const imagePreview = tabImages[activeSubTab] || null;
  const note = tabNotes[activeSubTab] || "";
  const setNote = (v: string) => setTabNotes((p) => ({ ...p, [activeSubTab]: v }));
  const loading = tabLoading[activeSubTab] || false;
  const dietResult = tabResults["diet"];
  const ingredientResult = tabResults["ingredients"];
  const menuResult = tabResults["menu"];
  const apiError = tabErrors[activeSubTab] || "";
  const dietLoading = tabLoading["diet"] || false;
  const ingredientLoading = tabLoading["ingredients"] || false;
  const menuLoading = tabLoading["menu"] || false;

  const clearCurrent = () => {
    setTabResults((p) => { const n = { ...p }; delete n[activeSubTab]; return n; });
    setTabErrors((p) => { const n = { ...p }; delete n[activeSubTab]; return n; });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const MAX_W = 1024, MAX_H = 1024;
          let w = img.width, h = img.height;
          if (w > MAX_W || h > MAX_H) {
            const ratio = Math.min(MAX_W / w, MAX_H / h);
            w = Math.round(w * ratio); h = Math.round(h * ratio);
          }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, w, h);
          // 优先 WebP，降级 JPEG
          const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
          let quality = 0.7;
          let result = canvas.toDataURL(mime, quality);
          // 若仍超 500KB 继续降质量
          while (result.length > 500 * 1024 && quality > 0.2) {
            quality -= 0.1;
            result = canvas.toDataURL(mime, quality);
          }
          resolve(result);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const compressed = await compressImage(file);
    setTabImages((p) => ({ ...p, [activeSubTab]: compressed }));
  };

  const buildPayload = () => ({
    image: tabImages[activeSubTab] || "", note: tabNotes[activeSubTab] || undefined, meal_period: mealPeriod,
    age: age || undefined, gender: gender || undefined,
    height_cm: height || undefined, weight_kg: weight || undefined, waist_cm: waist || undefined,
  });

  const handleSubmit = async () => {
    setTriedSubmit(true);
    if (!mealPeriod) return;

    const tab = activeSubTab;
    setTabLoading((p) => ({ ...p, [tab]: true }));
    setTabErrors((p) => { const n = { ...p }; delete n[tab]; return n; });

    try {
      let data: any;
      if (tab === "diet") data = await dietRecognitionAPI.analyze(buildPayload());
      else if (tab === "ingredients") data = await ingredientAPI.analyze(buildPayload());
      else if (tab === "menu") data = await menuAPI.recommend(buildPayload());
      setTabResults((p) => ({ ...p, [tab]: data }));
    } catch (err: any) {
      setTabErrors((p) => ({ ...p, [tab]: err.message || "请求失败" }));
    } finally {
      setTabLoading((p) => ({ ...p, [tab]: false }));
    }
  };

  const renderRight = () => {
    // Diet tab: show result or empty state
    if (activeSubTab === "diet") {
      if (dietLoading) {
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-700">AI 正在识别餐食</p>
            <p className="text-xs text-slate-400 mt-1">分析食物种类、克重和热量...</p>
          </div>
        );
      }

      if (apiError) {
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-sm font-bold text-red-600">未识别到食物，请重新上传</p>
            <p className="text-xs text-slate-400 mt-1">请确保图片清晰包含餐食内容</p>
            <button onClick={clearCurrent} className="mt-3 px-4 py-1.5 bg-brand-red text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-brand-red-hover transition">重新上传</button>
          </div>
        );
      }

      if (dietResult) {
        // 后端返回失败或无食物数据
        if (dietResult.success === false || !dietResult.foods || !Array.isArray(dietResult.foods) || dietResult.foods.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
              <p className="text-sm font-bold text-red-600">未识别到食物，请重新上传</p>
              <p className="text-xs text-slate-400 mt-1">请确保图片清晰包含餐食内容</p>
              <button onClick={clearCurrent} className="mt-3 px-4 py-1.5 bg-brand-red text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-brand-red-hover transition">重新上传</button>
            </div>
          );
        }

        const totalCal = dietResult.foods.reduce((s: number, f: any) => s + (f.estimated_calories || 0), 0);
        return (
          <div className="p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-red" />
                餐食识别结果
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">总计</span>
                <span className="font-black text-brand-red text-lg">{Math.round(totalCal)}</span>
                <span className="text-slate-400 font-normal">kcal</span>
              </div>
            </div>

            {/* Food cards */}
            <div className="grid grid-cols-2 gap-2">
              {dietResult.foods.map((food: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-brand-red-light flex items-center justify-center shrink-0">
                    <Apple className="w-4 h-4 text-brand-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{food.food_name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">{food.estimated_weight_g}g</span>
                      <span className="text-[10px] font-semibold text-brand-red">{food.estimated_calories} kcal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Diet advice */}
            {dietResult.comment && (
              <div className="bg-brand-red-light border border-brand-red-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ClipboardPen className="w-3.5 h-3.5 text-brand-red" />
                  <span className="text-xs font-bold text-brand-red">饮食建议</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{dietResult.comment}</p>
              </div>
            )}

            {/* Re-analyze */}
            <button onClick={clearCurrent} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-sm rounded-xl flex items-center justify-center gap-2 py-2 transition cursor-pointer">
              <RefreshCw className="w-4 h-4" /><span>重新分析</span>
            </button>
          </div>
        );
      }

      // Empty state
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3">
            <Camera className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-700">等待餐食识别</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">上传餐食照片并填写基本信息后，点击「饮食识别」开始分析</p>
        </div>
      );
    }

    // Ingredients tab
    if (activeSubTab === "ingredients") {
      if (ingredientLoading) {
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-700">AI 正在分析配料表</p>
            <p className="text-xs text-slate-400 mt-1">识别添加剂成分、评估风险等级...</p>
          </div>
        );
      }

      if (apiError || (ingredientResult && ingredientResult.success === false)) {
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-sm font-bold text-red-600">无法识别配料表，请重新上传</p>
            <p className="text-xs text-slate-400 mt-1">请确保图片清晰包含配料表内容</p>
            <button onClick={clearCurrent} className="mt-3 px-4 py-1.5 bg-brand-red text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-brand-red-hover transition">重新上传</button>
          </div>
        );
      }

      if (ingredientResult && ingredientResult.success) {
        const ratingMap: Record<string, string> = { green: "绿灯", yellow: "黄灯", red: "红灯" };
        const ratingCN = ratingMap[ingredientResult.food_rating || ""] || "黄灯";
        const ratingConfig: Record<string, { icon: any; color: string; bg: string; border: string }> = {
          "绿灯": { icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
          "黄灯": { icon: CircleDot, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
          "红灯": { icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
        };
        const rc = ratingConfig[ratingCN];
        const RatingIcon = rc.icon;
        const riskMap: Record<string, { label: string; bg: string; border: string; tag: string }> = {
          high: { label: "高风险", bg: "bg-red-50/50", border: "border-red-200", tag: "bg-red-100 text-red-700" },
          medium: { label: "中风险", bg: "bg-amber-50/50", border: "border-amber-200", tag: "bg-amber-100 text-amber-700" },
          low: { label: "低风险", bg: "bg-slate-50", border: "border-slate-200", tag: "bg-slate-200 text-slate-600" },
        };
        const hasIngredients = ingredientResult.ingredient_analysis && ingredientResult.ingredient_analysis.length > 0;

        return (
          <div className="space-y-3">
            {/* Rating */}
            <div className={`${rc.bg} ${rc.border} border rounded-xl p-4 flex items-center gap-3`}>
              <RatingIcon className={`w-8 h-8 ${rc.color} shrink-0`} />
              <div>
                <div className="text-xs font-bold text-slate-700">食品评级</div>
                <div className={`text-lg font-black ${rc.color}`}>{ratingCN}</div>
              </div>
            </div>

            {/* Advice */}
            {ingredientResult.dietary_advice && (
              <div className="bg-brand-red-light border border-brand-red-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ClipboardPen className="w-3.5 h-3.5 text-brand-red" />
                  <span className="text-xs font-bold text-brand-red">饮食建议</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{ingredientResult.dietary_advice}</p>
              </div>
            )}

            {/* Ingredients list */}
            {hasIngredients && (
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">配料分析</div>
                <div className="space-y-2">
                  {ingredientResult.ingredient_analysis!.map((ing, i) => {
                    const rm = riskMap[ing.risk_level] || riskMap.medium;
                    return (
                      <div key={i} className={`p-3 rounded-xl border ${rm.bg} ${rm.border}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{ing.ingredient_name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rm.tag}`}>{rm.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{ing.analysis}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasIngredients && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <ShieldCheck className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-green-700 font-medium">未发现风险配料</p>
              </div>
            )}

            <button onClick={clearCurrent} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-sm rounded-xl flex items-center justify-center gap-2 py-2 transition cursor-pointer">
              <RefreshCw className="w-4 h-4" /><span>重新分析</span>
            </button>
          </div>
        );
      }

      // Empty state
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3">
            <ScanQrCode className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-700">等待配料分析</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">上传食品配料表照片并填写基本信息后，点击「配料分析」开始分析</p>
        </div>
      );
    }

    // Menu tab
    if (activeSubTab === "menu") {
      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-700">AI 正在分析菜单</p>
            <p className="text-xs text-slate-400 mt-1">识别菜品、推荐减脂友好选择...</p>
          </div>
        );
      }

      if (apiError || (menuResult && menuResult.success === false)) {
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-sm font-bold text-red-600">无法识别菜单，请重新上传图片</p>
            <p className="text-xs text-slate-400 mt-1">请确保图片清晰包含菜单内容</p>
            <button onClick={clearCurrent} className="mt-3 px-4 py-1.5 bg-brand-red text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-brand-red-hover transition">重新上传</button>
          </div>
        );
      }

      if (menuResult && menuResult.success) {
        const hasRecommended = menuResult.recommended_dishes?.length > 0;
        const hasNotRecommended = menuResult.not_recommended_dishes?.length > 0;
        return (
          <div className="space-y-3">
            {/* Comment - 点餐建议放最上面 */}
            {menuResult.comment && (
              <div className="bg-brand-red-light border border-brand-red-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-brand-red" />
                  <span className="text-xs font-bold text-brand-red">点餐建议</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{menuResult.comment}</p>
              </div>
            )}

            {/* Recommended */}
            {hasRecommended && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-green-700">推荐菜品</span>
                </div>
                <div className="space-y-2">
                  {menuResult.recommended_dishes!.map((d, i) => (
                    <div key={i} className="p-3 bg-green-50/50 border border-green-200 rounded-xl">
                      <div className="text-xs font-bold text-slate-800 mb-0.5">{d.dish_name}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{d.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Not recommended */}
            {hasNotRecommended && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-600">不推荐菜品</span>
                </div>
                <div className="space-y-2">
                  {menuResult.not_recommended_dishes!.map((d, i) => (
                    <div key={i} className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
                      <div className="text-xs font-bold text-slate-800 mb-0.5">{d.dish_name}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{d.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={clearCurrent} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-sm rounded-xl flex items-center justify-center gap-2 py-2 transition cursor-pointer">
              <RefreshCw className="w-4 h-4" /><span>重新分析</span>
            </button>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3">
            <Compass className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-700">等待菜单分析</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">上传餐厅菜单照片并填写基本信息后，点击「菜单建议」获取推荐</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Sub tabs */}
      <div className="bg-slate-100/80 border border-slate-200/50 rounded-xl p-1.5 shadow-inner max-w-2xl mx-auto flex gap-1.5 shrink-0 w-full">
        {subTabs.map((tab) => {
          const Icon = tab.icon; const isActive = activeSubTab === tab.id;
          return (
            <button key={tab.id} onClick={() => { setActiveSubTab(tab.id); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                isActive ? "bg-brand-red text-white font-bold shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/65"}`}>
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span className="text-xs font-bold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main grid: inputs | results */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* Left: All inputs in one card */}
        <div className="lg:col-span-5 min-h-0">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col gap-3 h-full overflow-y-auto">
            {/* Meal period + gender in one row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">餐食时段 *</label>
                <select value={mealPeriod} onChange={(e) => setMealPeriod(e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg border text-xs outline-none transition ${mealPeriod ? "border-slate-200 bg-slate-50" : "border-red-300 bg-red-50/50"}`}>
                  <option value="">请选择</option>
                  {MEAL_PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">性别</label>
                <div className="flex gap-1.5">
                  <button onClick={() => setGender("male")} className={`flex-1 py-2 rounded-lg border text-xs font-medium transition cursor-pointer ${gender === "male" ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>♂ 男</button>
                  <button onClick={() => setGender("female")} className={`flex-1 py-2 rounded-lg border text-xs font-medium transition cursor-pointer ${gender === "female" ? "bg-pink-50 border-pink-300 text-pink-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>♀ 女</button>
                </div>
              </div>
            </div>

            {/* Body metrics - 4 in one row */}
            <div className="grid grid-cols-4 gap-2">
              <div><label className="block text-[10px] text-slate-500 mb-0.5">年龄</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="岁" className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center focus:ring-1 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition" /></div>
              <div><label className="block text-[10px] text-slate-500 mb-0.5">身高</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="cm" className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center focus:ring-1 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition" /></div>
              <div><label className="block text-[10px] text-slate-500 mb-0.5">体重</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="kg" className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center focus:ring-1 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition" /></div>
              <div><label className="block text-[10px] text-slate-500 mb-0.5">腰围</label><input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="cm" className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center focus:ring-1 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition" /></div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">餐食图片</label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:border-brand-red transition">
                  {imagePreview ? <img src={imagePreview} alt="预览" className="max-h-28 mx-auto rounded-lg" /> : (
                    <div className="flex flex-col items-center gap-1 py-3"><Upload className="w-6 h-6 text-slate-300" /><span className="text-[11px] text-slate-400">{cfg.uploadTip}</span></div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">{cfg.noteLabel}</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={cfg.descPlaceholder}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white outline-none transition resize-none" rows={2} />
            </div>

            {triedSubmit && !mealPeriod && <p className="text-[10px] text-red-500">请选择餐食时段</p>}

            {/* Submit button - at bottom of input card, more subtle */}
            <div className="mt-auto pt-2">
              <button onClick={handleSubmit} className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 py-2.5 shadow-sm transition cursor-pointer">
                {cfg.label}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 min-h-0">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm h-full overflow-y-auto relative">
            {/* Toolbar */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-50 px-4 py-2 flex items-center justify-between z-10">
              <span className="text-xs font-bold text-slate-600">分析结果</span>
              <div className="flex gap-1.5">
                <button className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium text-slate-400 hover:border-slate-300 transition cursor-default" title="复制（暂未开放）">
                  <Copy className="w-3 h-3" /><span>复制</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium text-slate-400 hover:border-slate-300 transition cursor-default" title="分享（暂未开放）">
                  <Share2 className="w-3 h-3" /><span>分享</span>
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-4">
              {renderRight()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
