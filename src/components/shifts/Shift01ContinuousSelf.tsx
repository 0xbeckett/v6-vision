import { ShiftSection } from "@/components/site/ShiftSection";
import { SHIFTS } from "@/content/shifts";

/* shift 01. own file so branch #45.2 can pass a `demo` node here without
   touching the other four sections. */
export function Shift01ContinuousSelf() {
  return <ShiftSection shift={SHIFTS[0]} />;
}
