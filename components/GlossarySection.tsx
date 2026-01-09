
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubjectGlossary, SUBJECT_COLORS, SubjectTerm } from '../types';
import { 
  Search, 
  BookOpen, 
  Tag, 
  PlusCircle, 
  Brain, 
  Eye, 
  EyeOff,
  Hash,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface GlossarySectionProps {
  glossary: SubjectGlossary[];
  theme: 'colorful' | 'monochrome';
  onExpand: (subject: string) => void;
  isExpanding: string | null;
}

const GlossarySection: React.FC<GlossarySectionProps> = ({ glossary, theme, onExpand, isExpanding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState(false);

  const totalTerms = useMemo(() => 
    glossary.reduce((acc, curr) => acc + curr.terms.length, 0), 
  [glossary]);

  const filteredGlossary = glossary.filter(g => 
    (!selectedSubject || g.subject === selectedSubject) &&
    (g.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
     g.terms.some(t => t.term.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-8">
      {/* Dictionary Header Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-10 rounded-[48px] border flex flex-col md:flex-row gap-8 items-center justify-between transition-all ${theme === 'monochrome' ? 'bg-white border-zinc-200 shadow-sm' : 'bg-white/70 backdrop-blur-2xl border-white shadow-2xl shadow-indigo-100/50'}`}
      >
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.8 }}
            className={`w-16 h-16 rounded-[22px] flex items-center justify-center ${theme === 'monochrome' ? 'bg-zinc-900 text-white' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200'}`}
          >
            <Hash className="w-8 h-8" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-800">Master Lexicon</h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-amber-500 animate-pulse" />
              {totalTerms} Definitions Loaded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStudyMode(!studyMode)}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all ${studyMode ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
          >
            {studyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {studyMode ? 'Self Test' : 'Recall Mode'}
          </motion.button>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Quick search across all subjects..."
            className={`w-full pl-14 pr-6 py-5 rounded-[28px] border transition-all outline-none font-medium ${theme === 'monochrome' ? 'bg-white border-zinc-200 focus:ring-zinc-900' : 'bg-white border-white/50 focus:ring-4 focus:ring-indigo-100 shadow-xl shadow-indigo-50/20'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide w-full md:w-auto px-2">
          <motion.button 
            whileHover={{ y: -3 }}
            onClick={() => setSelectedSubject(null)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!selectedSubject ? (theme === 'monochrome' ? 'bg-zinc-900 text-white' : 'bg-indigo-600 text-white shadow-xl') : 'bg-white text-slate-400 border border-slate-100'}`}
          >
            All Areas
          </motion.button>
          {glossary.map(g => (
            <motion.button 
              key={g.subject}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedSubject(g.subject)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedSubject === g.subject ? (theme === 'monochrome' ? 'bg-zinc-900 text-white shadow-xl' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100') : 'bg-white text-slate-400 border border-slate-100'}`}
            >
              {g.subject}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredGlossary.map((group, gIdx) => (
            <motion.div 
              key={group.subject}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: gIdx * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className={`rounded-[48px] border p-10 flex flex-col h-full overflow-hidden relative group ${theme === 'monochrome' ? 'bg-white border-zinc-200 shadow-zinc-100/50' : 'bg-white border-white shadow-2xl shadow-slate-200/50 hover:shadow-indigo-100/40'}`}
            >
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${theme === 'monochrome' ? 'bg-zinc-100 text-zinc-900' : (SUBJECT_COLORS[group.subject]?.bg + ' text-white ring-4 ring-white') || 'bg-slate-100'}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tighter uppercase text-slate-800">{group.subject}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{group.terms.length} Mastered</p>
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  disabled={isExpanding === group.subject}
                  onClick={() => onExpand(group.subject)}
                  className={`p-4 rounded-2xl transition-all shadow-sm ${isExpanding === group.subject ? 'animate-pulse bg-slate-100' : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white'}`}
                >
                  {isExpanding === group.subject ? <Brain className="w-6 h-6 animate-spin" /> : <PlusCircle className="w-6 h-6" />}
                </motion.button>
              </div>

              <div className="space-y-5 flex-1 overflow-y-auto max-h-[600px] pr-3 scrollbar-hide relative z-10">
                {group.terms.map((term, tIdx) => (
                  <motion.div 
                    key={tIdx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (gIdx * 0.05) + (tIdx * 0.03) }}
                    className={`group/term p-6 rounded-[32px] border transition-all ${theme === 'monochrome' ? 'hover:bg-zinc-50 border-zinc-100' : 'bg-slate-50/50 hover:bg-white border-transparent hover:border-slate-100 hover:shadow-lg'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className={`font-black text-[15px] tracking-tight transition-transform group-hover/term:translate-x-1 ${theme === 'monochrome' ? 'text-zinc-900' : 'text-indigo-600'}`}>
                        {term.term}
                      </h4>
                      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-100 shadow-sm">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                          {term.category}
                        </span>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {!studyMode && (
                        <motion.p 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-sm text-slate-500 leading-relaxed font-medium mt-3"
                        >
                          {term.definition}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest relative z-10">
                <span className="flex items-center gap-2">
                   Mastery Level: <span className="text-indigo-600">{Math.min(100, Math.round(group.terms.length * 2))}%</span>
                </span>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-indigo-500 cursor-pointer group-hover:underline"
                >
                  DEEP SCAN <ArrowUpRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlossarySection;
