import React, { useState, useRef } from "react";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Activity,
  Droplet,
  Flame,
  Scale,
  Brain,
  ChevronRight,
  RefreshCw,
  Copy,
  Share2,
  Check
} from "lucide-react";
import { DietAnalysisResult } from "../types";

// Presets data for instant evaluation
const PRESETS = [
  {
    name: "牛油果滑蛋吐司",
    imgUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60",
    desc: "全麦面包片、半个牛油果、两个滑蛋、少许黑胡椒与海盐调味，伴有5个樱桃番茄。",
    result: {
      foodName: "牛油果滑蛋全麦吐司配小番茄",
      healthScore: 92,
      totalCalories: 385,
      protein: 16.5,
      carbs: 32.0,
      fat: 21.0,
      fiber: 7.2,
      sodium: 340,
      analysis: "非常经典的减脂早餐组合。牛油果提供了优质的单不饱和脂肪酸，鸡蛋提供了优质卵磷脂和完整蛋白质，全麦吐司饱腹感强、升糖指数低。搭配小番茄补充了丰富的番茄红素与维生素C。",
      pros: ["优质脂肪（牛油果不饱和脂肪酸）丰富", "中等GI碳水，稳定清晨血糖", "烹饪简单，饱腹感长达4小时"],
      cons: ["蛋白质总量对增肌塑形期学员偏低", "缺乏足够的绿叶蔬菜纤维"],
      suggestions: ["建议额外搭配一杯无糖黑咖啡或150ml脱脂牛奶以增加饱腹感和蛋白质", "煎蛋时可加入一小把菠菜同炒，使微量元素更加均衡"]
    }
  },
  {
    name: "慢煎鸡胸肉沙拉",
    imgUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
    desc: "120g香煎低脂鸡胸肉、羽衣甘蓝、生菜、圣女果、50g水煮藜麦，配少量低脂油醋汁。",
    result: {
      foodName: "香煎低脂鸡胸肉羽衣甘蓝藜麦沙拉",
      healthScore: 98,
      totalCalories: 310,
      protein: 32.5,
      carbs: 12.0,
      fat: 14.0,
      fiber: 6.8,
      sodium: 280,
      analysis: "堪称教科书级别的黄金控热减脂午餐！羽衣甘蓝和生菜体积大、热量低，富含粗纤维；低油煎鸡胸肉提供了足量的高品质单体蛋白质；搭配的藜麦属于超级谷物，提供了优质的慢消化复合碳水。",
      pros: ["极高白肉蛋白质（32g+），增肌控糖神餐", "膳食纤维极好，肠道饱腹排毒绝佳", "超低热量、超低钠，完全没有水肿顾虑"],
      cons: ["碳水化合物总量略低，高强度运动后可能会觉得精力稍逊"],
      suggestions: ["若下午有中大强度训练，建议添加50g南瓜或紫薯以补充运动糖原", "建议将油醋汁单独用小碟盛放，以筷子蘸着吃，可再减少50%无意识酱油盐摄入"]
    }
  },
  {
    name: "清蒸多宝鱼晚餐",
    imgUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60",
    desc: "清蒸多宝鱼150g、水煮黑椒西兰花100g、半碗紫薯糙米饭。",
    result: {
      foodName: "清蒸多宝鱼配糙米饭与黑椒西兰花",
      healthScore: 95,
      totalCalories: 420,
      protein: 29.0,
      carbs: 48.0,
      fat: 11.0,
      fiber: 5.5,
      sodium: 410,
      analysis: "非常扎实的减脂增肌期晚餐。多宝鱼肉质鲜嫩，饱和脂肪极低，提供高品质白肉蛋白；黑椒西兰花不仅低卡，还含有抗氧化的萝卜硫素；糙米饭属于慢消化碳水，保证整晚不挨饿且不引起夜间血糖震荡。",
      pros: ["白肉蛋白比例完美，高蛋白且极低饱和脂肪", "清蒸控油法，烹饪法非常符合减脂营标准", "糙米与西兰花提供充足水溶性膳食纤维"],
      cons: ["鱼肉极易消化，夜间23点后对部分代谢快学员可能产生轻微饥饿信号"],
      suggestions: ["如果深夜容易有饥饿感，可在下午16点左右加餐10颗生杏仁或核桃", "多宝鱼富含Omega-3不饱和脂肪酸，是抗炎减脂好食材，建议每周食用1-2次"]
    }
  },
  {
    name: "麻辣牛杂拉面",
    imgUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    desc: "红油麻辣牛杂面一碗，内含牛肚、牛大肠、精制小麦面条，汤底漂浮一层红油。",
    result: {
      foodName: "红油麻辣牛杂拉面",
      healthScore: 35,
      totalCalories: 820,
      protein: 24.0,
      carbs: 98.0,
      fat: 38.0,
      fiber: 2.1,
      sodium: 2100,
      analysis: "高油、高钠、高碳水的‘三高’餐饮，减脂期典型的超级避坑陷阱。面条为精制白面，升糖极快；红油汤底吸附大量饱和脂肪与工业钠盐，极易引起餐后身体严重水肿，阻碍脂肪分解代谢。",
      pros: ["牛杂提供了一定的动物性铁质和蛋白质", "热量充沛，可瞬间补充身体糖原"],
      cons: ["钠盐严重超标（一餐摄入量超过成人全天推荐所需上限）", "精制碳水和红油重脂肪堆积，严重阻碍减脂进度", "膳食纤维近乎为零，微量元素极其匮乏"],
      suggestions: ["减脂期不推荐此餐！若偶尔解馋，请千万不要喝汤，面条可用清水捞一遍再吃", "尽量将主食面条留下一半不吃，减少纯面粉碳水摄入", "餐后及时补充 1200ml 水，或饮用一杯无糖椰子水，借助钾元素排出体内钠水肿"]
    }
  },
  {
    name: "双层芝士堡配薯条",
    imgUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    desc: "芝士双层牛肉汉堡、炸薯条一份、普通番茄酱。",
    result: {
      foodName: "双层芝士牛肉汉堡配油炸薯条",
      healthScore: 40,
      totalCalories: 995,
      protein: 36.0,
      carbs: 112.0,
      fat: 46.0,
      fiber: 3.2,
      sodium: 1480,
      analysis: "典型的高卡路里快餐组合。虽然双层牛肉饼提供了可观的蛋白质，但其伴随了超高的油炸饱和脂肪。薯条是高GI精制淀粉和反式脂肪的混合体，食用后会引起胰岛素瞬间暴涨，将热量直接锁进脂肪细胞。",
      pros: ["蛋白质总量极高，含铁锌矿物质丰富", "提供强烈的饱腹感与多巴胺快乐度"],
      cons: ["热量爆表，单餐热量几乎占满普通减脂学员一天的推荐摄入上限", "油炸薯条富含反式脂肪酸，损害血管健康且极易合成内脏脂肪", "高盐高钠，吃完次日体重通常会因储水而暴增1-2斤"],
      suggestions: ["如果无法避开，建议去芝士、去沙拉酱，汉堡面包只吃单片，可立减 200 大卡", "薯条建议丢弃或只吃5根，或者更换为生菜沙拉作为替代", "吃完这餐后，当天的晚餐必须调整为极清淡的纯蒸蛋白、鸡蛋白加黄瓜，并增加30分钟有氧训练"]
    }
  }
];

