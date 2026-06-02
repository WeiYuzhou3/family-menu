import Image from "next/image";

export function KittyCorner() {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 200,
        pointerEvents: "none",
        userSelect: "none",
        animation: "kittyFloat 4s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes kittyFloat {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
      <Image
        src="/橘猫.png"
        alt="橘猫"
        width={70}
        height={70}
        priority
        style={{ objectFit: "contain", mixBlendMode: "multiply" }}
      />
    </div>
  );
}
