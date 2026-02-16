import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, ChevronDown, ChevronUp, Database, FileText,
  FlaskConical, Info, Heart, AlertTriangle, Beaker, Leaf,
  Zap, Eye, Shield, Skull, ArrowRight, Sparkles, Activity, Ban
} from 'lucide-react';
import type { AnalysisResponse, AdditiveInfo, IngredientDetail, AdditiveDeepDive } from '../../api/types';

/* ─── Helpers ─── */
const safetyColor = (level: string) => {
  switch (level) {
    case 'Safe': return {
      bg: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      dot: 'bg-emerald-500',
      glow: 'shadow-emerald-500/20'
    };
    case 'Generally Safe': return {
      bg: 'from-green-500/10 to-green-600/5',
      border: 'border-green-500/20',
      text: 'text-green-400',
      dot: 'bg-green-500',
      glow: 'shadow-green-500/20'
    };
    case 'Use with Caution': return {
      bg: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      dot: 'bg-amber-500',
      glow: 'shadow-amber-500/20'
    };
    case 'Potentially Harmful': return {
      bg: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
      dot: 'bg-orange-500',
      glow: 'shadow-orange-500/20'
    };
    case 'Harmful': return {
      bg: 'from-rose-500/10 to-rose-600/5',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      dot: 'bg-rose-500',
      glow: 'shadow-rose-500/20'
    };
    default: return {
      bg: 'from-slate-500/10 to-slate-600/5',
      border: 'border-slate-500/20',
      text: 'text-slate-400',
      dot: 'bg-slate-500',
      glow: 'shadow-slate-500/20'
    };
  }
};

const categoryIcon = (cat: string) => {
  switch (cat) {
    case 'Natural': return <Leaf size={14} className="text-green-400" />;
    case 'Processed': return <Zap size={14} className="text-yellow-400" />;
    case 'Synthetic': return <Beaker size={14} className="text-purple-400" />;
    case 'Additive': return <FlaskConical size={14} className="text-orange-400" />;
    case 'Allergen': return <AlertTriangle size={14} className="text-red-400" />;
    default: return <Eye size={14} className="text-gray-400" />;
  }
};

const categoryBg = (cat: string) => {
  switch (cat) {
    case 'Natural': return 'bg-green-500/10 text-green-300 border-green-500/20';
    case 'Processed': return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
    case 'Synthetic': return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    case 'Additive': return 'bg-orange-500/10 text-orange-300 border-orange-500/20';
    case 'Allergen': return 'bg-red-500/10 text-red-300 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
  }
};

/* ─── Score Ring Component ─── */
const ScoreRing = ({ score, size = 120 }: { score: number; size?: number }) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Sophisticated color palette
  const getColor = (s: number) => {
    if (s > 70) return '#f43f5e'; // Rose 500
    if (s > 40) return '#f59e0b'; // Amber 500
    if (s > 20) return '#eab308'; // Yellow 500
    return '#10b981'; // Emerald 500
  };

  const color = getColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 drop-shadow-[0_0_8px_rgba(31,41,55,0.5)]" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="8" className="stroke-white/5" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} strokeWidth="8" fill="none"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "circOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color}44)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tracking-tighter" style={{ color }}>{score}</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1">Risk</span>
      </div>
    </div>
  );
};

