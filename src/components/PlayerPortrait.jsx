import React, { useState, useEffect } from 'react';

export default function PlayerPortrait({ name, jerseyColor, number, flag, photoUrl, className = "w-12 h-12 shrink-0" }) {
  const [hasError, setHasError] = useState(!photoUrl);

  useEffect(() => {
    setHasError(!photoUrl);
  }, [photoUrl]);

  const getFallbackFace = () => {
    switch (name) {
      case "Lionel Messi":
        return { hairColor: "#78350f", hasBeard: true, beardColor: "#78350f", skinTone: "#fed7aa", hairStyle: "messy" };
      case "Kylian Mbappé":
        return { hairColor: "#1e1b4b", hasBeard: false, beardColor: "transparent", skinTone: "#a16207", hairStyle: "buzzcut" };
      case "Hakim Ziyech":
        return { hairColor: "#0f172a", hasBeard: true, beardColor: "#0f172a", skinTone: "#ffedd5", hairStyle: "fade" };
      case "Erling Haaland":
        return { hairColor: "#fef08a", hasBeard: false, beardColor: "transparent", skinTone: "#fee2e2", hairStyle: "manbun" };
      case "Jude Bellingham":
        return { hairColor: "#1e1b4b", hasBeard: false, beardColor: "transparent", skinTone: "#78350f", hairStyle: "flat-top" };
      case "Dani Olmo":
        return { hairColor: "#7c2d12", hasBeard: false, beardColor: "transparent", skinTone: "#ffedd5", hairStyle: "short" };
      case "Kevin De Bruyne":
        return { hairColor: "#fbbf24", hasBeard: false, beardColor: "transparent", skinTone: "#fee2e2", hairStyle: "parted" };
      default:
        return { hairColor: "#4b5563", hasBeard: false, beardColor: "transparent", skinTone: "#f3f4f6", hairStyle: "standard" };
    }
  };

  const face = getFallbackFace();

  return (
    <div className={`${className} rounded-full border-2 border-zinc-250 dark:border-zinc-800 bg-gradient-to-tr from-zinc-105 to-white dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center relative overflow-hidden shadow-sm shrink-0`}>
      {hasError ? (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="42" y="50" width="16" height="15" fill={face.skinTone} />
          <circle cx="50" cy="38" r="18" fill={face.skinTone} />
          <circle cx="43" cy="35" r="2" fill="#1e293b" />
          <circle cx="57" cy="35" r="2" fill="#1e293b" />
          {face.hasBeard && (
            <path d="M 32 38 Q 50 60 68 38 L 65 48 Q 50 56 35 48 Z" fill={face.beardColor} opacity="0.85" />
          )}
          {face.hairStyle === "messy" && <path d="M 30 30 Q 50 15 70 30 Q 75 18 50 18 Q 25 18 30 30" fill={face.hairColor} />}
          {face.hairStyle === "buzzcut" && <path d="M 32 30 C 32 20, 68 20, 68 30" stroke={face.hairColor} strokeWidth="4" fill="none" />}
          {face.hairStyle === "fade" && <path d="M 30 32 Q 50 20 70 32" stroke={face.hairColor} strokeWidth="3" fill="none" />}
          {face.hairStyle === "manbun" && (
            <>
              <path d="M 30 32 Q 50 18 70 32 Z" fill={face.hairColor} />
              <circle cx="50" cy="14" r="5" fill={face.hairColor} />
            </>
          )}
          {face.hairStyle === "flat-top" && <path d="M 31 26 L 69 26 L 68 35 L 32 35 Z" fill={face.hairColor} />}
          {face.hairStyle === "parted" && <path d="M 30 30 Q 42 16 50 24 Q 58 16 70 30 Z" fill={face.hairColor} />}
          {face.hairStyle === "short" && <path d="M 31 30 Q 50 21 69 30 Z" fill={face.hairColor} />}
          
          <path d="M 20 90 C 20 72, 30 60, 50 60 C 70 60, 80 72, 80 90 Z" fill={jerseyColor} />
          <path d="M 38 60 L 50 73 L 62 60 Z" fill={face.skinTone} />
          <text x="50" y="85" fill="#ffffff" fontSize="20" fontWeight="black" textAnchor="middle">{number}</text>
        </svg>
      ) : (
        <img 
          src={photoUrl} 
          onError={() => setHasError(true)} 
          alt={name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
        />
      )}
      
      <span className="absolute bottom-0 right-0 text-[10px] bg-white dark:bg-zinc-950 px-1 py-0.5 rounded-tl border-t border-l border-zinc-200 dark:border-zinc-855 font-bold leading-none">
        {flag}
      </span>
    </div>
  );
}
