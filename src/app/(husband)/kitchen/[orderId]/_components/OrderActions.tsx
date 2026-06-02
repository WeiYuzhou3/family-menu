"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { markOrderStatusAction } from "../../actions";
import type { OrderStatus } from "@/lib/supabase/types";

interface OrderActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "开始制作",
  preparing: "标记完成",
};

const NEXT_STATUS: Record<string, OrderStatus> = {
  pending: "preparing",
  preparing: "completed",
};

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nextStatus = NEXT_STATUS[currentStatus];

  async function handleAction() {
    if (!nextStatus) return;
    setLoading(true);
    setError("");

    const result = await markOrderStatusAction(orderId, nextStatus);

    if (!result.success) {
      setError(result.error || "操作失败");
      setLoading(false);
    } else {
      setLoading(false);
      if (nextStatus === "completed") {
        router.push("/kitchen");
      } else {
        router.refresh();
      }
    }
  }

  if (!nextStatus) return null;

  const Icon = nextStatus === "preparing" ? Play : Check;

  return (
    <div className="fixed bottom-20 inset-x-0 z-40 px-4">
      <div className="max-w-2xl mx-auto space-y-2">
        {error && (
          <p className="text-danger text-xs text-center">{error}</p>
        )}
        <Button
          size="lg"
          className="w-full shadow-elevated"
          onClick={handleAction}
          loading={loading}
          variant={nextStatus === "completed" ? "primary" : "secondary"}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
          {STATUS_LABELS[currentStatus]}
        </Button>
      </div>
    </div>
  );
}