export default function DietRecognition() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<DietAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleCopyText = () => {
    if (!result) return;
    let textToCopy = `📋 【减脂营膳食智能评估报告】\n`;
    textToCopy += `🍽️ 评估食物：${result.foodName}\n`;
    textToCopy += `⭐ 健康推荐：${result.healthScore >= 80 ? "绿灯" : result.healthScore >= 60 ? "黄灯" : result.healthScore >= 45 ? "橙灯" : "红灯"} (${result.healthScore}分)\n\n`;
    textToCopy += `🔥 预估热量：${result.totalCalories} kcal\n`;
    textToCopy += `💪 蛋白质：${result.protein} g\n`;
    textToCopy += `🌾 碳水化合物：${result.carbs} g\n`;
    textToCopy += `🥑 脂肪：${result.fat} g\n`;
    textToCopy += `🥬 膳食纤维：${result.fiber} g\n`;
    textToCopy += `🧂 钠盐含量：${result.sodium} mg\n\n`;
    textToCopy += `💡 饮食点评及建议：\n${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n`;
    textToCopy += `✨ 数据由减脂营AI智能评估提供，仅供参考。`;

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareLink = () => {
    setShareSuccess(true);
    const mockLink = `https://dietplan.v21.fit/recognition-share?id=${Math.floor(Math.random() * 100000)}`;
    navigator.clipboard.writeText(mockLink);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const loadingMessages = [
    "系统正在识别盘中的食材类别...",
    "正在结合数据库计算估算克数与卡路里...",
    "正在分析三大营养素占比（碳水、蛋白质、脂肪）...",
    "注册营养顾问专家系统正在撰写膳食红黑榜与改进建议..."
  ];

  // Load a preset for instant results
  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setSelectedImage(preset.imgUrl);
    setDescription(preset.desc);
    setResult(preset.result);
    setError(null);
  };

  // Convert uploaded file to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("图片文件过大，请上传 5MB 以内的图片");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setMimeType(file.type);
      setResult(null); // Clear previous results to force re-analysis
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Perform Gemini AI analysis
  const handleAnalyze = async () => {
    if (!selectedImage && !description.trim()) {
      setError("请上传饮食图片或输入餐食文字描述");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    // Dynamic loader steps
    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      let base64Data = "";
      if (selectedImage && selectedImage.startsWith("data:")) {
        base64Data = selectedImage.split(",")[1];
      }

      const response = await fetch("/api/diet/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Data || undefined,
          mimeType: mimeType || undefined,
          description: description
        })
      });

      const data = await response.json();
      clearInterval(timer);

      if (response.ok) {
        setResult(data);
      } else {
        // Handle error elegantly
        if (data.error === "API_KEY_MISSING") {
          setError(data.message);
        } else {
          setError(data.message || "分析失败，请稍后重试");
        }
      }
    } catch (err: any) {
      clearInterval(timer);
      console.error(err);
      setError("连接服务器超时，请确保后台服务器运行正常，并已在 secrets 中注入 API Key。");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setMimeType(null);
    setDescription("");
    setResult(null);
    setError(null);
  };

  // Calculate macronutrient chart parameters (percentage of calories)
  const getMacrosPie = () => {
    if (!result) return { carbPct: 0, protPct: 0, fatPct: 0 };
    // Carbs: 4 kcal/g, Protein: 4 kcal/g, Fat: 9 kcal/g
    const carbKcal = result.carbs * 4;
    const protKcal = result.protein * 4;
    const fatKcal = result.fat * 9;
    const totalKcal = Math.max(1, carbKcal + protKcal + fatKcal);

    return {
      carbPct: Math.round((carbKcal / totalKcal) * 100),
      protPct: Math.round((protKcal / totalKcal) * 100),
      fatPct: Math.round((fatKcal / totalKcal) * 100)
    };
  };

  const { carbPct, protPct, fatPct } = getMacrosPie();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Camera className="w-6 h-6 text-brand-red" />
          <span>膳食图像智能识别系统</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          基于多维营养特征数据库。一键拍照识别，快速估算热量、获取红黑膳食红利与专属膳食调整指南。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Panel (Cols: 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">餐食打卡录入</h3>
            
            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">快速体验 (点击预设餐食照片)</span>
              <div className="grid grid-cols-5 gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className="group flex flex-col items-center gap-1 focus:outline-none"
                    title={preset.name}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-100 hover:border-brand-red group-hover:scale-105 transition-all relative">
                      <img
                        src={preset.imgUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 truncate w-full text-center group-hover:text-brand-red">
                      {preset.name.slice(0, 3)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-50 my-4" />

            {/* Image Dropzone / Preview */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">上传真实食物图片</span>
              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 group bg-slate-50">
                  <img
                    src={selectedImage}
                    alt="Uploaded diet"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                    <button
                      onClick={triggerFileInput}
                      className="px-3 py-1.5 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 flex items-center gap-1 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>换一张</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={triggerFileInput}
                  className="w-full border-2 border-dashed border-slate-200 hover:border-brand-red rounded-xl p-8 flex flex-col items-center justify-center gap-2.5 group bg-slate-50/50 hover:bg-brand-red-light transition-all text-slate-500 hover:text-brand-red"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-brand-red group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold block">点击或拖拽食物照片上传</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">支持 JPG、PNG、HEIC 等格式，最大 5MB</span>
                  </div>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Text description */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                <span>辅材料/餐食备注描述</span>
                <span className="text-[10px] text-slate-400">选填，可帮助估算更精准</span>
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：我吃了两颗白水蛋，一片全麦面包，和一小碗香蕉燕麦粥..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50/50 focus:bg-white border border-slate-100 hover:border-slate-200 focus:border-brand-red rounded-xl text-xs placeholder:text-slate-400 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <div className="flex gap-3">
              {(selectedImage || description.trim() || result) && (
                <button
                  onClick={handleReset}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors focus:outline-none h-11"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>重置</span>
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading || (!selectedImage && !description.trim())}
                className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-red/10 hover:shadow-lg hover:shadow-brand-red/15 disabled:opacity-50 disabled:pointer-events-none transition-all h-11"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "正在系统估算中..." : "开启膳食智能评估"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (Cols: 7) */}
        <div className="lg:col-span-7">
          {loading ? (
            /* Analysis Loading Screen */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[520px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.05),transparent)] pointer-events-none" />
              <div className="w-20 h-20 rounded-2xl bg-brand-red-light flex items-center justify-center border border-brand-red-border relative animate-pulse mb-6">
                <Activity className="w-10 h-10 text-brand-red animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h4 className="font-bold text-slate-800 text-base">正在生成专业的营养分析报告</h4>
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
            /* Analysis Result Dashboard */
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
              
              {/* Header Score Info */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                {/* Top Row: Diagnosis Badge on left, Action buttons on right */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] text-brand-red font-bold uppercase tracking-wider bg-brand-red-light px-2 py-0.5 rounded border border-brand-red-border">专家诊断成功</span>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleCopyText}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-all flex items-center gap-1 focus:outline-none cursor-pointer"
                      title="复制评估报告内容"
                    >
                      {copySuccess ? <Check className="w-3.5 h-3.5 text-brand-red animate-pulse" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copySuccess ? "复制成功" : "复制文字"}</span>
                    </button>
                    <button
                      onClick={handleShareLink}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-all flex items-center gap-1 focus:outline-none cursor-pointer"
                      title="分享网页链接"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{shareSuccess ? "链接已复制" : "网页分享"}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Food Title on left, Status display on right */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg truncate">{result.foodName}</h3>
                  </div>

                  {/* Recommendation status with color status (No score, just text inside) */}
                  <div className="flex items-center gap-3 self-center sm:self-auto shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block leading-none">健康推荐等级</span>
                    </div>
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-4 text-xs font-bold" style={{
                      borderColor: result.healthScore >= 80 ? '#22c55e' : result.healthScore >= 60 ? '#eab308' : result.healthScore >= 45 ? '#f97316' : '#ef4444',
                      backgroundColor: result.healthScore >= 80 ? 'rgba(34,197,94,0.05)' : result.healthScore >= 60 ? 'rgba(234,179,8,0.05)' : result.healthScore >= 45 ? 'rgba(249,115,22,0.05)' : 'rgba(239,68,68,0.05)',
                      color: result.healthScore >= 80 ? '#22c55e' : result.healthScore >= 60 ? '#eab308' : result.healthScore >= 45 ? '#f97316' : '#ef4444'
                    }}>
                      {result.healthScore >= 80 ? "绿灯" : result.healthScore >= 60 ? "黄灯" : result.healthScore >= 45 ? "橙灯" : "红灯"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tailored recommendations - moved to top per request */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-red animate-pulse" />
                  <span>饮食点评及建议</span>
                </h4>
                <div className="bg-brand-red-light border border-brand-red-border p-4 rounded-xl space-y-2">
                  {result.suggestions.map((sug, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-700 items-start">
                      <ChevronRight className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                      <span className="font-semibold">{sug}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unified Nutrition & Calorie Ratio Card */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 space-y-6">
                {/* 4 Nutrient Cards inside */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {/* Calorie Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-semibold">餐食预估热量</span>
                      <Flame className="w-4 h-4 text-brand-red" />
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-bold font-mono text-brand-red">{result.totalCalories}</span>
                      <span className="text-[10px] text-brand-red ml-1 font-semibold">kcal</span>
                    </div>
                  </div>

                  {/* Protein Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-semibold">高价值蛋白质</span>
                      <Scale className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-bold font-mono text-slate-800">{result.protein}</span>
                      <span className="text-[10px] text-slate-500 ml-0.5">克 (g)</span>
                    </div>
                  </div>

                  {/* Carbs Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-semibold">膳食碳水化合物</span>
                      <Activity className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-bold font-mono text-slate-800">{result.carbs}</span>
                      <span className="text-[10px] text-slate-500 ml-0.5">克 (g)</span>
                    </div>
                  </div>

                  {/* Fat Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs font-semibold">脂肪总摄入量</span>
                      <Droplet className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-bold font-mono text-slate-800">{result.fat}</span>
                      <span className="text-[10px] text-slate-500 ml-0.5">克 (g)</span>
                    </div>
                  </div>
                </div>

                {/* Calorie Contribution Progress Bar - fused right inside */}
                <div className="pt-5 border-t border-slate-200/60 space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>三大营养素卡路里热量占比估算</span>
                    <span className="text-[10px] text-slate-400 font-normal">基于每克碳水/蛋白质4大卡，脂肪9大卡</span>
                  </div>
                  
                  {/* Horizontal segmented progress bar */}
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                    <div className="bg-amber-400 h-full hover:opacity-95 transition-all" style={{ width: `${carbPct}%` }} title={`碳水化合物: ${carbPct}%`} />
                    <div className="bg-blue-500 h-full hover:opacity-95 transition-all" style={{ width: `${protPct}%` }} title={`蛋白质: ${protPct}%`} />
                    <div className="bg-rose-500 h-full hover:opacity-95 transition-all" style={{ width: `${fatPct}%` }} title={`脂肪: ${fatPct}%`} />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>碳水能量: {carbPct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>蛋白能量: {protPct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>脂肪能量: {fatPct}%</span>
                    </div>
                  </div>
                </div>
              </div>



              {/* Removed Red & Green List per request */}

            </div>
          ) : (
            /* Idle Screen */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[520px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.03),transparent)] pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-6">
                <Camera className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">等待膳食打卡输入</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                点击左侧「快速体验」预设餐食照片，或者手动上传您学员的真实饮食打卡图/添加文字备注，开启秒级专家智能评估分析。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
