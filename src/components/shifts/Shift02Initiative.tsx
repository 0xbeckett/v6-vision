import { ShiftSection } from "@/components/site/ShiftSection";
import { SHIFTS } from "@/content/shifts";

/* shift 02. own file so branch #45.2 can pass a `demo` node here without
   touching the other four sections. */
export function Shift02Initiative() {
  return <ShiftSection shift={SHIFTS[1]} />;
}
