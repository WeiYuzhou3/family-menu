import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { HusbandNav } from "./_components/HusbandNav";

export default async function HusbandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.role !== "husband") {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-20">{children}</main>
      <HusbandNav />
    </div>
  );
}
