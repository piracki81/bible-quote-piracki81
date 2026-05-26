import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, BookOpen, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { supabase, Verse } from './lib/supabase';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [history, setHistory] = useState<number[]>([]);
  const [historyPos, setHistoryPos] = useState(-1);
  const [adminOpen, setAdminOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('verses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        setVerses(data);
        const initialIndex = Math.floor(Math.random() * data.length);
        setCurrentIndex(initialIndex);
        setHistory([initialIndex]);
        setHistoryPos(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerses();
  }, [fetchVerses]);

  const transition = useCallback((newIndex: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setVisible(true);
    }, 350);
  }, []);

  const handleNext = useCallback(() => {
    if (verses.length <= 1) return;
    let newIndex = Math.floor(Math.random() * verses.length);
    if (newIndex === currentIndex) {
      newIndex = (newIndex + 1) % verses.length;
    }
    const newHistory = history.slice(0, historyPos + 1);
    newHistory.push(newIndex);
    setHistory(newHistory);
    setHistoryPos(newHistory.length - 1);
    transition(newIndex);
  }, [currentIndex, verses.length, history, historyPos, transition]);

  const handlePrev = useCallback(() => {
    if (historyPos <= 0) return;
    const newPos = historyPos - 1;
    setHistoryPos(newPos);
    transition(history[newPos]);
  }, [history, historyPos, transition]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (adminOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext, handlePrev, adminOpen]);

  const progress = verses.length > 0 ? ((historyPos + 1) / verses.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-600/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading verses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchVerses}
            className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (verses.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
        <div className="text-center">
          <BookOpen size={48} className="text-amber-600/50 mx-auto mb-4" />
          <p className="text-white/70 mb-6">No verses available yet.</p>
          <button
            onClick={() => setAdminOpen(true)}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Add First Verse
          </button>
          <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} onVerseAdded={fetchVerses} />
        </div>
      </div>
    );
  }

  const verse = verses[currentIndex];

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-amber-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-amber-800/8 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-stone-800/10 blur-[180px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Admin button */}
      <button
        onClick={() => setAdminOpen(true)}
        className="fixed top-4 right-4 z-40 p-2.5 rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
        title="Add new verse"
      >
        <Settings size={18} />
      </button>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-8 h-px bg-amber-700/50" />
          <div className="flex items-center gap-2 text-amber-600/80">
            <BookOpen size={16} strokeWidth={1.5} />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-amber-600/70">
              Scripture of the Day
            </span>
          </div>
          <div className="w-8 h-px bg-amber-700/50" />
        </div>

        {/* Quote Card */}
        <div className="relative">
          {/* Glow border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-800/30 via-amber-900/10 to-transparent pointer-events-none" />

          <div className="relative bg-[#161820] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

            <div className="px-8 pt-10 pb-8 md:px-12 md:pt-12 md:pb-10">
              {/* Large decorative quote mark */}
              <div
                className="text-[96px] leading-none text-amber-800/20 font-serif select-none mb-2 -mt-4 -ml-2"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Quote text */}
              <div
                className="transition-all duration-350 ease-in-out"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                }}
              >
                <p className="text-white/90 text-xl md:text-2xl leading-relaxed font-light tracking-wide mb-8">
                  {verse.text}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-500 font-semibold text-base tracking-wide">
                      {verse.reference}
                    </p>
                    <p className="text-white/30 text-sm mt-1 tracking-widest uppercase text-xs">
                      {verse.book}
                    </p>
                  </div>

                  {/* Quote number indicator */}
                  <div className="text-right">
                    <span className="text-white/20 text-xs tabular-nums">
                      {String(historyPos + 1).padStart(2, '0')} / {String(verses.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/20 to-transparent" />

            {/* Progress bar */}
            <div className="h-0.5 bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-700 to-amber-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={historyPos <= 0}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/8 bg-white/3 text-white/40 text-sm font-medium tracking-wide transition-all duration-200 hover:border-white/15 hover:bg-white/6 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:border-white/8 disabled:hover:bg-white/3 disabled:hover:text-white/40"
          >
            <ChevronLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5 group-disabled:translate-x-0" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={verses.length <= 1}
            className="group flex items-center gap-2.5 px-7 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-amber-900/40 hover:shadow-amber-800/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className="transition-transform duration-500 group-hover:rotate-180" />
            New Verse
          </button>

          <button
            onClick={handleNext}
            disabled={verses.length <= 1}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/8 bg-white/3 text-white/40 text-sm font-medium tracking-wide transition-all duration-200 hover:border-white/15 hover:bg-white/6 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-white/20 text-xs mt-8 tracking-widest">
          Press <kbd className="font-mono bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/30">Space</kbd> or{' '}
          <kbd className="font-mono bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/30">→</kbd> for a new verse
        </p>
      </div>

      <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} onVerseAdded={fetchVerses} />
    </div>
  );
}
