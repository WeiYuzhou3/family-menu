export function KittyCorner() {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 200,
        pointerEvents: "none",
      }}
    >
      <img
        src="/橘猫.png"
        alt="橘猫"
        width={70}
        height={70}
        style={{ display: "block" }}
      />
    </div>
  );
}
