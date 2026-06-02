"use client";

export function KittyCorner() {
  return (
    <div style={{
      position: "fixed",
      top: -6,
      right: -12,
      zIndex: 200,
      pointerEvents: "none",
      userSelect: "none",
    }}>
      <style>{`
        @keyframes peekBounce {
          0%, 100% { transform: translateY(0) translateX(0); }
          30% { transform: translateY(-5px) translateX(-3px); }
          60% { transform: translateY(-2px) translateX(1px); }
        }
        @keyframes slowBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.06); }
        }
        @keyframes pawCling {
          0%, 100% { transform: rotate(0deg); }
          40% { transform: rotate(-8deg); }
          70% { transform: rotate(4deg); }
        }
        .kitty-scene {
          animation: peekBounce 4.5s ease-in-out infinite;
          position: relative;
          width: 105px;
          height: 120px;
        }
        /* Head - white base */
        .kitty-head {
          position: absolute;
          right: 0;
          top: 4px;
          width: 90px;
          height: 84px;
          background: linear-gradient(170deg, #F8F8F8 0%, #EDEDED 100%);
          border-radius: 52% 44% 48% 50%;
          box-shadow:
            inset 0 -6px 12px rgba(0,0,0,0.04),
            0 4px 14px rgba(0,0,0,0.1);
        }
        /* Black patches - cow cat pattern */
        .kitty-patch {
          position: absolute;
          background: #2D2D2D;
          border-radius: 50%;
          z-index: 1;
        }
        .kitty-patch.p1 { width: 36px; height: 30px; top: -2px; right: 6px; border-radius: 50% 50% 40% 45%; }     /* right ear area */
        .kitty-patch.p2 { width: 24px; height: 20px; top: 2px; right: 48px; border-radius: 45% 50% 50% 40%; }  /* left ear area */
        .kitty-patch.p3 { width: 22px; height: 18px; top: 50px; right: 2px; border-radius: 45% 40% 50% 50%; } /* right cheek */
        /* Ears */
        .kitty-ear {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-bottom: 24px solid #2D2D2D;
          z-index: 0;
        }
        .kitty-ear-inner {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 14px solid #E8D0D0;
          top: 8px;
          left: -5px;
        }
        .kitty-ear.left  { top: -14px; right: 52px; transform: rotate(-12deg); }
        .kitty-ear.right { top: -16px; right: 10px; transform: rotate(8deg); }
        /* Eyes */
        .kitty-eye {
          position: absolute;
          width: 18px;
          height: 19px;
          background: #fff;
          border-radius: 50%;
          top: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          animation: slowBlink 5s ease-in-out infinite;
          overflow: hidden;
          z-index: 2;
        }
        .kitty-eye-pupil {
          position: absolute;
          width: 11px;
          height: 12px;
          background: radial-gradient(circle at 40% 40%, #5a8a40 0%, #355a20 100%);
          border-radius: 50%;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
        }
        .kitty-eye-shine {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #fff;
          border-radius: 50%;
          top: 3px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }
        .kitty-eye-shine2 {
          position: absolute;
          width: 2.5px;
          height: 2.5px;
          background: #fff;
          border-radius: 50%;
          top: 5px;
          left: 8px;
          z-index: 1;
        }
        .kitty-eye.left  { right: 46px; }
        .kitty-eye.right { right: 18px; }
        /* Nose */
        .kitty-nose {
          position: absolute;
          bottom: 30px;
          right: 38px;
          width: 11px;
          height: 7px;
          background: #E8A0A0;
          border-radius: 50% 50% 45% 45%;
          z-index: 3;
        }
        /* Mouth */
        .kitty-mouth {
          position: absolute;
          bottom: 28px;
          width: 2px;
          height: 7px;
          background: #B0A0A0;
          border-radius: 1px;
          z-index: 3;
        }
        .kitty-mouth::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: -4px;
          width: 10px;
          height: 1.5px;
          background: #B0A0A0;
          border-radius: 2px;
        }
        .kitty-mouth.left  { right: 46px; transform: rotate(5deg); }
        .kitty-mouth.right { right: 32px; transform: rotate(-5deg); }
        /* Whiskers */
        .kitty-whisker {
          position: absolute;
          height: 1px;
          background: #C0B8B0;
          z-index: 3;
        }
        .kitty-whisker:nth-child(12) { width: 22px; top: 42px; right: 52px; transform: rotate(-14deg); }
        .kitty-whisker:nth-child(13) { width: 20px; top: 46px; right: 54px; transform: rotate(2deg); }
        .kitty-whisker:nth-child(14) { width: 20px; top: 42px; right: 6px; transform: rotate(14deg); }
        .kitty-whisker:nth-child(15) { width: 18px; top: 46px; right: 4px; transform: rotate(-2deg); }
        /* Paws gripping top of screen */
        .kitty-paw {
          position: absolute;
          top: 62px;
          width: 26px;
          height: 20px;
          background: #F5F5F5;
          border-radius: 45% 45% 50% 50%;
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
          z-index: 4;
          animation: pawCling 3s ease-in-out infinite;
          transform-origin: top center;
        }
        .kitty-paw::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 6px;
          background: #2D2D2D;
          border-radius: 50%;
          bottom: 4px;
          left: 4px;
          box-shadow: 10px 0 0 #2D2D2D;
        }
        .kitty-paw.left  { right: 56px; animation-delay: 0.8s; }
        .kitty-paw.right { right: 10px; }
      `}</style>

      <div className="kitty-scene">
        <div className="kitty-head">
          <div className="kitty-patch p1" />
          <div className="kitty-patch p2" />
          <div className="kitty-patch p3" />
          <div className="kitty-ear left"><div className="kitty-ear-inner" /></div>
          <div className="kitty-ear right"><div className="kitty-ear-inner" /></div>
          <div className="kitty-eye left">
            <div className="kitty-eye-pupil" /><div className="kitty-eye-shine" /><div className="kitty-eye-shine2" />
          </div>
          <div className="kitty-eye right">
            <div className="kitty-eye-pupil" /><div className="kitty-eye-shine" /><div className="kitty-eye-shine2" />
          </div>
          <div className="kitty-nose" />
          <div className="kitty-mouth left" />
          <div className="kitty-mouth right" />
          <div className="kitty-whisker" />
          <div className="kitty-whisker" />
          <div className="kitty-whisker" />
          <div className="kitty-whisker" />
          <div className="kitty-paw left" />
          <div className="kitty-paw right" />
        </div>
      </div>
    </div>
  );
}
