import React, { useState } from "react";
import { 
  Utensils, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronRight,
  RefreshCw,
  Flame,
  Scale,
  Activity,
  Heart,
  Droplet,
  Compass
} from "lucide-react";
import { DiningOutResult } from "../types";
import { diningAPI } from "../services/api";

// Scenarios configuration
const SCENARIOS = [
  { id: "hotpot", name: "铜锅/自选火锅", icon: "🍲", desc: "聚会高频首选，极易钠超标与吸附高油脂" },
  { id: "mcdonalds", name: "西式快餐 (麦/肯)", icon: "🍔", desc: "高性价比白领工作餐，重在规避油炸和酱汁" },
  { id: "sichuan", name: "川菜/中式炒菜", icon: "🌶️", desc: "重油重盐重勾芡，需注意烹饪法和漂洗" },
  { id: "japanese", name: "日式料理/寿喜烧", icon: "🍣", desc: "相对清淡高蛋白，但需警惕隐形糖分和酱油" },
  { id: "cantonese", name: "粤菜/港式茶餐厅", icon: "🥟", desc: "注重食材本味，但需防范糕点点心等高碳碳水" }
];

// Goals configuration
const GOALS = [
  { id: "extreme", name: "极致减脂 (<400kcal)", desc: "严格卡路里缺口，控制碳水和脂肪上限" },
  { id: "balanced", name: "稳健塑形 (400-600kcal)", desc: "黄金热量区间，兼顾饱腹感与力量耐力" },
  { id: "high_protein", name: "高蛋白/增肌 (>30g蛋白质)", desc: "满足肌肉合成所需，促进高强燃脂代谢" }
];

// Fallback Mock results
const MOCK_DINING_RESULTS: Record<string, DiningOutResult> = {
  "hotpot_extreme": {
    scenario: "铜锅/自选火锅",
    suitabilityScore: 82,
    recommendedDishes: [
      { name: "清汤涮嫩牛肉 (120g)", estimatedCalories: 180, protein: 26.0, carbs: 1.0, fat: 8.0, reason: "纯精瘦嫩牛肉不仅高蛋白，且几乎不含饱和脂肪，清汤涮熟最大程度阻断烹饪油脂。" },
      { name: "海带结 + 鲜冬菇 + 大白菜", estimatedCalories: 95, protein: 4.5, carbs: 14.0, fat: 1.0, reason: "海带和香菇富含可溶性膳食纤维多糖，大白菜填充胃容量，清油饱腹。" },
      { name: "手撕鲜豆腐 (80g)", estimatedCalories: 75, protein: 7.0, carbs: 2.0, fat: 4.0, reason: "提供植物性蛋白与钙质，慢卡饱腹，避免餐后饥饿感导致零食破戒。" }
    ],
    customizationTips: [
      "汤底必须选择‘白水锅’或‘清汤菌汤锅’。坚决拒绝红油锅、牛油锅（一餐多吸附40g以上油脂）。",
      "酱料碟：只用低钠酱油、老陈醋、葱花、蒜泥、小米辣。彻底拉黑麻酱（一勺150大卡）及花生碎。",
      "准备一碗‘纯白开水’，在涮叶菜（极易吸油）时，烫熟后在清水碗里彻底洗一遍再吃，可减少75%附油。"
    ],
    hiddenTraps: [
      "冻豆腐、面筋：蜂窝状结构吸油率惊人，红油锅里捞出来就是纯油脂包！",
      "午餐肉、各类贡丸：含有大量肥肉碎、淀粉和钠盐防腐剂，热量极高且极易引起浮肿。",
      "土豆片、红薯粉：属于纯精制主食碳水，吸油后升糖和屯脂威力加倍。"
    ],
    nutritionalAdvice: "火锅是减脂期极好的‘干净白水煮’食堂，前提是坚持‘清汤底、无麻酱、水漂洗’的降油工艺，吃饱又不水肿。"
  },
  "mcdonalds_balanced": {
    scenario: "西式快餐 (麦/肯)",
    suitabilityScore: 68,
    recommendedDishes: [
      { name: "板烧鸡腿堡 (定制：不要沙拉酱)", estimatedCalories: 310, protein: 22.5, carbs: 36.0, fat: 9.0, reason: "板烧鸡腿是铁板无油煎制，去皮后饱和脂肪极低。去掉高卡蛋黄酱瞬间扣除100大卡。" },
      { name: "鲜煮麦鲜杯 (水果片) + 无糖零度可乐", estimatedCalories: 25, protein: 1.0, carbs: 5.0, fat: 0.0, reason: "补充水果活性维生素，零度可乐提供零卡甜味和饱腹多巴胺。" },
      { name: "无酱蔬菜沙拉一份", estimatedCalories: 15, protein: 0.5, carbs: 3.0, fat: 0.0, reason: "用膳食纤维蔬菜填补胃容量空间，延缓汉堡白面包的消化速度。" }
    ],
    customizationTips: [
      "汉堡要求‘去沙拉酱/去蛋黄酱’。任何白色的酱汁均是脂肪和高钠的代名词。",
      "汉堡面包‘只吃单面’。丢弃顶部或底部的面包片，可瞬间减少15g精制碳水化合物摄入。",
      "饮料默认选择无糖可乐、美式黑咖啡、或纯牛奶，决不能碰果汁或果味汽水。"
    ],
    hiddenTraps: [
      "油炸薯条：淀粉吸油率近40%，且富含促炎、破坏内脏代谢的反式脂肪酸。",
      "麦辣鸡翅、香辣鸡腿：油炸面包糠吸油多，且表皮无法完全剥除，饱和脂肪严重超标。",
      "麦乐鸡块：重组碎鸡肉，内含大量碎肥肉和淀粉，并非纯精肉蛋白。"
    ],
    nutritionalAdvice: "快餐不是毒药，板烧汉堡其实是白领极佳的蛋白质来源。避开油炸，不要沙拉酱，快餐汉堡吃完同样瘦。"
  }
};

