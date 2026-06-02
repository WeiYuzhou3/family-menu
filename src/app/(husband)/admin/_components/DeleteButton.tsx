"use client";

import { Trash2 } from "lucide-react";
import { deleteDishAction } from "../actions";

interface DeleteButtonProps {
  dishId: string;
  dishName: string;
}

export function DeleteButton({ dishId, dishName }: DeleteButtonProps) {
  return (
    <form action={deleteDishAction.bind(null, dishId)}>
      <button
        type="submit"
        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-bg-base transition-colors"
        onClick={(e) => {
          if (!confirm(`确定删除「${dishName}」吗？`)) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
