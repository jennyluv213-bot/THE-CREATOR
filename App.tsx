
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  BrainCircuit, 
  Zap,
  BarChart3,
  Target,
  ArrowUpRight,
  Palette,
  Sun,
  Layout,
  TrendingUp,
  BookMarked,
  Brain,
  GraduationCap
} from 'lucide-react';
import { DaySchedule, TimetableConfig, SubjectGlossary, SubjectTerm } from './types';
import { generatePlan, expandGlossary, GenerationResponse } from './services/geminiService';
import TimetableCard from './components/TimetableCard';
import GlossarySection from './components/GlossarySection';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'dictionary'>('schedule');
  const [config, setConfig] = useState<TimetableConfig>({
    closingTime: '15:30',
    bedTime: '22:30',
    focusArea: 'Balanced',
    theme: 'colorful'
  });
  const [data, setData] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandingSubject, setExpandingSubject] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePlan(config);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("AI Engine Busy. Retrying...");
    } finally {
      setLoading(false);
    }
  }, [config]);

  const handleExpandGlossary = async (subject: string) => {
    if (expandingSubject) return;
    setExpandingSubject(subject);
    try {
      const existingCount = data?.glossary.find(g => g.subject === subject)?.terms.length || 0;
      const newTerms = await expandGlossary(subject, existingCount);
      
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          glossary: prev.glossary.map(g => 
            g.subject === subject 
              ? { ...g, terms: [...g.terms, ...newTerms] }
              : g
          )
        };
      });
    } catch (err) {
      console.error("Expansion failed", err);
    } finally {
      setExpandingSubject(null);
    }
  };

  useEffect(() => { handleGenerate(); }, []);

  const stats = useMemo(() => {
    if (!data?.schedule) return null;
    const allSlots = data.schedule.flatMap(d => d.slots);
    const totalTerms = data.glossary.reduce((acc, curr) => acc + curr.terms.length, 0);
    const totalStudyHours = allSlots.filter(s => s.type !== 'break' && s.type !== 'personal').length * 1.5;
    
    return { totalTerms, totalStudyHours };
  }, [data]);

  const isMono = config.theme === 'monochrome';

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isMono ? 'bg-zinc-50 text-zinc-900' : 'bg-[#fcfcff] text-[#202124]'} pb-24 selection:bg-indigo-100 relative overflow-hidden`}>
      
      {/* Dynamic Vibrant Background Splashes */}
      {!isMono && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360],
              x: [0, 100, 0, -100, 0],
              y: [0, -100, 0, 100, 0]
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-[140px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 270, 180, 90, 0],
              x: [0, -150, 0, 150, 0],
              y: [0, 150, 0, -150, 0]
            }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-br from-rose-400/20 to-purple-500/20 blur-[140px] rounded-full" 
          />
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-amber-200/20 blur-[100px] rounded-full" 
          />
        </div>
      )}

      <div className={`h-2 w-full flex sticky top-0 z-[100] transition-all duration-500 ${isMono ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
        {!isMono && (
          <>
            <div className="h-full flex-1 bg-[#FF0080]"></div>
            <div className="h-full flex-1 bg-[#7928CA]"></div>
            <div className="h-full flex-1 bg-[#00D2FF]"></div>
            <div className="h-full flex-1 bg-[#00F260]"></div>
            <div className="h-full flex-1 bg-[#FDC830]"></div>
          </>
        )}
      </div>

      <nav className={`sticky top-4 z-50 px-8 h-20 flex items-center justify-between mx-6 mt-6 rounded-[36px] border transition-all duration-700 ${
        isMono 
          ? 'bg-white/80 backdrop-blur-xl border-zinc-200 shadow-sm' 
          : 'bg-white/60 backdrop-blur-3xl border-white/50 shadow-2xl shadow-indigo-100/40'
      }`}>
        <div className="flex items-center space-x-5">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className={`w-14 h-14 rounded-[22px] flex items-center justify-center text-white shadow-2xl transition-all ${
              isMono ? 'bg-zinc-900' : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 shadow-indigo-200'
            }`}
          >
            <BrainCircuit className="w-8 h-8" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className={`text-2xl font-black tracking-tighter leading-none ${isMono ? 'text-zinc-900' : 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500'}`}>SHS ELITE</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Vibrant Study Core</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100/60 p-1.5 rounded-[26px] border border-white/40">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'schedule' 
                ? (isMono ? 'bg-zinc-900 text-white shadow-xl' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200 scale-105') 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Timetable
          </button>
          <button 
            onClick={() => setActiveTab('dictionary')}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'dictionary' 
                ? (isMono ? 'bg-zinc-900 text-white shadow-xl' : 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-xl shadow-rose-200 scale-105') 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Glossary ({stats?.totalTerms || 0})
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            onClick={() => setConfig({...config, theme: isMono ? 'colorful' : 'monochrome'})}
            className={`p-4 rounded-full border transition-all ${
              isMono ? 'bg-zinc-100 border-zinc-200' : 'bg-white border-slate-100 shadow-lg text-indigo-600'
            }`}
          >
            {isMono ? <Sun className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={loading}
            className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center space-x-3 disabled:opacity-50 transition-all ${
              isMono ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white hover:brightness-110 shadow-indigo-200'
            }`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            <span className="hidden md:inline">Sync AI</span>
          </motion.button>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto px-10 py-12 relative z-10">
        <div className="flex flex-col xl:flex-row gap-12">
          
          {/* Static Sidebar */}
          <aside className="xl:w-[360px] shrink-0 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-10 rounded-[48px] shadow-2xl border transition-all duration-700 ${
                isMono ? 'bg-white border-zinc-200' : 'bg-white/70 backdrop-blur-2xl border-white shadow-indigo-100/50'
              }`}
            >
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center">
                <Target className="w-5 h-5 mr-3 text-rose-500" />
                Performance Metrics
              </h2>
              
              <div className="space-y-10">
                <div className="flex justify-between items-end">
                  <div>
                    <div className={`text-5xl font-black tracking-tighter ${isMono ? 'text-zinc-900' : 'text-slate-800'}`}>
                      {stats?.totalTerms || 0}
                    </div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Active Vocabulary</div>
                  </div>
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-8 h-8 text-emerald-500 mb-2" />
                  </motion.div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Goal: 500+
                    </span>
                    <span className={isMono ? 'text-zinc-900' : 'text-indigo-600'}>
                      {Math.min(100, Math.round(((stats?.totalTerms || 0) / 500) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((stats?.totalTerms || 0) / 500) * 100)}%` }}
                      className={`h-full rounded-full transition-all ${
                        isMono ? 'bg-zinc-900' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-50 space-y-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-300 mb-3 uppercase tracking-widest">School Routine</span>
                    <div className={`flex items-center justify-between p-5 rounded-[28px] border transition-all ${
                      isMono ? 'bg-zinc-50 border-zinc-100' : 'bg-slate-50 border-slate-100 group hover:border-indigo-100 hover:bg-white'
                    }`}>
                      <div className="flex items-center gap-4">
                        <Clock className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-black text-slate-700 uppercase">07:00 — {config.closingTime}</span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-300 mb-3 uppercase tracking-widest">Focus Mode</span>
                    <div className="flex gap-3">
                      {['Low', 'Turbo', 'Elite'].map(l => (
                        <button key={l} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                          l === 'Elite' 
                            ? (isMono ? 'bg-zinc-900 text-white' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100') 
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`p-12 rounded-[56px] text-white relative overflow-hidden group shadow-3xl ${
                isMono ? 'bg-zinc-900' : 'bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#2193b0]'
              }`}
            >
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Brain className="w-10 h-10 animate-pulse text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter leading-tight">Master The<br/>Curriculum</h3>
                  <p className="text-xs font-medium opacity-80 leading-relaxed mt-4">
                    Unlock elite academic terms with one click. Our AI expands your base dictionary specifically for SHS WASSCE exams.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 blur-[80px] rounded-full group-hover:scale-150 transition-all duration-1000" />
            </motion.div>
          </aside>

          {/* Dynamic Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="h-[75vh] flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="relative mb-14">
                    <div className={`w-40 h-40 border-8 rounded-full animate-spin border-slate-100 ${isMono ? 'border-t-zinc-900' : 'border-t-indigo-600 shadow-2xl shadow-indigo-200'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuit className={`w-20 h-20 animate-pulse ${isMono ? 'text-zinc-900' : 'text-indigo-600'}`} />
                    </div>
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter text-slate-800">Forging Your Success...</h3>
                  <p className="text-slate-400 font-bold text-lg mt-6 uppercase tracking-[0.3em]">AI Synthesis In Progress</p>
                </motion.div>
              ) : activeTab === 'schedule' ? (
                <motion.div 
                  key="timetable-view"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10"
                >
                  {data?.schedule.map((day, idx) => (
                    <TimetableCard key={idx} daySchedule={day} index={idx} theme={config.theme} />
                  ))}
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    className={`rounded-[48px] p-14 border-4 border-dashed flex flex-col items-center justify-center text-center transition-all ${
                      isMono ? 'bg-white border-zinc-100' : 'bg-white/40 border-indigo-100 hover:bg-white'
                    }`}
                  >
                    <GraduationCap className={`w-20 h-20 mb-8 transition-colors ${isMono ? 'text-zinc-200' : 'text-indigo-200 group-hover:text-indigo-600'}`} />
                    <h4 className="text-2xl font-black uppercase tracking-tight text-slate-400">Full Access</h4>
                    <p className="text-xs text-slate-300 uppercase font-black tracking-[0.2em] mt-3">Excellence Awaits</p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="dictionary-view-expanded"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlossarySection 
                    glossary={data?.glossary || []} 
                    theme={config.theme} 
                    onExpand={handleExpandGlossary}
                    isExpanding={expandingSubject}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Epic Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.15, rotate: 8, y: -5 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => setActiveTab(activeTab === 'schedule' ? 'dictionary' : 'schedule')}
        className={`fixed bottom-12 right-12 w-24 h-24 rounded-[36px] shadow-3xl flex flex-col items-center justify-center z-[100] border-4 transition-all ${
          isMono 
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200' 
            : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 border-white/50 text-white shadow-rose-200'
        }`}
      >
        {activeTab === 'schedule' ? (
          <>
            <BookMarked className="w-8 h-8" />
            <span className="text-[8px] font-black uppercase mt-1">Study</span>
          </>
        ) : (
          <>
            <Calendar className="w-8 h-8" />
            <span className="text-[8px] font-black uppercase mt-1">Plan</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default App;
