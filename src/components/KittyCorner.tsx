"use client";

export function KittyCorner() {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 16,
        zIndex: 200,
        fontSize: 36,
        cursor: "default",
        userSelect: "none",
        animation: "kittyFloat 4s ease-in-out infinite",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
      }}
      title="橘花猫"
    >
      <style>{`
        @keyframes kittyFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(-2deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes kittyTail {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
      <span style={{ display: "inline-block", animation: "kittyTail 1.5s ease-in-out infinite", transformOrigin: "bottom right" }}>
        🐈
      </span>
    </div>
  );
}
