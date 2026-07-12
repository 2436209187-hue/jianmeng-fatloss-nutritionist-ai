import React, { useState, useRef } from "react";
import { 
  ScanQrCode, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  ShieldCheck,
  Search,
  Eye,
  ArrowRight,
  RotateCcw,
  Copy,
  Share2,
  Check
} from "lucide-react";
import { IngredientScanResult } from "../types";

// Presets data for instant evaluation
const INGREDIENT_PRESETS = [
  {
    name: "零度可乐",
    imgUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
    text: "水、食品添加剂（二氧化碳、焦糖色、磷酸、阿斯巴甜（含苯丙氨酸）、安赛蜜、柠檬酸钠、苯甲酸钠）、食用香精、咖啡因。",
    result: {
      productName: "无糖零度可乐",
      safetyScore: 68,
      overallGrade: "C" as const,
      additives: [
        {
          name: "阿斯巴甜 (Aspartame)",
          type: "人工甜味剂",
          safetyLevel: "caution" as const,
          desc: "极低热量甜味剂，对于减脂期控热有利。但部分研究表明可能影响肠道益生菌群平衡，并诱发中枢神经对真糖的心理补偿渴望。"
        },
        {
          name: "安赛蜜 (Acesulfame K)",
          type: "人工甜味剂",
          safetyLevel: "caution" as const,
          desc: "常与阿斯巴甜复合使用以改善口感。摄入过多可能增加肾脏代谢负荷，不建议长期重度饮用。"
        },
        {
          name: "苯甲酸钠 (Sodium Benzoate)",
          type: "化学防腐剂",
          safetyLevel: "caution" as const,
          desc: "常见工业级防腐剂，用于防霉抑菌。在酸性饮料中高度稳定，不符合干净饮食、修复代谢的天然饮食原则。"
        },
        {
          name: "焦糖色 (Caramel Color)",
          type: "着色剂/色素",
          safetyLevel: "safe" as const,
          desc: "赋予饮料深红棕色。此款为工业合成焦糖，虽符合国家食品安全标准，但无任何营养价值。"
        }
      ],
      summary: "该食品不含真糖与卡路里，可在极度渴望甜食时作为临时替代。但其高度依赖化学甜味剂与防腐剂，长期大量饮用对肠道菌群与代谢调节有潜移默化的负面影响。",
      dietAdvice: "【减脂营推荐级别：中度推荐（避坑指数：★★★☆☆）】。每周限饮 1-2 罐。推荐使用天然苏打水搭配鲜柠檬片，或冷泡茉莉花茶作为完全无害的健康替代，有助于慢慢修复受损的味觉系统。"
    }
  },
  {
    name: "经典马铃薯片",
    imgUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60",
    text: "马铃薯、植物油（精炼植物油，特丁基对苯二酚）、牛肉风味调味料（谷氨酸钠、食用香精、二氧化硅、阿斯巴甜、呈味核苷酸二钠、焦糖色、柠檬酸）。",
    result: {
      productName: "乐事经典原味油炸马铃薯片",
      safetyScore: 32,
      overallGrade: "D" as const,
      additives: [
        {
          name: "精炼植物油 (Refined Oil)",
          type: "高危致炎配料",
          safetyLevel: "hazard" as const,
          desc: "高温反复煎炸劣质用油。极易产生极其微量的反式脂肪酸，具有极强的促炎性，极易促成内脏脂肪堆积并抑制脂肪代谢。"
        },
        {
          name: "特丁基对苯二酚 (TBHQ)",
          type: "防腐剂/抗氧化剂",
          safetyLevel: "caution" as const,
          desc: "减缓油脂酸败的工业化学防腐抗氧化剂。大剂量摄入对胃黏膜有轻度刺激作用，违背「干净饮食」标准。"
        },
        {
          name: "谷氨酸钠 (MSG)",
          type: "强增味剂",
          safetyLevel: "safe" as const,
          desc: "俗称味精，用于调鲜。能直接刺激大脑多巴胺奖励中枢，产生“一口接一口，根本停不下来”的过食成瘾性。"
        }
      ],
      summary: "典型的高超加工食品。含有大量高温油炸产生的不良脂肪，且复合添加了极易诱发暴食、增加食欲的增鲜剂，对减脂营的身体去炎代谢过程极其有害。",
      dietAdvice: "【减脂营推荐级别：强烈禁止（避坑指数：★★★★★）】。建议在带营期间严格拉黑。若极度怀念酥脆感，建议用无油空气炸锅自制红薯片、或者吃15g无糖每日坚果，口感更佳且补充优质营养。"
    }
  },
  {
    name: "高纤蛋白棒",
    imgUrl: "https://images.unsplash.com/photo-1548695607-9c73430ba065?w=500&auto=format&fit=crop&q=60",
    text: "大豆分离蛋白、乳清蛋白粉、燕麦麸皮、聚葡萄糖（水溶性膳食纤维）、赤藓糖醇、中链甘油三酯微囊粉、奇亚籽、双歧杆菌。",
    result: {
      productName: "欧扎克无糖膳食纤维蛋白能量棒",
      safetyScore: 95,
      overallGrade: "A" as const,
      additives: [
        {
          name: "赤藓糖醇 (Erythritol)",
          type: "天然低卡糖醇",
          safetyLevel: "safe" as const,
          desc: "天然玉米发酵糖醇。不参与人体的糖代谢，不引起胰岛素波动，热量趋近于零，属于肠道耐受性极高的优质代糖。"
        },
        {
          name: "聚葡萄糖 (Polydextrose)",
          type: "水溶性膳食纤维",
          safetyLevel: "safe" as const,
          desc: "高品质水溶性膳食纤维，充当益生元。增加饱腹感的同时，可以改善肠道益生菌群平衡，维持血糖稳定。"
        },
        {
          name: "中链甘油三酯 (MCT)",
          type: "优质代谢脂肪",
          safetyLevel: "safe" as const,
          desc: "MCT椰子提取中链脂肪酸。不通过淋巴直接被肝脏快速吸收代谢，提供即时能量，非常有利于减脂期供能。"
        }
      ],
      summary: "配料表极其干净良心！完全抛弃了精制糖和传统化学合成防腐剂，采用高成本的天然糖醇与益生元，富含优质蛋白，具有极高的营养质量与配料安全性。",
      dietAdvice: "【减脂营推荐级别：强烈推荐（避坑指数：☆☆☆☆☆）】。品质完美的黄金代餐与运动加餐食品。其富含的复合蛋白质与慢碳能够维持3小时左右平稳供能，避免低血糖引起的暴饮暴食，建议人手常备。"
    }
  }
];

