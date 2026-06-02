"use client";

export function KittyCorner() {
  return (
    <div style={{
      position: "fixed",
      top: -8,
      right: -10,
      zIndex: 200,
      pointerEvents: "none",
      userSelect: "none",
    }}>
      <style>{`
        @keyframes kittyPeek {
          0%, 100% { transform: translate(4px, 0px) rotate(-3deg); }
          50% { transform: translate(-2px, -4px) rotate(0deg); }
        }
        @keyframes kittyBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.05); }
        }
        @keyframes pawTap {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
        }
        .kitty-container {
          animation: kittyPeek 5s ease-in-out infinite;
          position: relative;
          width: 90px;
          height: 90px;
        }
        /* Orange face */
        .kitty-face {
          position: absolute;
          top: 6px;
          right: 4px;
          width: 72px;
          height: 66px;
          background: linear-gradient(180deg, #F5A623 0%, #E8912D 60%, #F0B870 100%);
          border-radius: 50% 45% 50% 50%;
          box-shadow:
            inset 0 -8px 12px rgba(180,100,40,0.3),
            0 4px 12px rgba(0,0,0,0.1);
        }
        /* Ears */
        .kitty-ear {
          position: absolute;
          width: 22px;
          height: 24px;
          background: #F5A623;
          border-radius: 50% 50% 20% 20%;
          box-shadow: inset 0 2px 4px rgba(180,100,40,0.35);
        }
        .kitty-ear::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 5px;
          width: 12px;
          height: 14px;
          background: #F8C8A0;
          border-radius: 50%;
        }
        .kitty-ear.left {
          top: -6px;
          right: 44px;
          transform: rotate(-15deg);
        }
        .kitty-ear.right {
          top: -8px;
          right: 6px;
          transform: rotate(10deg);
        }
        /* Eyes */
        .kitty-eye {
          position: absolute;
          width: 16px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          top: 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          animation: kittyBlink 4s ease-in-out infinite;
        }
        .kitty-eye::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 11px;
          background: #3D2B1F;
          border-radius: 50%;
          top: 3px;
          left: 4px;
        }
        .kitty-eye::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          top: 4px;
          left: 8px;
          z-index: 1;
        }
        .kitty-eye.left { right: 40px; }
        .kitty-eye.right { right: 14px; }
        /* Nose */
        .kitty-nose {
          position: absolute;
          top: 36px;
          right: 30px;
          width: 12px;
          height: 9px;
          background: #E88B8B;
          border-radius: 50%;
        }
        /* Mouth */
        .kitty-mouth {
          position: absolute;
          top: 40px;
          right: 34px;
          width: 4px;
          height: 5px;
          border-bottom: 2px solid #A08070;
          border-radius: 0 0 50% 50%;
        }
        /* Whiskers */
        .kitty-whisker {
          position: absolute;
          top: 38px;
          width: 20px;
          height: 1px;
          background: #D4B896;
        }
        .kitty-whisker:nth-child(8) { right: 52px; transform: rotate(-8deg); }
        .kitty-whisker:nth-child(9) { right: 52px; transform: rotate(5deg); top: 42px; }
        .kitty-whisker:nth-child(10) { right: 4px; transform: rotate(8deg); }
        .kitty-whisker:nth-child(11) { right: 4px; transform: rotate(-5deg); top: 42px; }
        /* Tabby stripes */
        .kitty-stripe {
          position: absolute;
          height: 3px;
          background: #D47820;
          border-radius: 2px;
          opacity: 0.6;
        }
        .kitty-stripe:nth-child(12) { top: 12px; right: 30px; width: 16px; transform: rotate(-5deg); }
        .kitty-stripe:nth-child(13) { top: 16px; right: 34px; width: 12px; transform: rotate(-3deg); }
        .kitty-stripe:nth-child(14) { top: 14px; right: 16px; width: 14px; transform: rotate(4deg); }
        /* Paws */
        .kitty-paw {
          position: absolute;
          width: 24px;
          height: 20px;
          background: #F5A623;
          border-radius: 50% 50% 45% 45%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        .kitty-paw::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 5px;
          width: 6px;
          height: 5px;
          background: #F8C8A0;
          border-radius: 50%;
          box-shadow: 8px 0 0 #F8C8A0;
        }
        .kitty-paw.left {
          bottom: 6px;
          right: 50px;
          animation: pawTap 2.5s ease-in-out infinite;
          transform-origin: top right;
        }
        .kitty-paw.right {
          bottom: 8px;
          right: -2px;
          animation: pawTap 2.5s ease-in-out 0.6s infinite;
          transform-origin: top left;
        }
      `}</style>

      <div className="kitty-container">
        <div className="kitty-face">
          <div className="kitty-ear left" />
          <div className="kitty-ear right" />
          <div className="kitty-eye left" />
          <div className="kitty-eye right" />
          <div className="kitty-nose" />
          <div className="kitty-mouth" />
          <div className="kitty-whisker" />
          <div className="kitty-whisker" />
          <div className="kitty-whisker" />
          <div className="kitty-whisker" />
          <div className="kitty-stripe" />
          <div className="kitty-stripe" />
          <div className="kitty-stripe" />
        </div>
        <div className="kitty-paw left" />
        <div className="kitty-paw right" />
      </div>
    </div>
  );
}