export default function DiningOutRecommend() {
  const [selectedScenario, setSelectedScenario] = useState("hotpot");
  const [selectedGoal, setSelectedGoal] = useState("balanced");
  const [customScenario, setCustomScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<DiningOutResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "正在智能匹配对应的外食场景餐食配料数据库...",
    "正在多维度计算低卡、高蛋白的最优菜品黄金组合...",
    "正在筛查该外景极易被忽视的「重油、高糖、多钠」隐形陷阱...",
    "高级注册营养顾问系统正在生成终极外食点餐指南与定制改单提示..."
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      // Find matching scenario name
      const scenarioObj = SCENARIOS.find(s => s.id === selectedScenario);
      const scenarioName = customScenario.trim() || (scenarioObj ? scenarioObj.name : "普通中餐外食");
      const goalObj = GOALS.find(g => g.id === selectedGoal);
      const goalName = goalObj ? `${goalObj.name} (${goalObj.desc})` : "日常健康减脂";

      const response = await diningAPI.recommend({
        scenario: scenarioName,
        goal: goalName,
      });

      clearInterval(timer);
      setResult(response);

    } catch (err: any) {
      clearInterval(timer);
      console.error(err);
      // Fallback to local cache for standard demo if offline/error
      const cacheKey = `${selectedScenario}_${selectedGoal}`;
      if (MOCK_DINING_RESULTS[cacheKey] && !customScenario.trim()) {
        setResult(MOCK_DINING_RESULTS[cacheKey]);
      } else {
        setError("服务器连接超时。请确保后台 Express 服务运行正常，或在 Secrets 配置 GEMINI_API_KEY。");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedScenario("hotpot");
    setSelectedGoal("balanced");
    setCustomScenario("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-brand-red" />
          <span>外食减脂点餐顾问</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          针对聚会外食、写字楼外卖的高频翻车场景。专业顾问秒级输出“定制化修改单”与菜品组合，帮学员做到外食不超标、不阻碍卡路里缺口。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Configuration (Cols: 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">选择外食条件</h3>
            
            {/* Scenarios Selection */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">1. 目标外食场景</span>
              <div className="space-y-2.5">
                {SCENARIOS.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => {
                      setSelectedScenario(scene.id);
                      setCustomScenario("");
                    }}
                    className={`w-full p-3 border rounded-xl flex items-start gap-3.5 text-left transition-all ${
                      selectedScenario === scene.id && !customScenario.trim()
                        ? "bg-brand-red-light border-brand-red text-slate-800 shadow-sm shadow-brand-red/5"
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{scene.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold">{scene.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate leading-tight">{scene.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Scenario Box */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">或者：自定义外食场景</span>
              <input
                type="text"
                value={customScenario}
                onChange={(e) => {
                  setCustomScenario(e.target.value);
                  setSelectedScenario("");
                }}
                placeholder="例如：西北面馆、韩式烤肉、东北大拉皮餐馆..."
                className="w-full px-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-100 hover:border-slate-200 focus:border-brand-red rounded-xl text-xs placeholder:text-slate-400 focus:outline-none transition-all"
              />
            </div>

            <div className="border-t border-slate-50 my-4" />

            {/* Goals Selection */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">2. 控重卡路里与营养目标</span>
              <div className="space-y-2.5">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`w-full p-3 border rounded-xl flex flex-col text-left transition-all ${
                      selectedGoal === goal.id
                        ? "bg-brand-red-light border-brand-red text-slate-800 shadow-sm shadow-brand-red/5"
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <Heart className={`w-3.5 h-3.5 ${selectedGoal === goal.id ? "text-brand-red animate-pulse" : "text-slate-400"}`} />
                      <span>{goal.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{goal.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error indicator */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {result && (
                <button
                  onClick={handleReset}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors focus:outline-none h-11"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>重置</span>
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-red/10 hover:shadow-lg hover:shadow-brand-red/15 disabled:opacity-50 disabled:pointer-events-none transition-all h-11"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "专家系统计算方案中..." : "生成定制外食避坑指南"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Report Panel (Cols: 7) */}
        <div className="lg:col-span-7">
          {loading ? (
            /* Loading screen */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[580px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.05),transparent)] pointer-events-none" />
              <div className="w-20 h-20 rounded-2xl bg-brand-red-light flex items-center justify-center border border-brand-red-border relative mb-6">
                <Compass className="w-10 h-10 text-brand-red animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <h4 className="font-bold text-slate-800 text-base">正在规划低卡外食点餐配方</h4>
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
            /* Recommendations Report */
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in max-h-[720px] overflow-y-auto">
              
              {/* Product Header Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-brand-red font-bold uppercase tracking-wider bg-brand-red-light px-2 py-0.5 rounded border border-brand-red-border">外食安全绿卡</span>
                  <h3 className="font-bold text-slate-800 text-lg mt-1 truncate">{result.scenario} 点餐方案</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    已为您测算出对减脂阻碍最小、高蛋白的营养组合
                  </p>
                </div>
                
                {/* Visual Grade Badge */}
                <div className="flex items-center gap-3 shrink-0 self-center sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block leading-none">减脂友好度</span>
                    <span className="text-xs font-bold text-slate-500 mt-1 block">
                      {result.suitabilityScore >= 80 ? "👍 极度推荐" : result.suitabilityScore >= 60 ? "👌 尚可接受" : "⚠️ 翻车高危区"}
                    </span>
                  </div>
                  <div className="relative w-14 h-14 rounded-2xl border flex flex-col items-center justify-center font-mono border-brand-red-border bg-brand-red-light text-brand-red">
                    <span className="text-2xl font-black">{result.suitabilityScore}</span>
                  </div>
                </div>
              </div>

              {/* Recommended combination list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-brand-red" />
                  <span>营养师推荐的「低卡金牌菜品组合」</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  {result.recommendedDishes.map((dish, i) => (
                    <div key={i} className="p-4 bg-slate-50/40 border border-slate-100 rounded-xl space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-bold text-slate-800">{dish.name}</span>
                        <div className="flex items-center gap-1.5 text-xs text-brand-red font-bold font-mono shrink-0 bg-brand-red-light px-2.5 py-0.5 rounded-full">
                          <Flame className="w-3.5 h-3.5 shrink-0" />
                          <span>约 {dish.estimatedCalories} kcal</span>
                        </div>
                      </div>
                      
                      {/* Macros row */}
                      <div className="flex gap-4 text-[10px] font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-50 w-full justify-between sm:justify-start">
                        <div className="flex items-center gap-1">
                          <Scale className="w-3 h-3 text-blue-500" />
                          <span>蛋白: {dish.protein}g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-amber-500" />
                          <span>碳水: {dish.carbs}g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-rose-500" />
                          <span>脂肪: {dish.fat}g</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed leading-snug">
                        {dish.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom order modification rules */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-red" />
                  <span>点餐暗号与定制改单提示 (非常重要)</span>
                </h4>
                <div className="bg-brand-red-light border border-brand-red-border p-4 rounded-xl space-y-2.5">
                  {result.customizationTips.map((tip, i) => (
                    <div key={i} className="flex gap-2.5 text-xs text-slate-700 items-start">
                      <ChevronRight className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                      <span className="font-semibold">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden traps */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>隐形高热量、高饱和脂肪陷阱 (避坑曝光)</span>
                </h4>
                <div className="bg-rose-50/30 border border-rose-100/30 p-4 rounded-xl space-y-2.5">
                  {result.hiddenTraps.map((trap, i) => (
                    <div key={i} className="flex gap-2.5 text-xs text-slate-700 items-start">
                      <span className="text-rose-500 font-extrabold shrink-0 mt-0.5">⚠️</span>
                      <span className="font-medium text-slate-600">{trap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General expert comment */}
              <div className="pt-4 border-t border-slate-150 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-red" />
                  <span>营养师综合点评</span>
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100 leading-relaxed font-medium">
                  {result.nutritionalAdvice}
                </p>
              </div>

            </div>
          ) : (
            /* Idle Screen */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[580px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.03),transparent)] pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-6">
                <Utensils className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">等待点餐场景配置</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                在左侧选择对应外食场景（或手动录入特色面馆烤肉）以及对应的减脂阶段，点击生成，获取营养顾问专家系统为您独家定制的防卡路里超载方案。
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
