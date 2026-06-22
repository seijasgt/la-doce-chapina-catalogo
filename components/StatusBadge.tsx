import type { ComputedStatus } from "@/lib/types";
import { STATUS_LABEL, STATUS_COLOR } from "@/lib/utils";

export default function StatusBadge({ status }: { status: ComputedStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_COLOR[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
