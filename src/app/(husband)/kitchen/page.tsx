import { getPendingOrders, getCompletedOrders } from "@/lib/db/orders";
import { KitchenClient } from "./_components/KitchenClient";

export default async function KitchenPage() {
  const [activeOrders, completedOrders] = await Promise.all([
    getPendingOrders(),
    getCompletedOrders(),
  ]);

  return <KitchenClient activeOrders={activeOrders} completedOrders={completedOrders} />;
}
