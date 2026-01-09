
export interface StudySlot {
  time: string;
  subject: string;
  activity: string;
  topics: string[];
  progress: number;
  type: 'core' | 'elective' | 'break' | 'personal';
}

export interface DaySchedule {
  day: string;
  intensityScore: number;
  slots: StudySlot[];
}

export interface SubjectTerm {
  term: string;
  definition: string;
  category: string;
}

export interface SubjectGlossary {
  subject: string;
  terms: SubjectTerm[];
}

export interface TimetableConfig {
  closingTime: string;
  bedTime: string;
  focusArea: 'Balanced' | 'Math-Heavy' | 'Humanities-Heavy' | 'General-Science';
  theme: 'colorful' | 'monochrome';
}

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; accent: string; gradient: string; shadow: string }> = {
  'English': {
    bg: 'bg-[#00D2FF]',
    text: 'text-white',
    border: 'border-[#00D2FF]/30',
    accent: 'bg-[#3a7bd5]',
    gradient: 'from-[#00d2ff] to-[#3a7bd5]',
    shadow: 'shadow-[#00d2ff]/20'
  },
  'Core Maths': {
    bg: 'bg-[#FF0080]',
    text: 'text-white',
    border: 'border-[#FF0080]/30',
    accent: 'bg-[#7928CA]',
    gradient: 'from-[#FF0080] to-[#7928CA]',
    shadow: 'shadow-[#FF0080]/20'
  },
  'Integrated Science': {
    bg: 'bg-[#00F260]',
    text: 'text-white',
    border: 'border-[#00F260]/30',
    accent: 'bg-[#0575E6]',
    gradient: 'from-[#00F260] to-[#0575E6]',
    shadow: 'shadow-[#00F260]/20'
  },
  'Social Studies': {
    bg: 'bg-[#FDC830]',
    text: 'text-white',
    border: 'border-[#FDC830]/30',
    accent: 'bg-[#F37335]',
    gradient: 'from-[#FDC830] to-[#F37335]',
    shadow: 'shadow-[#FDC830]/20'
  },
  'Geography': {
    bg: 'bg-[#8E2DE2]',
    text: 'text-white',
    border: 'border-[#8E2DE2]/30',
    accent: 'bg-[#4A00E0]',
    gradient: 'from-[#8E2DE2] to-[#4A00E0]',
    shadow: 'shadow-[#8E2DE2]/20'
  },
  'Add Maths': {
    bg: 'bg-[#1D976C]',
    text: 'text-white',
    border: 'border-[#1D976C]/30',
    accent: 'bg-[#93F9B9]',
    gradient: 'from-[#1D976C] to-[#93F9B9]',
    shadow: 'shadow-[#1D976C]/20'
  },
  'Economics': {
    bg: 'bg-[#f4c4f3]',
    text: 'text-white',
    border: 'border-[#f4c4f3]/30',
    accent: 'bg-[#fc67fa]',
    gradient: 'from-[#f4c4f3] to-[#fc67fa]',
    shadow: 'shadow-[#fc67fa]/20'
  },
  'History': {
    bg: 'bg-[#232526]',
    text: 'text-white',
    border: 'border-[#414345]/30',
    accent: 'bg-[#414345]',
    gradient: 'from-[#232526] to-[#414345]',
    shadow: 'shadow-black/20'
  },
  'Computing': {
    bg: 'bg-[#2193b0]',
    text: 'text-white',
    border: 'border-[#6dd5ed]/30',
    accent: 'bg-[#6dd5ed]',
    gradient: 'from-[#2193b0] to-[#6dd5ed]',
    shadow: 'shadow-[#2193b0]/20'
  },
  'Break': {
    bg: 'bg-slate-200',
    text: 'text-slate-600',
    border: 'border-slate-300',
    accent: 'bg-slate-300',
    gradient: 'from-slate-100 to-slate-200',
    shadow: 'shadow-slate-200/10'
  },
  'Personal': {
    bg: 'bg-sky-200',
    text: 'text-sky-800',
    border: 'border-sky-300',
    accent: 'bg-sky-300',
    gradient: 'from-sky-100 to-sky-200',
    shadow: 'shadow-sky-200/10'
  },
};

export const MONO_COLORS: Record<string, string> = {
  'core': 'bg-zinc-100 text-zinc-900 border-zinc-200',
  'elective': 'bg-zinc-800 text-zinc-50 border-zinc-700',
  'break': 'bg-zinc-50 text-zinc-400 border-zinc-100',
  'personal': 'bg-white text-zinc-500 border-zinc-200 shadow-sm'
};
