import React, { useState, useRef } from "react";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronRight,
  RefreshCw,
  Flame,
  Scale,
  Activity,
  Droplet,
  Compass,
  X,
  Copy,
  Share2,
  Check
} from "lucide-react";

// Presets for fast demonstration
const MENU_PRESETS = [
  {
    name: "东北家常菜馆",
    imgUrl: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60",
    text: "小鸡炖蘑菇、大拉皮、锅包肉、得莫利炖鱼、地三鲜、尖椒干豆腐、酸菜五花肉、哈尔滨红肠、酱骨棒、酸菜水饺。",
    result: {
      menuName: "东北家常菜馆菜单",
      goldDishes: [
        {
          name: "得莫利炖活鱼 (少油版)",
          estimatedCalories: 350,
          protein: 32,
          carbs: 12,
          fat: 18,
          reason: "野生鱼类提供极佳的 Omega-3 优质不饱和脂肪酸，慢火炖煮保留高蛋白质，豆腐和适量粉条能提供健康饱腹谷物代偿。"
        },
        {
          name: "尖椒炒干豆腐 (少盐无勾芡)",
          estimatedCalories: 190,
          protein: 18,
          carbs: 8,
          fat: 10,
          reason: "干豆腐拥有极高比例的植物蛋白与粗膳食大豆纤维，不拉升餐后胰岛素，抗炎减脂。"
        },
        {
          name: "清炒或白灼本地时蔬 (要求免明油)",
          estimatedCalories: 80,
          protein: 3,
          carbs: 6,
          fat: 5,
          reason: "大容量膳食纤维，在胃中吸水膨胀提供饱腹，阻断后续油脂的无意识吸收。"
        }
      ],
      trapDishes: [
        {
          name: "锅包肉",
          reason: "将里脊肉裹上极其浓稠的面糊下油锅反复深炸，表面吸油严重，最后淋上以纯白砂糖勾兑的酸甜粘稠酱汁，一盘热量突破1200大卡。"
        },
        {
          name: "地三鲜",
          reason: "茄子、土豆和青椒属于高淀粉或高吸油食材，在东北传统做法里必须‘下大油锅拉油’，茄子吸足了高温废油脂，是隐性脂肪轰炸机。"
        },
        {
          name: "大拉皮 (麻酱版)",
          reason: "拉皮本身是精制淀粉做成，升糖很快，再伴随淋入大量浓稠的高脂芝麻酱与红辣油，升糖囤脂一网打尽。"
        }
      ],
      modificationAdvice: [
        "点餐暗号：吩咐服务员「尖椒干豆腐不要放猪油，做素油清炒」",
        "点餐暗号：得莫利炖鱼锅里的粉条（极易吸附重油汤底）在吃之前，务必在温水碗里涮洗一遍",
        "点餐暗号：凉拌拉皮要求「酱汁分开装」，自己用筷子点蘸，避开高热量麻酱底"
      ]
    }
  },
  {
    name: "湘粤风味炒菜",
    imgUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60",
    text: "水煮牛肉、小炒黄牛肉、歌乐山辣子鸡、毛血旺、干煸四季豆、清炒油麦菜、回锅肉、剁椒鱼头、清蒸多宝鱼、白切鸡。",
    result: {
      menuName: "湘粤精致小炒菜单",
      goldDishes: [
        {
          name: "白切优质三黄鸡 (去皮食用)",
          estimatedCalories: 210,
          protein: 26,
          carbs: 2,
          fat: 11,
          reason: "采用低温慢浸熟制，不添加额外烹饪脂肪。鸡肉质地紧实，去皮后属于极其干净的高蛋白减脂白肉来源。"
        },
        {
          name: "小炒黄牛肉 (少油少盐版本)",
          estimatedCalories: 290,
          protein: 28,
          carbs: 4,
          fat: 15,
          reason: "黄牛肉富含肌氨酸和天然铁质，热量赤字下保护基础代谢，辣椒的大辣椒素能带来一定程度的餐后生热代谢率。"
        },
        {
          name: "清蒸多宝鱼 (要求不泼热油)",
          estimatedCalories: 180,
          protein: 24,
          carbs: 3,
          fat: 8,
          reason: "清蒸完美的保存了鱼肉蛋白质结构，富含抗炎 Omega-3。不泼最后一道滚烫热明油，热量立减50%。"
        }
      ],
      trapDishes: [
        {
          name: "干煸四季豆",
          reason: "烹饪工艺属于‘油炸过油’，并非干煸。四季豆属于多孔结构，会锁住大量煎炸油脂，且容易流失营养。"
        },
        {
          name: "水煮肉片 / 毛血旺",
          reason: "整盆菜漂浮着厚厚的红辣油。食材捞出来时会裹带至少 20-30g 的纯油脂，且底层豆芽和配菜吸油极其严重。"
        },
        {
          name: "回锅肉",
          reason: "使用纯肥瘦五花肉，油煎煸炒出油后，再加入重盐、重糖、重豆瓣酱（隐形高钠和糖），极易引起食后严重储水肿胀。"
        }
      ],
      modificationAdvice: [
        "点餐暗号：向后厨说明「所有炒菜免去最后一道明油，不要勾芡淋汁」",
        "点餐暗号：吃白切鸡时，用手或筷子剥去鸡皮（皮下堆积了80%以上的饱和动物脂肪）",
        "点餐暗号：主食不点蛋炒饭或扬州炒饭（饱含吸附油），只选择白米饭或蒸紫薯"
      ]
    }
  }
];