export default function IngredientScanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<IngredientScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleCopyText = () => {
    if (!result) return;
    let textToCopy = `📋 【减脂营配料表智能评估报告】\n`;
    textToCopy += `🔍 评估商品：${result.productName}\n`;
    textToCopy += `⭐ 安全等级：${result.safetyScore >= 80 ? "绿灯" : result.safetyScore >= 60 ? "黄灯" : result.safetyScore >= 45 ? "橙灯" : "红灯"}\n\n`;
    
    const activeAdditives = result.additives.filter(add => add.safetyLevel !== 'safe');
    if (activeAdditives.length > 0) {
      textToCopy += `🧪 敏感添加剂/配料明细：\n`;
      activeAdditives.forEach((add, i) => {
        textToCopy += `${i + 1}. ${add.name} (${add.type}) - ${add.safetyLevel === 'hazard' ? '高风险 ❌' : '需注意 ⚠️'}：${add.desc}\n`;
      });
      textToCopy += `\n`;
    }
    
    textToCopy += `📝 配料表安全综述：\n${result.summary}\n\n`;
    textToCopy += `💡 营养顾问指导意见：\n${result.dietAdvice}\n\n`;
    textToCopy += `✨ 数据由减脂营AI智能评估提供，仅供参考。`;

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareLink = () => {
    setShareSuccess(true);
    const mockLink = `https://dietplan.v21.fit/ingredient-share?id=${Math.floor(Math.random() * 100000)}`;
    navigator.clipboard.writeText(mockLink);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const loadingMessages = [
    "正在使用高精度 OCR 定位配料表文字区域...",
    "正在检索化学食品添加剂与高敏油脂成分...",
    "正在通过营养科学安全数据库测算危害指数与评分...",
    "高级注册营养顾问系统正在出具科学的配料评级与消费建议..."
  ];

  const handleSelectPreset = (preset: typeof INGREDIENT_PRESETS[0]) => {
    setSelectedImage(preset.imgUrl);
    setTextInput(preset.text);
    setResult(preset.result);
    setError(null);
  };

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
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !textInput.trim()) {
      setError("请上传配料表图片或手动粘贴配料成分文字");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      let base64Data = "";
      if (selectedImage && selectedImage.startsWith("data:")) {
        base64Data = selectedImage.split(",")[1];
      }

      const response = await fetch("/api/ingredient/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Data || undefined,
          mimeType: mimeType || undefined,
          text: textInput
        })
      });

      const data = await response.json();
      clearInterval(timer);

      if (response.ok) {
        setResult(data);
      } else {
        if (data.error === "API_KEY_MISSING") {
          setError(data.message);
        } else {
          setError(data.message || "配料表识别失败，请重试");
        }
      }
    } catch (err: any) {
      clearInterval(timer);
      console.error(err);
      setError("连接服务器超时。请确认后台 Express 服务端运行正常且密钥已在 secrets 中注入。");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setMimeType(null);
    setTextInput("");
    setResult(null);
    setError(null);
  };

  const getGradeStyles = (grade: string) => {
    switch (grade) {
      case 'A': return { color: 'text-brand-red bg-brand-red-light border-brand-red-border', dot: 'bg-brand-red' };
      case 'B': return { color: 'text-teal-600 bg-teal-50 border-teal-100', dot: 'bg-teal-500' };
      case 'C': return { color: 'text-amber-600 bg-amber-50 border-amber-100', dot: 'bg-amber-500' };
      case 'D': return { color: 'text-orange-600 bg-orange-50 border-orange-100', dot: 'bg-orange-500' };
      default: return { color: 'text-rose-600 bg-rose-50 border-rose-100', dot: 'bg-rose-500' };
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'hazard':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200">高风险 ❌</span>;
      case 'caution':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">需注意 ⚠️</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-brand-red bg-brand-red-light border border-brand-red-border">安全级 ✅</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ScanQrCode className="w-6 h-6 text-brand-red" />
          <span>包装配料表安全分析</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          专为减脂营定制的化学配料侦测仪。拍照扫描零食、饮品或熟食包装配料表，一秒揪出高糖、氢化植物油、高盐以及各类致炎工业防腐剂。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel (Cols: 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">配料表信息录入</h3>
            
            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">快速测评样本 (点击零食样例)</span>
              <div className="grid grid-cols-3 gap-2">
                {INGREDIENT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                    title={preset.name}
                  >
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-150 hover:border-brand-red group-hover:scale-[1.02] transition-all relative">
                      <img
                        src={preset.imgUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold truncate w-full text-center group-hover:text-brand-red">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-50 my-4" />

            {/* Image upload */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">上传包装配料表细节图</span>
              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 group bg-slate-50">
                  <img
                    src={selectedImage}
                    alt="Ingredient list label"
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
                    <ScanQrCode className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold block">点击上传配料表图片</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">清晰对焦配料、成分表区域，限 5MB 以内</span>
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

            {/* Paste box */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                <span>配料文字信息</span>
                <span className="text-[10px] text-slate-400">选填，复制粘贴包装配料文字</span>
              </span>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="例如：配料包括：燕麦、食用油、食品添加剂、人工阿斯巴甜、防腐剂、山梨酸钾..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50/50 focus:bg-white border border-slate-100 hover:border-slate-200 focus:border-brand-red rounded-xl text-xs placeholder:text-slate-400 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {(selectedImage || textInput.trim() || result) && (
                <button
                  onClick={handleReset}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors focus:outline-none h-11"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>清除</span>
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading || (!selectedImage && !textInput.trim())}
                className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-red/10 hover:shadow-lg hover:shadow-brand-red/15 disabled:opacity-50 disabled:pointer-events-none transition-all h-11"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "配料拆解检测中..." : "配料成分一键拆解评估"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel (Cols: 7) */}
        <div className="lg:col-span-7">
          {loading ? (
            /* Loading State */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[540px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.05),transparent)] pointer-events-none" />
              <div className="w-20 h-20 rounded-2xl bg-brand-red-light flex items-center justify-center border border-brand-red-border relative animate-pulse mb-6">
                <ScanQrCode className="w-10 h-10 text-brand-red animate-pulse" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">正在多维度筛查食品配料表</h4>
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
            /* Results State */
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
              
              {/* Product Header Card */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                {/* Top Row: Badge on left, Action buttons on right */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] text-brand-red font-bold uppercase tracking-wider bg-brand-red-light px-2 py-0.5 rounded border border-brand-red-border">配料安全档案</span>
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

                {/* Bottom Row: Title on left, Rating level circle with colors on right */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg truncate">{result.productName}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-red shrink-0" />
                      <span>检测通过 · 发现已定位敏感配料 / 添加剂 {result.additives.filter(add => add.safetyLevel !== 'safe').length} 款</span>
                    </p>
                  </div>

                  {/* Rating level circle with colors (no score) */}
                  <div className="flex items-center gap-3 self-center sm:self-auto shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-3 sm:pt-0 sm:pl-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block leading-none">安全推荐等级</span>
                    </div>
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-4 text-xs font-bold" style={{
                      borderColor: result.safetyScore >= 80 ? '#22c55e' : result.safetyScore >= 60 ? '#eab308' : result.safetyScore >= 45 ? '#f97316' : '#ef4444',
                      backgroundColor: result.safetyScore >= 80 ? 'rgba(34,197,94,0.05)' : result.safetyScore >= 60 ? 'rgba(234,179,8,0.05)' : result.safetyScore >= 45 ? 'rgba(249,115,22,0.05)' : 'rgba(239,68,68,0.05)',
                      color: result.safetyScore >= 80 ? '#22c55e' : result.safetyScore >= 60 ? '#eab308' : result.safetyScore >= 45 ? '#f97316' : '#ef4444'
                    }}>
                      {result.safetyScore >= 80 ? "绿灯" : result.safetyScore >= 60 ? "黄灯" : result.safetyScore >= 45 ? "橙灯" : "红灯"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert Diet Recommendation - moved to top per request */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-brand-red animate-pulse" />
                  <span>营养顾问带营指导意见</span>
                </h4>
                <div className="bg-brand-red-light border border-brand-red-border p-5 rounded-2xl">
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {result.dietAdvice}
                  </p>
                </div>
              </div>

              {/* Additives analysis list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-brand-red" />
                  <span>定位到的食品添加剂/配料分析明细</span>
                </h4>
                
                {result.additives.filter(add => add.safetyLevel !== 'safe').length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-brand-red-border bg-brand-red-light rounded-2xl text-xs text-brand-red">
                    🎉 恭喜！未在该配料表中筛查到敏感化学添加剂或促炎用油。属于高度天然、适合干净饮食的高分健康食品。
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {result.additives.filter(add => add.safetyLevel !== 'safe').map((add, i) => (
                      <div key={i} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            <span className="text-xs font-bold text-slate-800">{add.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded border border-slate-200">
                              {add.type}
                            </span>
                            {getLevelBadge(add.safetyLevel)}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed pl-3.5">
                          {add.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>



            </div>
          ) : (
            /* Idle Screen */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[540px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.03),transparent)] pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-6">
                <ScanQrCode className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">等待配料数据输入</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                点击左侧「快速测评样本」加载现成的零售成分表，或者直接上传您学员发来的零食背贴配料图，系统会立刻对添加剂与促炎成分展开精确清算。
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
