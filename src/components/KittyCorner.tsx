"use client";

export function KittyCorner() {
  return (
    <div style={{
      position: "fixed",
      top: 8,
      right: 8,
      zIndex: 200,
      pointerEvents: "none",
      userSelect: "none",
      animation: "kittyFloat 4s ease-in-out infinite",
    }}>
      <style>{`
        @keyframes kittyFloat {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes kittyBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.05); }
        }
        @keyframes tailWag {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(10deg); }
        }
        .kitty-eye-group {
          animation: kittyBlink 5s ease-in-out infinite;
          transform-origin: center;
        }
        .kitty-tail {
          animation: tailWag 2s ease-in-out infinite;
          transform-origin: 45px 55px;
        }
      `}</style>

      <svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tail */}
        <g className="kitty-tail">
          <path d="M12 58 Q0 52 -3 44 Q-5 38 2 40 Q8 42 8 48" stroke="#3D3D3D" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>

        {/* Body hint */}
        <ellipse cx="38" cy="72" rx="24" ry="18" fill="#F5F5F5" />
        {/* Black body patch */}
        <ellipse cx="48" cy="68" rx="14" ry="12" fill="#3D3D3D" />

        {/* Head */}
        <ellipse cx="42" cy="40" rx="32" ry="30" fill="#FAFAFA" />

        {/* Black head patches */}
        <ellipse cx="56" cy="20" rx="18" ry="14" fill="#3D3D3D" />  {/* right ear area */}
        <ellipse cx="28" cy="18" rx="14" ry="12" fill="#3D3D3D" />  {/* left ear area */}
        <ellipse cx="58" cy="50" rx="10" ry="9" fill="#3D3D3D" />   {/* right cheek spot */}

        {/* Left ear (black) */}
        <polygon points="18,16 26,6 34,14" fill="#3D3D3D" />
        <polygon points="22,15 26,8 30,14" fill="#E8C8C8" />
        {/* Right ear (black) */}
        <polygon points="48,14 56,4 64,12" fill="#3D3D3D" />
        <polygon points="52,13 56,7 60,12" fill="#E8C8C8" />

        {/* Eyes group for blinking */}
        <g className="kitty-eye-group">
          {/* Left eye */}
          <ellipse cx="33" cy="36" rx="7" ry="8" fill="white" />
          <ellipse cx="33" cy="37" rx="4.5" ry="5.5" fill="#4A7A3A" />
          <ellipse cx="33" cy="35" rx="2.5" ry="3" fill="#1A1A1A" />
          <circle cx="31" cy="34" r="1.8" fill="white" />
          <circle cx="35" cy="37" r="1" fill="white" />

          {/* Right eye */}
          <ellipse cx="53" cy="36" rx="7" ry="8" fill="white" />
          <ellipse cx="53" cy="37" rx="4.5" ry="5.5" fill="#4A7A3A" />
          <ellipse cx="53" cy="35" rx="2.5" ry="3" fill="#1A1A1A" />
          <circle cx="51" cy="34" r="1.8" fill="white" />
          <circle cx="55" cy="37" r="1" fill="white" />
        </g>

        {/* Nose */}
        <ellipse cx="43" cy="47" rx="4" ry="3" fill="#E89898" />

        {/* Mouth */}
        <path d="M39 51 Q43 54 47 51" stroke="#A09090" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <line x1="43" y1="50" x2="43" y2="52.5" stroke="#A09090" strokeWidth="1.2" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="10" y1="43" x2="26" y2="45" stroke="#C8C0B8" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="10" y1="47" x2="26" y2="47" stroke="#C8C0B8" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="58" y1="45" x2="74" y2="43" stroke="#C8C0B8" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="58" y1="47" x2="74" y2="47" stroke="#C8C0B8" strokeWidth="0.8" strokeLinecap="round" />

        {/* Paws on the edge */}
        <ellipse cx="22" cy="68" rx="10" ry="7" fill="#FAFAFA" />
        <ellipse cx="15" cy="70" rx="3" ry="2.5" fill="#E8C8C8" />
        <ellipse cx="22" cy="70" rx="3" ry="2.5" fill="#E8C8C8" />
        <ellipse cx="29" cy="70" rx="3" ry="2.5" fill="#E8C8C8" />

        <ellipse cx="62" cy="66" rx="9" ry="6" fill="#3D3D3D" />
        <ellipse cx="56" cy="68" rx="2.5" ry="2" fill="#555" />
        <ellipse cx="62" cy="68" rx="2.5" ry="2" fill="#555" />
        <ellipse cx="68" cy="68" rx="2.5" ry="2" fill="#555" />
      </svg>
    </div>
  );
}