export default function MenuRecommend() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [menuText, setMenuText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const getRecommendationGrade = (menuName: string, goldDishes: any[], trapDishes: any[]) => {
    const name = menuName || "";
    if (name.includes("湘粤") || name.includes("粤菜") || name.includes("海鲜") || name.includes("轻食") || name.includes("沙拉") || name.includes("精致小炒")) {
      return "绿灯";
    }
    if (name.includes("湘菜") || name.includes("川菜") || name.includes("东北") || name.includes("烧烤") || name.includes("火锅") || name.includes("家常")) {
      return "黄灯";
    }
    if (trapDishes && goldDishes && trapDishes.length > goldDishes.length) {
      return "红灯";
    }
    if (trapDishes && goldDishes && trapDishes.length === goldDishes.length) {
      return "橙灯";
    }
    return "绿灯";
  };

  const handleCopyText = () => {
    if (!result) return;
    const grade = getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes);
    let textToCopy = `📋 【外食点餐降卡建议 · ${result.menuName}】\n\n`;
    textToCopy += `⭐ 健康推荐等级：${grade}\n\n`;
    
    textToCopy += `✅ 减脂营金牌推荐菜品：\n`;
    result.goldDishes.forEach((dish: any, idx: number) => {
      textToCopy += `${idx + 1}. ${dish.name}\n💡 推荐原因：${dish.reason}\n\n`;
    });
    
    textToCopy += `❌ 高脂肪、高精碳避坑菜品：\n`;
    result.trapDishes.forEach((trap: any, idx: number) => {
      textToCopy += `${idx + 1}. ${trap.name}\n⚠️ 避坑原因：${trap.reason}\n\n`;
    });
    
    textToCopy += `\n✨ 数据由减脂营AI智能评估提供，仅供参考。`;

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShareLink = () => {
    setShareSuccess(true);
    const mockLink = `https://dietplan.v21.fit/menu-share?id=${Math.floor(Math.random() * 100000)}`;
    navigator.clipboard.writeText(mockLink);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const loadingMessages = [
    "正在扫描识别菜单文本与烹饪关键词...",
    "正在筛查高糖勾芡、重油过油的隐藏陷阱...",
    "正在按照「高蛋白、低碳、抗炎、饱腹」模型挑选金牌菜品...",
    "高级注册营养顾问系统正在出具定制化改单暗号..."
  ];

  const handleSelectPreset = (preset: typeof MENU_PRESETS[0]) => {
    setSelectedImage(preset.imgUrl);
    setMenuText(preset.text);
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
    if (!selectedImage && !menuText.trim()) {
      setError("请上传菜单照片或手动输入菜单菜品文本");
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

      const response = await fetch("/api/menu/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Data || undefined,
          mimeType: mimeType || undefined,
          text: menuText
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
          setError(data.message || "菜单分析推荐失败，请重试");
        }
      }
    } catch (err: any) {
      clearInterval(timer);
      console.error(err);
      setError("连接服务器超时。请确保后台服务正常启动并在 Secrets 中配置 GEMINI_API_KEY。");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setMimeType(null);
    setMenuText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Compass className="w-6 h-6 text-brand-red" />
          <span>外食菜单点餐建议</span>
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          将学员在餐馆、聚会场所拍下的实体菜单或手机截图上传，一秒解析整张菜单。为您挑选出最干净的低卡白肉高纤组合，并出具针对后厨的「降油暗号」。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">菜单信息录入</h3>
            
            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">快速体验 (点击预设菜系菜单)</span>
              <div className="grid grid-cols-2 gap-3">
                {MENU_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className="flex flex-col items-center gap-1 group focus:outline-none text-left"
                  >
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-150 hover:border-brand-red group-hover:scale-[1.02] transition-all relative">
                      <img
                        src={preset.imgUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold truncate w-full text-center group-hover:text-brand-red mt-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-50 my-4" />

            {/* Menu image dropzone */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">上传餐馆菜单截图/照片</span>
              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 group bg-slate-50">
                  <img
                    src={selectedImage}
                    alt="Menu label"
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
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold block">点击上传菜单图片</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">支持大众点评菜单、纸质照片或美团截图</span>
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

            {/* Manual Text box */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex justify-between items-center">
                <span>手动列举菜单菜品</span>
                <span className="text-[10px] text-slate-400">选填，可粘贴或手写菜品名称</span>
              </span>
              <textarea
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                placeholder="例如：糖醋里脊、青椒炒肉、白灼大虾、清蒸鲈鱼、香辣牛肉..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50/50 focus:bg-white border border-slate-100 hover:border-slate-200 focus:border-brand-red rounded-xl text-xs placeholder:text-slate-400 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Error alerts */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {(selectedImage || menuText.trim() || result) && (
                <button
                  onClick={handleReset}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors focus:outline-none h-11"
                >
                  <X className="w-4 h-4" />
                  <span>重置</span>
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading || (!selectedImage && !menuText.trim())}
                className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-red/10 hover:shadow-lg hover:shadow-brand-red/15 disabled:opacity-50 disabled:pointer-events-none transition-all h-11"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "云端大脑菜单深度诊断中..." : "一键出具点餐避坑策略"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right output */}
        <div className="lg:col-span-7">
          {loading ? (
            /* Loading State */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[540px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.05),transparent)] pointer-events-none" />
              <div className="w-20 h-20 rounded-2xl bg-brand-red-light flex items-center justify-center border border-brand-red-border relative animate-pulse mb-6">
                <Compass className="w-10 h-10 text-brand-red animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h4 className="font-bold text-slate-800 text-base">正在多维度筛查菜单美食配比</h4>
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
              
              {/* Top Actions and Grade Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center border-4 text-xs font-bold" style={{
                    borderColor: getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "绿灯" ? '#22c55e' : getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "黄灯" ? '#eab308' : getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "橙灯" ? '#f97316' : '#ef4444',
                    backgroundColor: getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "绿灯" ? 'rgba(34,197,94,0.05)' : getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "黄灯" ? 'rgba(234,179,8,0.05)' : getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "橙灯" ? 'rgba(249,115,22,0.05)' : 'rgba(239,68,68,0.05)',
                    color: getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "绿灯" ? '#22c55e' : getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "黄灯" ? '#eab308' : getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes) === "橙灯" ? '#f97316' : '#ef4444'
                  }}>
                    {getRecommendationGrade(result.menuName, result.goldDishes, result.trapDishes)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block leading-none">健康推荐等级</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">
                      该菜系更推荐选点白肉、清蒸和无糖菜品
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0 self-end sm:self-auto">
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

              {/* Gold Dishes (Most recommended) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-brand-red" />
                  <span>减脂营金牌推荐菜品 (高分必点)</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-4 max-h-[320px] overflow-y-auto pr-1">
                  {result.goldDishes.map((dish: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-xs font-bold text-slate-800">{dish.name}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        {dish.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trap Dishes (Strictly Avoid) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>高脂肪、高精碳避坑菜品 (坚决拉黑)</span>
                </h4>
                <div className="bg-rose-50/40 border border-rose-100/30 p-4 rounded-xl space-y-2.5">
                  {result.trapDishes.map((trap: any, idx: number) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-slate-700 items-start">
                      <span className="text-rose-500 font-extrabold shrink-0">⚠️</span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800">{trap.name}</span>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">{trap.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Idle Screen */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-[540px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,0,80,0.03),transparent)] pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-6">
                <Compass className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">等待菜单打卡录入</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                点击左侧「快速体验」载入东北家常菜或炒菜馆样例，或者直接拍照上传您学员发来的纸质、点评菜单，AI 将会为您智能摘取最放心的低脂饮食组合。
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
