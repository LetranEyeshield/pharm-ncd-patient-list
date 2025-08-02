"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePatient } from "@/app/actions/patient";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await deletePatient(id);
          router.refresh(); // Refresh the list after deletion
        });
      }}
      disabled={isPending}
      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