/* ─── Ingredient Card ─── */
const IngredientCard = ({ detail, index }: { detail: IngredientDetail; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const sc = safetyColor(detail.safetyLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
      className={`group relative bg-gradient-to-br ${sc.bg} backdrop-blur-xl border ${sc.border} rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:${sc.border}/60 transition-all duration-500`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 sm:p-6 text-left focus:outline-none"
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl ${sc.bg} border ${sc.border} shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500`}>
              <div className={`w-3 h-3 rounded-full ${sc.dot} ${sc.glow} absolute -top-1 -right-1 border-2 border-slate-900`} />
              {categoryIcon(detail.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <span className="text-slate-100 font-bold text-lg leading-tight group-hover:text-white transition-colors">
                  {detail.name}
                </span>
                {detail.additiveCode && (
                  <span className="text-[10px] font-mono font-black text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 shadow-sm">
                    {detail.additiveCode}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-[0.1em] font-black px-2.5 py-1 rounded-lg border ${categoryBg(detail.category)} shadow-sm`}>
                  {detail.category}
                </span>
                <span className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest sm:hidden`}>
                  {detail.safetyLevel}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${sc.text} mb-1 opacity-70`}>
                Safety Rating
              </span>
              <span className={`text-sm font-bold text-white`}>
                {detail.safetyLevel}
              </span>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors"
            >
              <ChevronDown size={20} className="text-slate-400 group-hover:text-white" />
            </motion.div>
          </div>
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/10"
          >
            <div className="p-6 sm:p-8 space-y-6 text-[14px] bg-slate-900/60 backdrop-blur-xl">
              {detail.healthNotes && (
                <div className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-lg shadow-rose-500/5">
                    <Heart size={16} className="text-rose-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest opacity-60">Health Impact</span>
                    <p className="text-slate-200 leading-relaxed font-medium">{detail.healthNotes}</p>
                  </div>
                </div>
              )}
              {detail.allergyWarnings && detail.allergyWarnings.length > 0 && (
                <div className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                    <AlertTriangle size={16} className="text-amber-400" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest opacity-60">Allergy Alerts</span>
                    <div className="flex flex-wrap gap-2">
                      {detail.allergyWarnings.map((w: string, i: number) => (
                        <span key={i} className="text-[11px] bg-amber-500/10 text-amber-200 px-3 py-1 rounded-xl border border-amber-500/20 font-bold shadow-sm">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {detail.dailyLimitInfo && (
                <div className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0 border border-sky-500/20 shadow-lg shadow-sky-500/5">
                    <Activity size={16} className="text-sky-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest opacity-60">Daily Limit info</span>
                    <p className="text-slate-300 text-xs leading-relaxed italic">{detail.dailyLimitInfo}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Database size={12} className="text-slate-600" />
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Scientific Data Source</span>
                </div>
                <span className="text-[11px] text-slate-400 font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10 uppercase tracking-wider">{detail.source}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div >
  );
};


/* ─── Additive Deep Dive Card ─── */
const AdditiveDeepDiveCard = ({ additive, index }: { additive: AdditiveDeepDive; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const sc = safetyColor(additive.safetyLevel);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`group bg-gradient-to-r ${sc.bg} backdrop-blur-md border ${sc.border} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500`}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full p-6 text-left">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-mono font-black text-white bg-white/10 px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                {additive.code}
              </span>
              <div>
                <h4 className="text-white font-bold text-base">{additive.name}</h4>
                {additive.chemicalName && (
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{additive.chemicalName}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm">
                {additive.function}
              </span>
              <span className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-xl ${sc.text} bg-white/10 border ${sc.border} shadow-sm`}>
                {additive.safetyLevel}
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} className="text-gray-400 group-hover:text-white transition-colors mt-2" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/10"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm bg-black/10 backdrop-blur-sm">
              {/* Origin */}
              <div className="space-y-2">
                <h5 className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5">
                  <Beaker size={14} /> Derived From
                </h5>
                <p className="text-gray-200 leading-relaxed">{additive.derivedFrom}</p>
              </div>

              {/* Health Impact */}
              <div className="space-y-2">
                <h5 className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5">
                  <Heart size={14} /> Health Impact
                </h5>
                <p className="text-gray-200 leading-relaxed">{additive.healthImpact}</p>
              </div>

              {/* Daily Intake */}
              {additive.dailyIntakeLimit && (
                <div className="space-y-2">
                  <h5 className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5">
                    <Activity size={14} /> Daily Intake Limit
                  </h5>
                  <p className="text-blue-300 font-mono text-xs bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">{additive.dailyIntakeLimit}</p>
                </div>
              )}

              {/* Allergy Risk */}
              <div className="space-y-2">
                <h5 className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Allergy Risk
                </h5>
                <p className="text-gray-200 leading-relaxed">{additive.allergyRisk}</p>
              </div>

              {/* Common Products */}
              {additive.commonProducts.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs text-gray-400 uppercase font-bold">Found In</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {additive.commonProducts.map((p, i) => (
                      <span key={i} className="text-xs bg-gray-700/50 text-gray-300 px-2.5 py-1 rounded-lg border border-gray-600/50 font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Banned In */}
              {additive.bannedIn.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs text-red-400 uppercase font-bold flex items-center gap-1.5">
                    <Ban size={14} /> Banned In
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {additive.bannedIn.map((c, i) => (
                      <span key={i} className="text-xs bg-red-500/15 text-red-300 px-2.5 py-1 rounded-lg border border-red-500/30 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {additive.alternatives && additive.alternatives.length > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <h5 className="text-xs text-green-400 uppercase font-bold flex items-center gap-1.5">
                    <Leaf size={14} /> Natural Alternatives
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {additive.alternatives.map((a, i) => (
                      <span key={i} className="text-xs bg-green-500/15 text-green-300 px-3 py-1.5 rounded-lg border border-green-500/30 flex items-center gap-1.5 font-medium shadow-sm">
                        <ArrowRight size={12} /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Regulatory Status */}
              <div className="md:col-span-2">
                <h5 className="text-xs text-gray-400 uppercase font-bold mb-3 flex items-center gap-1.5">
                  <Shield size={14} /> Regulatory Status
                </h5>
                <div className="flex gap-3 flex-wrap">
                  {(['india', 'eu', 'usa'] as const).map(region => {
                    const status = additive.regulatoryStatus[region];
                    const statusColor = status === 'Banned' ? 'text-red-300 bg-red-500/15 border-red-500/30' :
                      status === 'Restricted' ? 'text-amber-300 bg-amber-500/15 border-amber-500/30' :
                        'text-green-300 bg-green-500/15 border-green-500/30';
                    return (
                      <div key={region} className={`px-4 py-2 rounded-xl text-xs font-bold border ${statusColor} uppercase shadow-sm`}>
                        {region}: {status}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div >
  );
};

/* ─── Main Component ─── */
const IngredientAnalysis = ({ data }: { data: AnalysisResponse }) => {
  const [showTransparency, setShowTransparency] = useState(false);
  const [showLimitations, setShowLimitations] = useState(false);

  const verdictBg = data.scoring.totalScore > 70 ? 'from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20' :
    data.scoring.totalScore > 40 ? 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20' :
      data.scoring.totalScore > 20 ? 'from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-500/20' :
        'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* ═══ HERO: Product + Score ═══ */}
      <div className={`bg-gradient-to-br ${verdictBg} rounded-2xl p-6 border shadow-2xl shadow-black/30`}>
        {/* Product Info */}
        {data.metadata?.productInfo && (
          <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-white/5">
            {data.metadata.productInfo.imageUrl && (
              <div className="w-full md:w-40 h-40 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 shadow-lg">
                <img src={data.metadata.productInfo.imageUrl} alt={data.metadata.productInfo.name} className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <div className="flex-1">
              {data.metadata.productInfo.brand && (
                <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">{data.metadata.productInfo.brand}</span>
              )}
              <h2 className="text-2xl font-bold text-white mt-1">{data.metadata.productInfo.name}</h2>
              {data.metadata.productInfo.categories && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data.metadata.productInfo.categories.slice(0, 4).map((cat: string, i: number) => (
                    <span key={i} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/10">
                      {cat.replace('en:', '')}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 mt-4">
                {data.metadata.productInfo.nutriscore && (
                  <div className="flex flex-col items-center p-2 bg-black/20 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase">Nutri</span>
                    <span className={`text-xl font-black ${['a', 'b'].includes(data.metadata.productInfo.nutriscore.toLowerCase()) ? 'text-green-400' : ['c'].includes(data.metadata.productInfo.nutriscore.toLowerCase()) ? 'text-yellow-400' : 'text-red-400'}`}>
                      {data.metadata.productInfo.nutriscore.toUpperCase()}
                    </span>
                  </div>
                )}
                {data.metadata.productInfo.novascore && (
                  <div className="flex flex-col items-center p-2 bg-black/20 rounded-lg border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase">NOVA</span>
                    <span className={`text-xl font-black ${data.metadata.productInfo.novascore > 3 ? 'text-red-400' : 'text-green-400'}`}>
                      {data.metadata.productInfo.novascore}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Score + Verdict */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreRing score={data.scoring.totalScore} />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <Sparkles className="text-purple-400" size={18} />
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">AI-Powered Analysis</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {data.scoring.riskLevel} Risk Product
            </h3>
            {data.healthSummary?.overallVerdict && (
              <p className="text-gray-400 text-sm leading-relaxed">{data.healthSummary.overallVerdict}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.scoring.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                data.scoring.riskLevel === 'Moderate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  data.scoring.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                {data.scoring.riskLevel.toUpperCase()}
              </span>
              <span className="text-xs text-gray-600">
                Confidence: <span className="text-white font-mono">{(data.metadata.confidenceScore * 100).toFixed(0)}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ HEALTH ALERTS ═══ */}
      {data.healthSummary && ((data.healthSummary.allergyAlerts?.length ?? 0) > 0 || (data.healthSummary.dietaryFlags?.length ?? 0) > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.healthSummary.allergyAlerts?.length ?? 0) > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-red-900/20 to-red-950/5 border border-red-500/20 rounded-xl p-5">
              <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-3">
                <AlertTriangle size={16} /> Allergy Alerts
              </h4>
              <div className="space-y-2">
                {data.healthSummary?.allergyAlerts?.map((alert: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-red-200">
                    <Skull size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {(data.healthSummary.dietaryFlags?.length ?? 0) > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/20 to-blue-950/5 border border-blue-500/20 rounded-xl p-5">
              <h4 className="text-blue-400 font-bold text-sm flex items-center gap-2 mb-3">
                <Info size={16} /> Dietary Flags
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.healthSummary?.dietaryFlags?.map((flag: string, i: number) => (
                  <span key={i} className="text-xs bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/20 font-medium">
                    {flag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ═══ RECOMMENDATIONS ═══ */}
      {(data.healthSummary?.recommendations?.length ?? 0) > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/15 to-purple-950/5 border border-purple-500/15 rounded-xl p-5">
          <h4 className="text-purple-400 font-bold text-sm flex items-center gap-2 mb-3">
            <Sparkles size={16} /> AI Recommendations
          </h4>
          <div className="space-y-2">
            {data.healthSummary?.recommendations?.map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <ArrowRight size={14} className="text-purple-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ INGREDIENT CARDS ═══ */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="text-blue-400" size={20} />
          Ingredient Analysis
          <span className="text-xs text-gray-600 font-normal ml-auto">{data.ingredients.length} detected</span>
        </h3>
        {data.ingredientDetails && data.ingredientDetails.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 items-start">
            {data.ingredientDetails.map((detail: IngredientDetail, idx: number) => (
              <IngredientCard key={`ingredient-${idx}-${detail.name}`} detail={detail} index={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 items-start">
            {data.ingredients.map((ing: string, idx: number) => (
              <div
                key={idx}
                className="group bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-slate-800/60 hover:border-emerald-500/20 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles size={18} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-100 font-bold text-base group-hover:text-white transition-colors">{ing}</span>
                </div>
                <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Analysis Only</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ ADDITIVE DEEP DIVE ═══ */}
      {data.additiveDeepDive && data.additiveDeepDive.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FlaskConical className="text-orange-400" size={20} />
            Additive Deep Dive
            <span className="bg-orange-500/10 text-orange-300 text-[10px] px-2 py-0.5 rounded-full border border-orange-500/20 font-bold uppercase ml-2">
              AI Research
            </span>
          </h3>
          <div className="space-y-3">
            {data.additiveDeepDive.map((additive: AdditiveDeepDive, idx: number) => (
              <AdditiveDeepDiveCard key={additive.code} additive={additive} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ LEGACY ADDITIVES TABLE ═══ */}
      {data.regulatoryFindings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 shadow-xl">
          <div className="p-5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="text-sky-400 opacity-70" size={18} />
              <h3 className="font-bold text-slate-200 text-sm uppercase tracking-widest">Regulatory Database</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-bold px-3 py-1 bg-black/20 rounded-full border border-white/5">
              {data.regulatoryFindings.length} Additives Found
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black">
                  <th className="p-4 pl-6">INS Code</th>
                  <th className="p-4">Chemical Name</th>
                  <th className="p-4 text-center">India (FSSAI)</th>
                  <th className="p-4 text-center hidden sm:table-cell">EU (EFSA)</th>
                  <th className="p-4 text-center hidden sm:table-cell">Global</th>
                  <th className="p-4 pr-6 text-right">Risk Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-[13px]">
                {data.regulatoryFindings.map((additive: AdditiveInfo) => (
                  <tr key={additive.code} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6 font-mono text-emerald-400 font-bold text-xs">{additive.code}</td>
                    <td className="p-4 font-bold text-slate-200 group-hover:text-white transition-colors">{additive.name}</td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${additive.status.india === 'Banned' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {additive.status.india}
                      </span>
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${additive.status.eu === 'Banned' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {additive.status.eu}
                      </span>
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${additive.status.usa === 'Banned' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {additive.status.usa}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`text-[11px] font-black uppercase tracking-tighter ${additive.riskLevel === 'Safe' ? 'text-emerald-400' : additive.riskLevel === 'Caution' ? 'text-amber-400' : 'text-rose-400'}`}>
                        {additive.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ═══ SCORING BREAKDOWN ═══ */}
      {data.scoring.breakdown.length > 0 && (
        <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg">
          <h3 className="text-[12px] font-black text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
            <Activity className="text-amber-500 opacity-70" size={16} />
            Risk Score Calculation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.scoring.breakdown.map((item: string, idx: number) => (
              <div key={idx} className={`text-[11px] font-bold p-3 rounded-xl border flex items-center justify-between ${item.includes('+') ? 'bg-rose-500/[0.03] text-rose-300/80 border-rose-500/10' : 'bg-slate-500/[0.03] text-slate-400/80 border-slate-500/10'}`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ DATA TRANSPARENCY ═══ */}
      <div className="border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-white/[0.04]">
        <button onClick={() => setShowTransparency(!showTransparency)}
          className="w-full flex items-center justify-between p-5 text-left transition-colors">
          <div className="flex items-center gap-3 text-slate-400">
            <Eye size={18} className="text-emerald-500 opacity-70" />
            <span className="font-bold text-[13px] uppercase tracking-widest">Data Transparency</span>
          </div>
          {showTransparency ? <ChevronUp size={18} className="text-slate-600" /> : <ChevronDown size={18} className="text-slate-600" />}
        </button>
        <AnimatePresence>
          {showTransparency && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 p-6 space-y-5 bg-slate-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2 font-black">Raw OCR Input</span>
                  <pre className="text-slate-400 text-[11px] whitespace-pre-wrap font-mono leading-relaxed">{data.metadata?.rawText || 'N/A'}</pre>
                </div>
                <div className="p-4 bg-emerald-500/[0.03] rounded-xl border border-emerald-500/10">
                  <span className="text-[9px] text-emerald-500/70 uppercase tracking-widest block mb-2 font-black">AI Cleaned Text</span>
                  <pre className="text-emerald-100/40 text-[11px] whitespace-pre-wrap font-mono leading-relaxed">{data.metadata?.cleanedText || 'Skipped'}</pre>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px]">
                {data.metadata?.processingFlags?.ocrEngine && (
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-500 uppercase font-bold">
                    Engine: <span className="text-slate-200 font-mono">{data.metadata.processingFlags.ocrEngine}</span>
                  </div>
                )}
                <div className={`px-3 py-1 rounded-lg uppercase font-bold ${data.metadata?.processingFlags?.usedAI ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-600 border border-white/10'}`}>
                  Groq AI: {data.metadata?.processingFlags?.usedAI ? 'Active' : 'N/A'}
                </div>
                <div className={`px-3 py-1 rounded-lg uppercase font-bold ${data.metadata?.processingFlags?.usedOFF ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-white/5 text-slate-600 border border-white/10'}`}>
                  OFF: {data.metadata?.processingFlags?.usedOFF ? 'Connected' : 'Local'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ METHODOLOGY & LIMITATIONS ═══ */}
      <div className="border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-white/[0.04]">
        <button onClick={() => setShowLimitations(!showLimitations)}
          className="w-full flex items-center justify-between p-5 text-left transition-colors">
          <div className="flex items-center gap-3 text-slate-400">
            <AlertCircle size={18} className="text-sky-500 opacity-70" />
            <span className="font-bold text-[13px] uppercase tracking-widest">Methodology & Limitations</span>
          </div>
          {showLimitations ? <ChevronUp size={18} className="text-slate-600" /> : <ChevronDown size={18} className="text-slate-600" />}
        </button>
        <AnimatePresence>
          {showLimitations && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 p-6 space-y-6 text-sm text-slate-400 bg-slate-900/40">
              <div className="space-y-2">
                <h4 className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Analysis Pipeline</h4>
                <p className="font-mono text-[11px] text-slate-500 leading-relaxed">{data.metadata?.methodology}</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-sky-400 font-black text-[10px] uppercase tracking-widest">Global Data Sources</h4>
                <div className="flex gap-2 flex-wrap">
                  {data.metadata?.dataSources.map((ds: string) => (
                    <span key={ds} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] border border-white/10 font-bold text-slate-300 transition-colors hover:border-sky-500/30">{ds}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-amber-400 font-black text-[10px] uppercase tracking-widest">Scientific Limitations</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-[12px] text-slate-400 leading-relaxed">
                  {data.limitations.map((lim: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-600 mt-2 shrink-0" />
                      {lim}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default IngredientAnalysis;