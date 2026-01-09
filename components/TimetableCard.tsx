
import React from 'react';
import { motion } from 'framer-motion';
import { DaySchedule, SUBJECT_COLORS, MONO_COLORS } from '../types';
import { 
  Clock, 
  Book, 
  Calculator, 
  FlaskConical, 
  Globe, 
  History as HistoryIcon, 
  Monitor, 
  PieChart, 
  Coffee, 
  CheckCircle2,
  Trophy,
  Sparkles
} from 'lucide-react';

interface TimetableCardProps {
  daySchedule: DaySchedule;
  index: number;
  theme: 'colorful' | 'monochrome';
}

const getSubjectIcon = (subject: string) => {
  const s = subject.toLowerCase();
  if (s.includes('english')) return <Book className="w-4 h-4" />;
  if (s.includes('maths')) return <Calculator className="w-4 h-4" />;
  if (s.includes('science')) return <FlaskConical className="w-4 h-4" />;
  if (s.includes('geography')) return <Globe className="w-4 h-4" />;
  if (s.includes('social')) return <Globe className="w-4 h-4" />;
  if (s.includes('economics')) return <PieChart className="w-4 h-4" />;
  if (s.includes('history')) return <HistoryIcon className="w-4 h-4" />;
  if (s.includes('computing')) return <Monitor className="w-4 h-4" />;
  if (s.includes('break') || s.includes('personal')) return <Coffee className="w-4 h-4" />;
  return <Sparkles className="w-4 h-4" />;
};

const TimetableCard: React.FC<TimetableCardProps> = ({ daySchedule, index, theme }) => {
  const isMono = theme === 'monochrome';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        type: 'spring', 
        stiffness: 260, 
        damping: 20 
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -12, 
        transition: { type: 'spring', stiffness: 400, damping: 10 } 
      }}
      className={`relative p-8 rounded-[40px] border shadow-2xl overflow-hidden group ${
        isMono ? 'bg-white border-zinc-200 shadow-zinc-200/40' : 'bg-white/90 backdrop-blur-xl border-white/50 shadow-slate-200/50'
      }`}
    >
      {/* Dynamic Aura Background */}
      {!isMono && (
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full -mr-10 -mt-10 pointer-events-none" 
        />
      )}

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className={`text-2xl font-black tracking-tighter ${isMono ? 'text-zinc-900' : 'text-slate-800'}`}>
            {daySchedule.day}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Trophy className={`w-3 h-3 ${isMono ? 'text-zinc-400' : 'text-amber-500'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Intensity: {daySchedule.intensityScore}%
            </span>
          </div>
        </div>
        <motion.div 
          whileHover={{ rotate: 180 }}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isMono ? 'bg-zinc-100 text-zinc-900' : 'bg-indigo-50 text-indigo-600 shadow-inner'}`}
        >
          <Clock className="w-6 h-6" />
        </motion.div>
      </div>

      <div className="space-y-4 relative z-10">
        {daySchedule.slots.map((slot, sIdx) => {
          const colors = SUBJECT_COLORS[slot.subject] || SUBJECT_COLORS['Personal'];
          
          return (
            <motion.div
              key={sIdx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.1) + (sIdx * 0.08), type: 'spring' }}
              whileHover={{ x: 8 }}
              className={`relative p-5 rounded-[32px] border-2 transition-all group/slot ${
                isMono 
                  ? `${MONO_COLORS[slot.type]} border-transparent` 
                  : `bg-white border-transparent hover:border-indigo-100/50 shadow-sm hover:shadow-2xl`
              }`}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all ${
                    isMono ? 'bg-zinc-900 text-white' : `bg-gradient-to-br ${colors.gradient} ${colors.text} ${colors.shadow} ring-4 ring-white`
                  }`}
                >
                  {getSubjectIcon(slot.subject)}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`font-black text-[13px] truncate uppercase tracking-tight ${isMono ? 'text-zinc-900' : 'text-slate-800'}`}>
                      {slot.subject}
                    </h4>
                    <span className="text-[10px] font-black text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      {slot.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold truncate opacity-80 uppercase tracking-tighter">
                    {slot.activity}
                  </p>
                </div>

                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover/slot:text-emerald-500 transition-colors" />
                </motion.div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {slot.topics.slice(0, 3).map((topic, tIdx) => (
                  <span key={tIdx} className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter ${
                    isMono ? 'bg-zinc-200 text-zinc-600' : 'bg-slate-100 text-slate-500 border border-slate-200/20'
                  }`}>
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className={`mt-10 pt-6 border-t ${isMono ? 'border-zinc-100' : 'border-slate-100'} flex justify-between items-center relative z-10`}>
        <div className="flex -space-x-3">
          {[1,2,3,4].map(i => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, scale: 1.1 }}
              className={`w-8 h-8 rounded-full border-4 ${isMono ? 'bg-zinc-100 border-white shadow-sm' : 'bg-gradient-to-tr from-indigo-50 to-white border-white shadow-md'}`} 
            />
          ))}
        </div>
        <motion.button 
          whileHover={{ x: 5 }}
          className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${isMono ? 'text-zinc-900' : 'text-indigo-600'} group/btn`}
        >
          View Full Day <Sparkles className="w-3 h-3 group-hover/btn:animate-spin" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TimetableCard;
