import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { WifeNav } from "./_components/WifeNav";
import { WifeLayoutClient } from "./_components/WifeLayoutClient";
import { FloatingCartBadge } from "./_components/FloatingCartBadge";

export default async function WifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.role !== "wife") {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <WifeLayoutClient>
        <main className="flex-1 pb-20">{children}</main>
        <FloatingCartBadge />
      </WifeLayoutClient>
      <WifeNav />
    </div>
  );
}
