"use client";

import { useMemo } from "react";

export default function AuroraCardBg() {
  const animations = useMemo(
    () => `
    @keyframes auroraCurtainLeft {
      0% { transform: translate(-10%, 0%) rotate(12deg) scaleX(1); opacity: 0.7; }
      50% { transform: translate(5%, -5%) rotate(8deg) scaleX(1.3); opacity: 0.9; }
      100% { transform: translate(-10%, 0%) rotate(12deg) scaleX(1); opacity: 0.7; }
    }
    @keyframes auroraCurtainRight {
      0% { transform: translate(10%, 0%) rotate(-15deg) scaleX(1); opacity: 0.8; }
      50% { transform: translate(-5%, 5%) rotate(-20deg) scaleX(1.4); opacity: 1; }
      100% { transform: translate(10%, 0%) rotate(-15deg) scaleX(1); opacity: 0.8; }
    }
    @keyframes auroraPulse {
      0% { transform: scale(1); opacity: 0.4; }
      50% { transform: scale(1.1); opacity: 0.6; }
      100% { transform: scale(1); opacity: 0.4; }
    }
  `,
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg bg-[#030914] z-0 pointer-events-none">
      <style dangerouslySetInnerHTML={{ __html: animations }} />
      
      {/* Dense Starfield - Layer 1 (Small distant stars) */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Dense Starfield - Layer 2 (Medium stars) */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "10px 10px",
        }}
      />
      {/* Dense Starfield - Layer 3 (Large bright stars) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
          backgroundSize: "64px 64px",
          backgroundPosition: "30px 30px",
        }}
      />

      {/* Aurora Curtains Container */}
      <div className="absolute inset-0 mix-blend-screen opacity-100 filter blur-[40px] sm:blur-[60px]">
        
        {/* Left Curtain - Vibrant Purple / Magenta */}
        <div 
          className="absolute top-[-20%] left-[-20%] w-[100%] h-[150%] rounded-[100%]"
          style={{ 
            background: "linear-gradient(90deg, rgba(138,43,226,0) 0%, rgba(138,43,226,0.8) 50%, rgba(255,0,255,0) 100%)",
            animation: "auroraCurtainLeft 20s ease-in-out infinite",
            transformOrigin: "bottom center"
          }}
        />
        
        {/* Right Curtain - Vivid Neon Green */}
        <div 
          className="absolute top-[-30%] right-[-30%] w-[120%] h-[160%] rounded-[100%]"
          style={{ 
            background: "linear-gradient(90deg, rgba(0,255,102,0) 0%, rgba(0,255,102,0.9) 50%, rgba(0,255,102,0) 100%)",
            animation: "auroraCurtainRight 24s ease-in-out infinite",
            transformOrigin: "bottom center"
          }}
        />

        {/* Center Glow - Deep Blue/Teal bridge */}
        <div 
          className="absolute top-[10%] left-[20%] w-[60%] h-[100%] rounded-full bg-[#0088ff]"
          style={{ animation: "auroraPulse 15s ease-in-out infinite" }}
        />
      </div>

      {/* Dark overlay at the bottom to simulate the dark landscape/horizon and protect text */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#02040a] via-[#02040a]/80 to-transparent pointer-events-none" />
      
      {/* Subtle top dark gradient to frame the sky */}
      <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-[#02040a]/60 to-transparent pointer-events-none" />

      {/* Soft border inner glow */}
      <div className="absolute inset-0 rounded-lg border border-white/5 pointer-events-none" />
    </div>
  );
}
