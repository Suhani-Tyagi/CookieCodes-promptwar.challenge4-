import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Maximize2, X } from 'lucide-react';

export default function HighlightsVideoModal({ highlightsMatch, closeHighlights, initiatingVideoRef }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(32);
  const videoModalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeHighlights();
      }
      if (e.key === 'Tab' && videoModalRef.current) {
        const focusable = videoModalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Auto-focus first button in highlights player
    setTimeout(() => {
      if (videoModalRef.current) {
        const firstBtn = videoModalRef.current.querySelector('button');
        if (firstBtn) firstBtn.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (initiatingVideoRef && initiatingVideoRef.current) {
        initiatingVideoRef.current.focus();
      }
    };
  }, [closeHighlights, initiatingVideoRef]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div 
        ref={videoModalRef}
        className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-fade-in"
      >
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/50">
          <span id="video-modal-title" className="font-extrabold text-xs text-zinc-700 dark:text-zinc-300">
            Watching Highlights: {highlightsMatch.teamAFlag} {highlightsMatch.teamA} vs {highlightsMatch.teamBFlag} {highlightsMatch.teamB} (Final: {highlightsMatch.scoreA} - {highlightsMatch.scoreB})
          </span>
          <button 
            onClick={closeHighlights} 
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-455 hover:text-zinc-200 transition-colors"
            aria-label="Close highlights player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Viewport Area */}
        <div className="aspect-video bg-zinc-950 relative flex items-center justify-center overflow-hidden border-b border-zinc-200 dark:border-zinc-850">
          
          <div className="absolute inset-0 opacity-80 bg-[#15803d] flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-white/20"></div>
            <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/25"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/25"></div>
            
            {isPlaying && (
              <div className="absolute w-6 h-6 bg-white rounded-full border-2 border-black animate-ping-custom shadow-md flex items-center justify-center text-[10px]">⚽</div>
            )}
            
            {currentTime > 15 && currentTime < 28 && (
              <div className="absolute bg-amber-500 text-white font-black text-2xl px-6 py-2 rounded-xl shadow-lg border border-white animate-bounce z-10 tracking-widest">
                ⚽ GOAL! ⚽
              </div>
            )}

            <div className="absolute bottom-12 left-4 text-[10px] text-white bg-black/60 px-2 py-1 rounded font-bold">
              Simulated Playback • Goal highlight event
            </div>
          </div>

          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <button 
                onClick={() => setIsPlaying(true)}
                className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                aria-label="Play highlights"
              >
                <Play className="w-6 h-6 fill-white ml-1" />
              </button>
            </div>
          )}

        </div>

        {/* Video Controls bar */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 space-y-3 text-xs">
          
          {/* Progress Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-455 font-semibold">
              <span>0:{currentTime.toString().padStart(2, '0')}</span>
              <span>1:20</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative cursor-pointer">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / 80) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-zinc-655 dark:text-zinc-200 hover:text-emerald-500"
                aria-label={isPlaying ? "Pause highlights" : "Play highlights"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <Volume2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </div>
            <Maximize2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>

          {/* highlights markers timeline */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-zinc-450 w-full uppercase">Goal Timeline Seek:</span>
            {highlightsMatch.events.map((ev, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentTime(15 + i * 20);
                  setIsPlaying(true);
                }}
                className="px-2 py-0.5 rounded bg-zinc-200 hover:bg-emerald-55 dark:bg-zinc-850 dark:hover:bg-emerald-950/20 border border-transparent dark:hover:border-emerald-900/30 text-[9px] font-bold text-zinc-700 dark:text-zinc-300"
              >
                {ev.minute} {ev.player} ({ev.type})
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
