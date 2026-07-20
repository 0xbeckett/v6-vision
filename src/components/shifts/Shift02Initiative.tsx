import { ShiftSection } from "@/components/site/ShiftSection";
import { Initiative } from "@/components/artifacts/Initiative";
import { SHIFTS } from "@/content/shifts";

/* shift 02. advance the clock and watch v6 arrive with the fix before the alert
   that would have summoned v5 even fires. */
export function Shift02Initiative() {
  return <ShiftSection shift={SHIFTS[1]} demo={<Initiative />} />;
}
