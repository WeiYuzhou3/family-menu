"use client";

export function KittyCorner() {
  return (
    <div style={{
      position: "fixed",
      right: -28,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 200,
      pointerEvents: "none",
      userSelect: "none",
    }}>
      <style>{`
        @keyframes peekIn {
          0% { transform: translateX(20px) translateY(0); }
          40% { transform: translateX(-4px) translateY(-6px); }
          70% { transform: translateX(2px) translateY(-3px); }
          100% { transform: translateX(0px) translateY(0); }
        }
        @keyframes slowBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.08); }
        }
        @keyframes earTwitch {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes pawGrip {
          0%, 100% { transform: rotate(3deg); }
          50% { transform: rotate(-5deg); }
        }
        .kitty-scene {
          animation: peekIn 4s ease-in-out infinite;
          position: relative;
          width: 110px;
          height: 140px;
          transform-origin: right center;
        }
        .kitty-body {
          position: absolute;
          right: -10px;
          top: 20px;
          width: 95px;
          height: 100px;
          background: linear-gradient(165deg, #F5A623 0%, #E8912D 40%, #F0B870 100%);
          border-radius: 55% 35% 40% 50%;
          box-shadow: inset 0 -10px 18px rgba(160, 80, 30, 0.25), 0 6px 16px rgba(0,0,0,0.08);
        }
        .kitty-head {
          position: absolute;
          right: 0;
          top: 0;
          width: 88px;
          height: 82px;
          background: linear-gradient(170deg, #F5A623 0%, #E8912D 55%, #F0B870 100%);
          border-radius: 55% 40% 50% 50%;
          box-shadow:
            inset 0 -10px 14px rgba(160, 80, 30, 0.3),
            0 4px 10px rgba(0,0,0,0.08);
        }
        /* Muzzle / white cheek area */
        .kitty-muzzle {
          position: absolute;
          right: 6px;
          bottom: 8px;
          width: 42px;
          height: 28px;
          background: linear-gradient(180deg, #FFF8F3 0%, #F5E6D8 100%);
          border-radius: 50%;
          opacity: 0.85;
        }
        /* Ears */
        .kitty-ear {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 22px solid #E8912D;
          filter: drop-shadow(0 -2px 2px rgba(160,80,30,0.3));
        }
        .kitty-ear-inner {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 14px solid #F0C8B0;
          top: 8px;
          left: -5px;
        }
        .kitty-ear.left {
          top: -14px;
          right: 50px;
          transform: rotate(-10deg);
          animation: earTwitch 3s ease-in-out infinite;
        }
        .kitty-ear.right {
          top: -16px;
          right: 8px;
          transform: rotate(8deg);
          animation: earTwitch 3s ease-in-out 0.4s infinite;
        }
        /* Eyes - big and cute */
        .kitty-eye {
          position: absolute;
          width: 18px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          top: 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          animation: slowBlink 5s ease-in-out infinite;
          overflow: hidden;
        }
        .kitty-eye-pupil {
          position: absolute;
          width: 12px;
          height: 13px;
          background: radial-gradient(circle at 40% 40%, #4a3020 0%, #2C1810 100%);
          border-radius: 50%;
          bottom: 2px;
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
          left: 7px;
          z-index: 1;
        }
        .kitty-eye.left { right: 44px; }
        .kitty-eye.right { right: 18px; }
        /* Nose */
        .kitty-nose {
          position: absolute;
          bottom: 30px;
          right: 36px;
          width: 12px;
          height: 8px;
          background: #E8928B;
          border-radius: 50% 50% 45% 45%;
          z-index: 2;
        }
        /* Mouth lines */
        .kitty-mouth-line {
          position: absolute;
          bottom: 28px;
          width: 2px;
          height: 8px;
          background: #C4A090;
          border-radius: 1px;
          z-index: 2;
        }
        .kitty-mouth-line::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 10px;
          height: 1.5px;
          background: #C4A090;
          border-radius: 2px;
        }
        .kitty-mouth-line.left { right: 44px; }
        .kitty-mouth-line.right { right: 30px; }
        /* Whiskers */
        .kitty-whisker {
          position: absolute;
          height: 1px;
          background: #D4B896;
          z-index: 2;
        }
        .kitty-whisker.w1 { width: 24px; top: 42px; right: 52px; transform: rotate(-12deg); }
        .kitty-whisker.w2 { width: 22px; top: 46px; right: 54px; transform: rotate(2deg); }
        .kitty-whisker.w3 { width: 22px; top: 42px; right: 6px; transform: rotate(12deg); }
        .kitty-whisker.w4 { width: 20px; top: 46px; right: 4px; transform: rotate(-2deg); }
        /* Tabby M marking */
        .kitty-tabby {
          position: absolute;
          top: 12px;
          right: 22px;
          width: 28px;
          height: 16px;
        }
        .kitty-tabby::before {
          content: 'M';
          position: absolute;
          font-family: serif;
          font-size: 20px;
          font-weight: bold;
          color: #C47020;
          opacity: 0.5;
          letter-spacing: 2px;
        }
        /* Paws gripping edge */
        .kitty-paw {
          position: absolute;
          right: 8px;
          width: 28px;
          height: 22px;
          background: linear-gradient(180deg, #F5A623 0%, #E8912D 100%);
          border-radius: 45% 45% 50% 50%;
          box-shadow: 0 3px 6px rgba(0,0,0,0.1);
          z-index: 3;
          animation: pawGrip 2.5s ease-in-out infinite;
          transform-origin: top center;
        }
        .kitty-paw.top { top: 50px; }
        .kitty-paw.bottom { top: 78px; animation-delay: 0.6s; }
        .kitty-paw-dot {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 8px;
          background: #F8C8A0;
          border-radius: 50%;
        }
      `}</style>

      <div className="kitty-scene">
        {/* Body */}
        <div className="kitty-body" />

        {/* Head */}
        <div className="kitty-head">
          {/* Ears */}
          <div className="kitty-ear left">
            <div className="kitty-ear-inner" />
          </div>
          <div className="kitty-ear right">
            <div className="kitty-ear-inner" />
          </div>

          {/* Tabby M */}
          <div className="kitty-tabby" />

          {/* Eyes */}
          <div className="kitty-eye left">
            <div className="kitty-eye-pupil" />
            <div className="kitty-eye-shine" />
            <div className="kitty-eye-shine2" />
          </div>
          <div className="kitty-eye right">
            <div className="kitty-eye-pupil" />
            <div className="kitty-eye-shine" />
            <div className="kitty-eye-shine2" />
          </div>

          {/* Muzzle */}
          <div className="kitty-muzzle" />

          {/* Nose */}
          <div className="kitty-nose" />

          {/* Mouth */}
          <div className="kitty-mouth-line left" />
          <div className="kitty-mouth-line right" />

          {/* Whiskers */}
          <div className="kitty-whisker w1" />
          <div className="kitty-whisker w2" />
          <div className="kitty-whisker w3" />
          <div className="kitty-whisker w4" />
        </div>

        {/* Paws gripping screen edge */}
        <div className="kitty-paw top">
          <div className="kitty-paw-dot" />
        </div>
        <div className="kitty-paw bottom">
          <div className="kitty-paw-dot" />
        </div>
      </div>
    </div>
  );
}
