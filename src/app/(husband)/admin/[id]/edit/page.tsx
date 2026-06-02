import { notFound } from "next/navigation";
import { getDishById } from "@/lib/db/dishes";
import { DishForm } from "@/components/DishForm";
import { PageTransition } from "@/components/ui/PageTransition";

interface EditDishPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDishPage({ params }: EditDishPageProps) {
  const { id } = await params;
  const dish = await getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <PageTransition className="max-w-2xl mx-auto px-4 py-6">
      <DishForm dish={dish} />
    </PageTransition>
  );
}
